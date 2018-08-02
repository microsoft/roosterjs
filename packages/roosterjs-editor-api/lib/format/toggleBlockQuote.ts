import {
    Browser,
    Position,
    unwrap,
    wrap,
    fromHtml,
    getTagOfNode,
    splitBalancedNodeRange,
} from 'roosterjs-editor-dom';
import { ChangeSource, PositionType, QueryScope } from 'roosterjs-editor-types';
import { Editor } from 'roosterjs-editor-core';

const ZERO_WIDTH_SPACE = '&#8203;';
const UNWRAPPABLE_NODES = 'LI,THEAD,TBODY,TR,TD,TH'.split(',');

let defaultStyler = (element: HTMLElement) => {
    element.style.borderLeft = '3px solid';
    element.style.borderColor = '#C8C8C8';
    element.style.paddingLeft = '10px';
    element.style.color = '#666666';
};

/**
 * Toggle blockquote at selection, if selection already contains any blockquoted elements,
 * the blockquoted elements will be unblockquoted and other elements will take no affect
 * @param editor The editor instance
 * @param styler (Optional) The custom styler for setting the style for the
 * blockquote element
 */
export default function toggleBlockQuote(editor: Editor, styler?: (element: HTMLElement) => void) {
    editor.focus();
    editor.addUndoSnapshot((start, end) => {
        let quoteElement: HTMLElement;
        let range = editor.getSelectionRange();
        if (
            range &&
            editor.queryElements('blockquote', QueryScope.OnSelection, unwrap).length == 0
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

            quoteElement = wrap(nodes, 'blockquote');
            (styler || defaultStyler)(quoteElement);
        }

        if (!editor.select(start, end) && quoteElement) {
            editor.select(quoteElement);
        }

        return quoteElement;
    }, ChangeSource.Format);
}
