import contains from '../utils/contains';
import findClosestElementAncestor from '../utils/findClosestElementAncestor';
import Position from '../selection/Position';
import queryElements from '../utils/queryElements';
import { getNextLeafSibling, getPreviousLeafSibling } from '../utils/getLeafSibling';
import { QueryScope, Region, RegionType } from 'roosterjs-editor-types';
import type { CompatibleRegionType } from 'roosterjs-editor-types/lib/compatibleTypes';

interface RegionTypeData {
    /**
     * Tags that child elements will be skipped
     */
    skipTags: string[];

    /**
     * Selector of outer node of a region
     */
    outerSelector: string;

    /**
     * Selector of inner node of a region
     */
    innerSelector: string;
}

const regionTypeData: Record<RegionType, RegionTypeData> = {
    [RegionType.Table]: {
        skipTags: ['TABLE'],
        outerSelector: 'table',
        innerSelector: 'td,th',
    },
};

/**
 * Get regions impacted by the given range under the root node
 * @param root Root node to get regions from
 * @param range A selection range. Regions will be created according to this range. Each region will be
 * fully or partially covered by this range.
 * @param type Type of region. Currently we only support TABLE region.
 */
export default function getRegionsFromRange(
    root: HTMLElement,
    range: Range,
    type: RegionType | CompatibleRegionType
): Region[] {
    let regions: Region[] = [];
    if (root && range) {
        const { innerSelector, skipTags } = regionTypeData[type];
        const boundaryTree = buildBoundaryTree(root, range, type);
        const start = findClosestElementAncestor(range.startContainer, root, innerSelector) || root;
        const end = findClosestElementAncestor(range.endContainer, root, innerSelector) || root;
        const creator = getRegionCreator(range, skipTags);
        [regions] = iterateNodes(creator, boundaryTree, start, end);
    }

    return regions.filter(r => !!r);
}

/**
 * @internal export for test only
 */
export function getRegionCreator(
    fullRange: Range,
    skipTags: string[]
): (rootNode: HTMLElement, nodeBefore?: Node, nodeAfter?: Node) => Region | null {
    const fullSelectionStart = Position.getStart(fullRange).normalize();
    const fullSelectionEnd = Position.getEnd(fullRange).normalize();
    return (rootNode: HTMLElement, nodeBefore?: Node, nodeAfter?: Node) => {
        return areNodesValid(rootNode, nodeBefore, nodeAfter, skipTags)
            ? {
                  rootNode,
                  nodeBefore,
                  nodeAfter,
                  skipTags,
                  fullSelectionStart,
                  fullSelectionEnd,
              }
            : null;
    };
}

/**
 * This is a internal data structure used for build regions.
 * We firstly split the selection by some boundaries, then we can build region from these boundaries.
 */
interface Boundary {
    /**
     * inner node of this boundary
     */
    innerNode: HTMLElement;

    /**
     * Children of this boundary
     */
    children: {
        /**
         * Outer node of a boundary child
         */
        outerNode: Node;

        /**
         * Child boundaries
         */
        boundaries: Boundary[];
    }[];
}

/**
 * Step 1: Build boundary tree
 * @param root Root node of the whole scope, normally this will be the root of editable scope
 * @param range Existing selected full range
 * @param type Type of region to create
 */
function buildBoundaryTree(
    root: HTMLElement,
    range: Range,
    type: RegionType | CompatibleRegionType
): Boundary {
    const allBoundaries: Boundary[] = [{ innerNode: root, children: [] }];
    const { outerSelector, innerSelector } = regionTypeData[type];
    const inSelectionOuterNode = queryElements(
        root,
        outerSelector,
        null /*callback*/,
        QueryScope.InSelection,
        range
    );

    // According to https://www.w3.org/TR/selectors-api/#queryselectorall, the result of querySelectorAll
    // is in document order, which is what we expect. So we don't need to sort the result here.
    queryElements(
        root,
        innerSelector,
        thisInnerNode => {
            const thisOuterNode = findClosestElementAncestor(thisInnerNode, root, outerSelector);
            if (thisOuterNode && inSelectionOuterNode.indexOf(thisOuterNode) < 0) {
                const boundary: Boundary = { innerNode: thisInnerNode, children: [] };

                for (let i = allBoundaries.length - 1; i >= 0; i--) {
                    const { innerNode, children } = allBoundaries[i];
                    if (contains(innerNode, thisOuterNode)) {
                        let child = children.filter(c => c.outerNode == thisOuterNode)[0];

                        if (!child) {
                            child = { outerNode: thisOuterNode, boundaries: [] };
                            children.push(child);
                        }

                        child.boundaries.push(boundary);
                        break;
                    }
                }
                allBoundaries.push(boundary);
            }
        },
        QueryScope.OnSelection,
        range
    );

    return allBoundaries[0];
}

/**
 * Step 2: Recursively iterate all boundaries and create regions
 * @param creator A region creator function to help create region
 * @param boundary Current root boundary
 * @param start A node where full range start from. This may not be the direct node container of range.startContainer.
 * It is the nearest ancestor which satisfies the InnerSelector of the given region type
 * @param end A node where full range end from. This may not be the direct node container of range.endContainer.
 * It is the nearest ancestor which satisfies the InnerSelector of the given region type
 * @param started Whether we have already hit the start node
 */
function iterateNodes(
    creator: (rootNode: HTMLElement, nodeBefore?: Node, nodeAfter?: Node) => Region | null,
    boundary: Boundary,
    start: Node,
    end: Node,
    started?: boolean
): [Region[], boolean, boolean] {
    started = started || boundary.innerNode == start;
    let ended = false;
    const { children, innerNode } = boundary;
    let regions: Region[] = [];

    if (children.length == 0) {
        const region = creator(innerNode);
        if (region) {
            regions.push(region);
        }
    } else {
        // Need to run one more time to add region after all children
        for (let i = 0; i <= children.length && !ended; i++) {
            const { outerNode, boundaries } = children[i] || {};
            const previousOuterNode = children[i - 1]?.outerNode;
            if (started) {
                const region = creator(innerNode, previousOuterNode, outerNode);
                if (region) {
                    regions.push(region);
                }
            }

            boundaries?.forEach(child => {
                let newRegions: Region[];
                [newRegions, started, ended] = iterateNodes(creator, child, start, end, started);
                regions = regions.concat(newRegions);
            });
        }
    }

    return [regions, started, ended || innerNode == end];
}

/**
 * Check if the given nodes combination is valid to create a region.
 * A combination is valid when:
 * 1. Root node is not null and is not empty. And
 * 2. For nodeBefore and nodeAfter, each of them should be either null or contained by root node. And
 * 3. If none of nodeBefore and nodeAfter is null, the should not contain each other, and there should be
 * node between them.
 * @param root Root node of region
 * @param nodeBefore The boundary node before the region under root
 * @param nodeAfter The boundary node after the region under root
 * @param skipTags Tags to skip
 */
function areNodesValid(
    root: Node,
    nodeBefore: Node | undefined,
    nodeAfter: Node | undefined,
    skipTags: string[]
) {
    if (!root) {
        return false;
    } else {
        const firstNodeOfRegion = nodeBefore && getNextLeafSibling(root, nodeBefore, skipTags);
        const lastNodeOfRegion = nodeAfter && getPreviousLeafSibling(root, nodeAfter, skipTags);
        const firstNodeValid =
            !nodeBefore || (contains(root, nodeBefore) && contains(root, firstNodeOfRegion));
        const lastNodeValid =
            !nodeAfter || (contains(root, nodeAfter) && contains(root, lastNodeOfRegion));
        const bothValid =
            !nodeBefore ||
            !nodeAfter ||
            (!contains(nodeBefore, nodeAfter, true /*treatSameAsContain*/) &&
                !contains(nodeBefore, lastNodeOfRegion, true /*treatSameAsContain*/) &&
                !contains(nodeAfter, nodeBefore, true /*treatSameAsContain*/) &&
                !contains(nodeAfter, firstNodeOfRegion, true /*treatSameAsContain*/));
        return firstNodeValid && lastNodeValid && bothValid;
    }
}
