import execFormatWithUndo from './execFormatWithUndo';
import getFormatState  from './getFormatState';
import getBlockQuoteElement from './getBlockQuoteState';
import { ContentScope, ContentPosition } from 'roosterjs-editor-types';
import { unwrap } from 'roosterjs-editor-dom';
import { Editor } from 'roosterjs-editor-core';

export default function toggleBlockQuote(editor: Editor, styler: (element: HTMLElement) => void): void {
    editor.focus();
    let formatter: () => void = null;
    let formatState = editor ? getFormatState(editor) : null;
    let contentTraverser = editor.getContentTraverser(ContentScope.Selection);
    let blockElement = contentTraverser.currentBlockElement;

    if (!formatState.isBlockQuote) {
        let range = editor.getSelectionRange();
        let quoteElement = editor.getDocument().createElement('blockquote');

        // We only style the quoteElement, for styles in child nodes, we leave them as is
        styler(quoteElement);

        // If block element is null, we create a new node and wrap with blockquote, otherwise we wrap the existing node with blockquote
        if (blockElement != null) {
            let containerNode = blockElement.getStartNode();
            quoteElement.appendChild(containerNode);
        } else {
            let brNode = editor.getDocument().createElement('br');
            let div = editor.getDocument().createElement('div');
            div.appendChild(brNode);
            quoteElement.appendChild(div);
        }

        formatter = () => {
            editor.insertNode(quoteElement, {
                position: ContentPosition.SelectionStart,
                updateCursor: true,
                replaceSelection: true,
                insertOnNewLine: false,
            });
            range.selectNode(quoteElement.lastChild);
            range.collapse(false);
            editor.updateSelection(range);
        };

        if (formatter) {
            execFormatWithUndo(editor, formatter);
        }
    } else {
        //To do set selection after unwrap
        if (blockElement != null) {
            let containerNode = blockElement.getStartNode();
            let element = getBlockQuoteElement(editor, containerNode);
            if (element != null) {
                let formatter = () => unwrap(element);
                if (formatter) {
                    execFormatWithUndo(editor, formatter);
                }
            }
        }
    }
}