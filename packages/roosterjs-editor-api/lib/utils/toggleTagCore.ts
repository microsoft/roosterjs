import { ChangeSource, PositionType, QueryScope } from 'roosterjs-editor-types';
import { Editor } from 'roosterjs-editor-core';
import {
    Browser,
    Position,
    wrap,
    unwrap,
    fromHtml,
    getTagOfNode,
    splitBalancedNodeRange,
} from 'roosterjs-editor-dom';

const ZERO_WIDTH_SPACE = '&#8203;';
const UNWRAPPABLE_NODES = 'LI,THEAD,TBODY,TR,TD,TH'.split(',');
const DEFAULT_STYLER = (_: HTMLElement) => {};

/**
 * Toggle a tag at selection, if selection already contains elements of such tag,
 * the elements will be untagge and other elements will take no affect
 * @param editor The editor instance
 * @param tag The tag name
 * @param styler (Optional) The styler for setting the style for the blockquote element
 * @param wrapFunction (Optional) The wrap function
 * @param unwrapFunction (Optional) The unwrap function
 */
export default function toggleTagCore<T extends keyof HTMLElementTagNameMap>(
    editor: Editor,
    tag: T,
    styler?: (element: HTMLElement) => void,
    wrapFunction: (nodes: Node[]) => HTMLElement = nodes => wrap(nodes, tag),
    unwrapFunction: (node: Node) => Node = unwrap
): void {
    editor.focus();
    editor.addUndoSnapshot((start, end) => {
        let result: HTMLElement;
        let range = editor.getSelectionRange();
        if (
            range &&
            editor.queryElements(tag, QueryScope.OnSelection, unwrapFunction).length == 0
        ) {
            let startNode = Position.getStart(range).normalize().node;
            let startBlock = editor.getBlockElementAtNode(startNode);
            let endNode = Position.getEnd(range).normalize().node;
            let endBlock = editor.getBlockElementAtNode(endNode);
            let nodes =
                startBlock && endBlock
                    ? editor.collapseNodes(
                          startBlock.getStartNode(),
                          endBlock.getEndNode(),
                          true /*canSplitParent*/
                      )
                    : [];

            if (nodes.length == 0) {
                // Selection is collapsed and blockElement is null, we need to create an empty div.
                // In case of IE and Edge, we insert ZWS to put cursor in the div, otherwise insert BR node.
                nodes = fromHtml(
                    `<DIV>${Browser.isIEOrEdge ? ZERO_WIDTH_SPACE : '<BR>'}</DIV>`,
                    editor.getDocument()
                );
                editor.insertNode(nodes[0]);
                editor.select(nodes[0], PositionType.Begin);
            } else if (nodes.length == 1) {
                let tag = getTagOfNode(nodes[0]);
                if (tag == 'BR') {
                    nodes = [wrap(nodes[0])];
                } else if (tag == 'LI' || tag == 'TD') {
                    nodes = [].slice.call(nodes[0].childNodes) as Node[];
                }
            } else {
                while (
                    nodes[0] &&
                    editor.contains(nodes[0].parentNode) &&
                    nodes.some(node => UNWRAPPABLE_NODES.indexOf(getTagOfNode(node)) >= 0)
                ) {
                    nodes = [splitBalancedNodeRange(nodes)];
                }
            }

            result = wrapFunction(nodes);
            (styler || DEFAULT_STYLER)(result);
        }

        if (!editor.select(start, end) && result) {
            editor.select(result);
        }

        return result;
    }, ChangeSource.Format);
}
