import getNodeAtCursor from './getNodeAtCursor';
import { DocumentCommand } from 'roosterjs-editor-types';
import { Editor } from 'roosterjs-editor-core';
import {
    fromHtml,
    isVoidHtmlElement,
    isBlockElement,
    Browser,
    isNodeEmpty,
} from 'roosterjs-editor-dom';

const TEMP_NODE_CLASS = 'ROOSTERJS_TEMP_NODE_FOR_LIST';
const TEMP_NODE_HTML = `<img class="${TEMP_NODE_CLASS}">`;

/**
 * Browsers don't handle bullet/numbering list well, especially the formats when switching list statue
 * So we workaround it by always adding format to list element
 */
export default function processList(editor: Editor, command: DocumentCommand): Node {
    if (Browser.isChrome) {
        workaroundForChrome(editor);
    }

    let existingList = getNodeAtCursor(editor, ['OL', 'UL']);
    editor.getDocument().execCommand(command, false, null);
    editor.queryElements('.' + TEMP_NODE_CLASS, node => editor.deleteNode(node));
    let newList = getNodeAtCursor(editor, ['OL', 'UL']);

    return newList && newList != existingList ? newList : null;
}

function workaroundForChrome(editor: Editor) {
    let traverser = editor.getSelectionTraverser();
    let block = traverser && traverser.currentBlockElement;
    while (block) {
        let container = block.getStartNode();

        if (container && !isNodeEmpty(container)) {
            // Add a temp <IMG> tag before all other nodes in the block to avoid Chrome remove existing format when toggle list
            let tempNode = fromHtml(TEMP_NODE_HTML, editor.getDocument())[0];
            if (isVoidHtmlElement(container) || !isBlockElement(container)) {
                container.parentNode.insertBefore(tempNode, container);
            } else {
                container.insertBefore(tempNode, container.firstChild);
            }
        }

        block = traverser.getNextBlockElement();
    }
}
