import blockFormat from '../utils/blockFormat';
import { BlockElement, IEditor, Indentation, RegionBase } from 'roosterjs-editor-types';
import {
    collapseNodesInRegion,
    createVListFromRegion,
    findClosestElementAncestor,
    getSelectedBlockElementsInRegion,
    getTagOfNode,
    isNodeInRegion,
    splitBalancedNodeRange,
    toArray,
    unwrap,
    wrap,
} from 'roosterjs-editor-dom';

const BlockWrapper = '<blockquote style="margin-top:0;margin-bottom:0"></blockquote>';

/**
 * @internal
 */
export default function experimentSetIndentation(editor: IEditor, indentation: Indentation) {
    const handler = indentation == Indentation.Increase ? indent : outdent;

    blockFormat(editor, (region, start, end) => {
        const blocks = getSelectedBlockElementsInRegion(region, true /*createBlockIfEmpty*/);
        const blockGroups: BlockElement[][] = [[]];

        for (let i = 0; i < blocks.length; i++) {
            const startNode = blocks[i].getStartNode();
            const vList = createVListFromRegion(region, true /*includeSiblingLists*/, startNode);

            if (vList) {
                blockGroups.push([]);
                while (blocks[i + 1] && vList.contains(blocks[i + 1].getStartNode())) {
                    i++;
                }
                vList.setIndentation(start, end, indentation);
                vList.writeBack();
            } else {
                blockGroups[blockGroups.length - 1].push(blocks[i]);
            }
        }

        blockGroups.forEach(group => handler(region, group));
    });
}

function indent(region: RegionBase, blocks: BlockElement[]) {
    const nodes = collapseNodesInRegion(region, blocks);
    wrap(nodes, BlockWrapper);
}

function outdent(region: RegionBase, blocks: BlockElement[]) {
    blocks.forEach(blockElement => {
        let node = blockElement.collapseToSingleElement();
        const quote = findClosestElementAncestor(node, region.rootNode, 'blockquote');
        if (quote) {
            if (node == quote) {
                node = wrap(toArray(node.childNodes));
            }

            while (isNodeInRegion(region, node) && getTagOfNode(node) != 'BLOCKQUOTE') {
                node = splitBalancedNodeRange(node);
            }

            if (isNodeInRegion(region, node)) {
                unwrap(node);
            }
        }
    });
}
