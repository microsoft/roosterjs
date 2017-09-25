import execFormatWithUndo from './execFormatWithUndo';
import getFormatState  from './getFormatState';
import getBlockQuoteElement from './getBlockQuoteState';
import { ContentScope, ContentPosition, NodeBoundary } from 'roosterjs-editor-types';
import { unwrap, wrapAll, wrap } from 'roosterjs-editor-dom';
import { Editor, browserData } from 'roosterjs-editor-core';

var ZERO_WIDTH_SPACE = '&#8203;';

export default function toggleBlockQuote(editor: Editor, styler: (element: HTMLElement) => void): void {
    editor.focus();
    let formatter: () => void = null;
    let formatState = editor ? getFormatState(editor) : null;
    let contentTraverser = editor.getContentTraverser(ContentScope.Selection);
    let blockElement = contentTraverser.currentBlockElement;
    let range = editor.getSelectionRange();

    if (!formatState.isBlockQuote) {
        formatter = () => {
            let nodes: Node[];
            let startContainer: Node;
            let startOffset: number;

            // If there's content in the block, move the whole block into blockquote
            if (blockElement) {
                nodes = blockElement.getContentNodes();
                startContainer = range.startContainer;
                startOffset = range.startOffset;

                // If the only content node is <BR>, we wrap it with <DIV>, otherwise the format will break. This often happens in firefox.
                if (nodes.length == 1 && nodes[0].nodeName == 'BR') {
                    nodes[0] = wrap(nodes[0], '<div></div>') as HTMLDivElement;
                    startContainer = nodes[0];
                    startOffset = NodeBoundary.Begin;
                }
            } else { // blockElment is null, we need to create an empty div. In case of IE and Edge, we insert ZWS to put cursor in the div, otherwise insert BR node
                let div = editor.getDocument().createElement('div');

                if (browserData.isEdge || browserData.isIE) {
                    div.innerHTML = ZERO_WIDTH_SPACE;
                } else {
                    let brNode = editor.getDocument().createElement('br');
                    div.appendChild(brNode);
                }
                editor.insertNode(div, {
                    position: ContentPosition.SelectionStart,
                    updateCursor: true,
                    replaceSelection: true,
                    insertOnNewLine: false,
                });
                startContainer = div.firstChild;
                startOffset = NodeBoundary.Begin;
                nodes = [div];
            }

            let quoteElement = wrapAll(nodes, '<blockquote></blockqupte>') as HTMLQuoteElement;
            styler(quoteElement);
            updateSelection(range, editor, startContainer, startOffset);
        };

        if (formatter) {
            execFormatWithUndo(editor, formatter);
        }
    } else {
        // The current selection is inside a blockquote, need to unblockquote the blockElement
        if (blockElement) {
            let containerNode = blockElement.getStartNode();
            let blockQuoteElement = getBlockQuoteElement(editor, containerNode);
            if (blockQuoteElement) {
                let formatter = () => {
                    let startContainer = range.startContainer;
                    let startOffset = range.startOffset;
                    unwrap(blockQuoteElement);
                    updateSelection(range, editor, startContainer, startOffset);
                };
                if (formatter) {
                    execFormatWithUndo(editor, formatter);
                }
            }
        }
    }
}

function updateSelection(range: Range, editor: Editor, startContainer: Node, startOffset: number) {
    if (editor.contains(startContainer)) {
        editor.focus();
        range.setStart(startContainer, startOffset);
        range.collapse(true /*toStart*/);
        editor.updateSelection(range);
    }
}