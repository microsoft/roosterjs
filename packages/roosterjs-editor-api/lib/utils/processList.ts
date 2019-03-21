import { DocumentCommand } from 'roosterjs-editor-types';
import { Editor } from 'roosterjs-editor-core';
import {
    fromHtml,
    isVoidHtmlElement,
    isBlockElement,
    Browser,
} from 'roosterjs-editor-dom';

const TEMP_NODE_CLASS = 'ROOSTERJS_TEMP_NODE_FOR_LIST';
const TEMP_NODE_HTML = "<img class=\"" + TEMP_NODE_CLASS + "\">";
const SELECTION_NODE_CLASS = 'ROOSTERJS_SELECTION_NODE';
const SELECTION_NODE_HTML = "<img class=\"" + SELECTION_NODE_CLASS + "\">";

type ValidProcessListDocumentCommands = DocumentCommand.Outdent | DocumentCommand.Indent | DocumentCommand.InsertOrderedList | DocumentCommand.InsertUnorderedList;

/**
 * Browsers don't handle bullet/numbering list well, especially the formats when switching list statue
 * So we workaround it by always adding format to list element
 */
export default function processList(editor: Editor, command: ValidProcessListDocumentCommands): Node {
    let currentNode = editor.getElementAtCursor();

    // track the current cursor position with a dummy element.
    const currentRange = editor.getSelectionRange();
    if (currentRange) {
        const selectionNode = fromHtml(SELECTION_NODE_HTML, editor.getDocument())[0];
        editor.getSelectionRange().insertNode(selectionNode);
    }

    let clonedNode;
    if (Browser.isChrome && command == DocumentCommand.Outdent) {
        // Chrome has some bad behavior when outdenting
        // in order to work around this, we need to take steps to deep clone the current node
        // after the outdent, we'll replace the new LI with the cloned content.
        clonedNode = currentNode.cloneNode(true);
        workaroundForChrome(editor);
    }

    let existingList = editor.getElementAtCursor('OL,UL');
    editor.getDocument().execCommand(command, false, null);
    let newLIParent: HTMLElement;
    editor.queryElements('.' + TEMP_NODE_CLASS, node => {
        newLIParent = node.parentElement;
        editor.deleteNode(node);
    });
    let newList = editor.getElementAtCursor('OL,UL');
    if (newList == existingList) {
        newList = null;
    }

    if (newList && clonedNode && newLIParent) {
        // if the clonedNode and the newLIParent share the same tag name
        // we can 1:1 swap them
        if ((clonedNode instanceof HTMLElement) && clonedNode.tagName == newLIParent.tagName) {
            newList.replaceChild(clonedNode, newLIParent);
        }
        // The alternative case is harder to solve, but we didn't specifically handle this before either.
    }

    editor.queryElements("." + SELECTION_NODE_CLASS, node => {
        editor.select(node);
        editor.deleteNode(node);
    });

    return newList;
}

function workaroundForChrome(editor: Editor) {
    let traverser = editor.getSelectionTraverser();
    let block = traverser && traverser.currentBlockElement;
    while (block) {
        let container = block.getStartNode();

        if (container) {
            // Add a temp <IMG> tag before all other nodes in the block to avoid Chrome remove existing format when toggle list
            const tempNode = fromHtml(TEMP_NODE_HTML, editor.getDocument())[0];
            if (isVoidHtmlElement(container) || !isBlockElement(container)) {
                container.parentNode.insertBefore(tempNode, container);
            } else {
                container.insertBefore(tempNode, container.firstChild);
            }
        }

        block = traverser.getNextBlockElement();
    }
}
