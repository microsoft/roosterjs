import getNodeAtCursor from './getNodeAtCursor';
import { DocumentCommand } from 'roosterjs-editor-types';
import { Editor } from 'roosterjs-editor-core';
import { fromHtml, isVoidHtmlElement, Position, isBlockElement } from 'roosterjs-editor-dom';

const TEMP_NODE_ID = 'ROOSTERJS_TEMP_NODE_FOR_LIST';
const TEMP_NODE_HTML = `<a id="${TEMP_NODE_ID}">&nbsp;</a>`;

/**
 * Browsers don't handle bullet/numbering list well, especially the formats when switching list statue
 * So we workaround it by always adding format to list element
 */
export default function processList(editor: Editor, command: DocumentCommand): Node {
    let range = editor.getSelectionRange();
    if (!range) {
        return null;
    }

    let node = Position.getStart(range).normalize().node;
    let inline = editor.getInlineElementAtNode(node);
    let block = inline && inline.getParentBlock();
    let container = block && block.getContentNodes()[0];

    if (container) {
        // Add a temp <A> tag before all other nodes in the block to avoid Chrome remove existing format when toggle list
        let tempNode = fromHtml(TEMP_NODE_HTML, editor.getDocument())[0];
        if (isBlockElement(container) && !isVoidHtmlElement(container as HTMLElement)) {
            container.insertBefore(tempNode, container.firstChild);
        } else {
            container.parentNode.insertBefore(tempNode, container);
        }
    }

    let existingList = getNodeAtCursor(editor, ['OL', 'UL']);
    editor.getDocument().execCommand(command, false, null);
    editor.queryElements('#' + TEMP_NODE_ID, node => editor.deleteNode(node));
    let newList = getNodeAtCursor(editor, ['OL', 'UL']);

    return newList && newList != existingList ? newList : null;
}
