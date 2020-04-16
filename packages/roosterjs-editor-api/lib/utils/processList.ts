import { Browser, getRangeFromSelectionPath, getSelectionPath } from 'roosterjs-editor-dom';
import { DocumentCommand } from 'roosterjs-editor-types';
import { Editor } from 'roosterjs-editor-core';
import { isHTMLElement } from 'roosterjs-cross-window';

export type ValidProcessListDocumentCommands =
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
    let clonedCursorNode: Node;
    let cursorSelectionPath;

    // Chrome has a bug where certain infromation about elements are deleted when outdent or enter on empty line occurs.
    // We need to clone our current LI node so we can replace the new LI node with it post outdent / enter.
    if (Browser.isChrome) {
        const parentLINode = editor.getElementAtCursor('LI');
        if (parentLINode) {
            let currentRange = editor.getSelectionRange();
            if (
                currentRange &&
                (currentRange.collapsed ||
                    (editor.getElementAtCursor('LI', currentRange.startContainer) == parentLINode &&
                        editor.getElementAtCursor('LI', currentRange.endContainer) == parentLINode))
            ) {
                relativeSelectionPath = getSelectionPath(parentLINode, currentRange);
                if (parentLINode.textContent === '') {
                    // If the node is empty, we need to handle this special case.
                    // Chromium will try to replace all empty spans with font tags
                    // We should preserve where our cursor is so that in this case, we can keep the span around.
                    const cursorNode = editor.getElementAtCursor();
                    clonedCursorNode = cursorNode.cloneNode(true);
                    cursorSelectionPath = getSelectionPath(cursorNode, currentRange);
                }
                clonedNode = parentLINode.cloneNode(true);
            }
        }
    }

    let existingList = editor.getElementAtCursor('OL,UL');
    editor.getDocument().execCommand(command, false, null);
    const newParentNode = editor.getElementAtCursor('LI');
    let newList = editor.getElementAtCursor('OL,UL');
    if (newList == existingList) {
        newList = null;
    }

    if (Browser.isChrome) {
        // This is the normal case for indenting/outdenting within a list
        if (clonedNode && newList && newParentNode) {
            // if the clonedNode and the newLIParent share the same tag name
            // we can 1:1 swap them
            if (isHTMLElement(clonedNode)) {
                if (
                    isHTMLElement(newParentNode) &&
                    clonedNode.tagName == (<HTMLElement>newParentNode).tagName
                ) {
                    newList.replaceChild(clonedNode, newParentNode);
                }
                if (relativeSelectionPath && editor.contains(clonedNode)) {
                    let newRange = getRangeFromSelectionPath(clonedNode, relativeSelectionPath);
                    editor.select(newRange);
                }
            }
            // This is the special handling
        } else if (clonedCursorNode) {
            // Rooster should never be creating FONT tags on it's own,
            // and chromium's behavior is consistant with empty nodes outdenting to a non list block element root.
            const chromeFontTag = editor.getElementAtCursor('FONT');
            if (chromeFontTag) {
                chromeFontTag.parentNode.replaceChild(clonedCursorNode, chromeFontTag);
                if (
                    cursorSelectionPath &&
                    isHTMLElement(clonedCursorNode) &&
                    editor.contains(clonedCursorNode)
                ) {
                    let newRange = getRangeFromSelectionPath(clonedCursorNode, cursorSelectionPath);
                    editor.select(newRange);
                }
            }
        }
    }
    return newList;
}
