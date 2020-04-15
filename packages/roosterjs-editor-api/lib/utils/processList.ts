import { DocumentCommand } from 'roosterjs-editor-types';
import { Editor } from 'roosterjs-editor-core';
import { isHTMLElement } from 'roosterjs-cross-window';
import {
    fromHtml,
    isVoidHtmlElement,
    isBlockElement,
    Browser,
    getSelectionPath,
    getRangeFromSelectionPath,
} from 'roosterjs-editor-dom';

const TEMP_NODE_CLASS = 'ROOSTERJS_TEMP_NODE_FOR_LIST';
const TEMP_NODE_HTML = '<img class="' + TEMP_NODE_CLASS + '">';

type ValidProcessListDocumentCommands =
    | DocumentCommand.Outdent
    | DocumentCommand.Indent
    | DocumentCommand.InsertOrderedList
    | DocumentCommand.InsertUnorderedList;

/**
 * Browsers don't handle bullet/numbering list well, especially the formats when switching list statue
 * So we workaround it by always adding format to list element
 */
export default function processList(
    editor: Editor,
    command: ValidProcessListDocumentCommands
): Node {
    let clonedNode: Node;
    let relativeSelectionPath;
    if (Browser.isChrome && command == DocumentCommand.Outdent) {
        const parentLINode = editor.getElementAtCursor('LI');
        if (parentLINode) {
            let currentRange = editor.getSelectionRange();
            if (
                currentRange.collapsed ||
                (editor.getElementAtCursor('LI', currentRange.startContainer) == parentLINode &&
                    editor.getElementAtCursor('LI', currentRange.endContainer) == parentLINode)
            ) {
                relativeSelectionPath = getSelectionPath(parentLINode, currentRange);
                // Chrome has some bad behavior when outdenting
                // in order to work around this, we need to take steps to deep clone the current node
                // after the outdent, we'll replace the new LI with the cloned content.
                clonedNode = parentLINode.cloneNode(true);
            }
        }

        workaroundForChrome(editor);
    }

    let existingList = editor.getElementAtCursor('OL,UL');
    editor.getDocument().execCommand(command, false, null);
    let newParentNode: Node;
    editor.queryElements('.' + TEMP_NODE_CLASS, node => {
        newParentNode = node.parentNode;
        editor.deleteNode(node);
    });
    let newList = editor.getElementAtCursor('OL,UL');
    if (newList == existingList) {
        newList = null;
    }

    if (newList && clonedNode && newParentNode) {
        // if the clonedNode and the newLIParent share the same tag name
        // we can 1:1 swap them
        if (isHTMLElement(clonedNode)) {
            if (
                isHTMLElement(newParentNode) &&
                clonedNode.tagName == (<HTMLElement>newParentNode).tagName
            ) {
                newList.replaceChild(clonedNode, newParentNode);
            }
            if (relativeSelectionPath && editor.getDocument().body.contains(clonedNode)) {
                let newRange = getRangeFromSelectionPath(clonedNode, relativeSelectionPath);
                editor.select(newRange);
            }
        }
        // The alternative case is harder to solve, but we didn't specifically handle this before either.
    }

    return newList;
}

function workaroundForChrome(editor: Editor) {
    let traverser = editor.getSelectionTraverser();
    let block = traverser && traverser.currentBlockElement;
    while (block) {
        let container = block.getStartNode();

        if (container) {
            // Add a temp <IMG> tag after all other nodes in the block to avoid Chrome remove existing format when toggle list
            const tempNode = fromHtml(TEMP_NODE_HTML, editor.getDocument())[0];
            if (isVoidHtmlElement(container) || !isBlockElement(container)) {
                container.parentNode.appendChild(tempNode);
            } else {
                container.appendChild(tempNode);
            }
        }

        block = traverser.getNextBlockElement();
    }
}
