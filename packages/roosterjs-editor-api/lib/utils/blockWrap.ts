import blockFormat from './blockFormat';
import { IEditor } from 'roosterjs-editor-types';
import {
    collapseNodesInRegion,
    getSelectedBlockElementsInRegion,
    getTagOfNode,
    isNodeInRegion,
    splitBalancedNodeRange,
    toArray,
    wrap,
} from 'roosterjs-editor-dom';

/**
 * @internal
 * Toggle a tag at selection, if selection already contains elements of such tag,
 * the elements will be untagged and other elements will take no effect
 * @param editor The editor instance
 * @param wrapFunction  The wrap function
 * @param beforeRunCallback A callback function to run before looping all regions. If it returns false,
 * the loop for regions will be skipped
 */
export default function blockWrap(
    editor: IEditor,
    wrapFunction: (nodes: Node[]) => void,
    beforeRunCallback: () => boolean,
    apiName?: string
): void {
    blockFormat(
        editor,
        region => {
            const blocks = getSelectedBlockElementsInRegion(region, true /*createBlockIfEmpty*/);
            let nodes = collapseNodesInRegion(region, blocks);
            if (nodes.length > 0) {
                if (nodes.length == 1) {
                    const NodeTag = getTagOfNode(nodes[0]);
                    if (NodeTag == 'BR') {
                        nodes = [wrap(nodes[0])];
                    } else if (NodeTag == 'LI' || NodeTag == 'TD') {
                        nodes = toArray(nodes[0].childNodes);
                    }
                }

                while (
                    nodes[0] &&
                    nodes[0].parentNode &&
                    isNodeInRegion(region, nodes[0].parentNode) &&
                    nodes.some(node => getTagOfNode(node) == 'LI')
                ) {
                    const result = splitBalancedNodeRange(nodes);
                    nodes = result ? [result] : [];
                }

                wrapFunction(nodes);
            }
        },
        beforeRunCallback,
        apiName
    );
}
