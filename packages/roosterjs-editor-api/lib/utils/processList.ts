import { DocumentCommand } from 'roosterjs-editor-types';
import { Editor } from 'roosterjs-editor-core';
import {
    Browser,
    createRange,
    getSelectionPath,
    splitBalancedNodeRange,
    toArray,
    wrap,
} from 'roosterjs-editor-dom';

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
    let existingList = editor.getElementAtCursor('OL,UL');
    if (Browser.isChrome && command !== DocumentCommand.Indent) {
        // Chrome has a bug where certain information about elements are deleted when outdent or enter on empty line occurs.
        // We need to clone our current LI node so we can replace the new LI node with it post outdent / enter.
        const parentLINode = editor.getElementAtCursor('LI');
        // We must first be in an LI node to do something to fix this.
        if (parentLINode) {
            // We also don't want to try to handle the multi select outdent case at this time.
            // These are already pretty stable in Chromium.
            const currentRange = editor.getSelectionRange();
            const currentSelectionPath = getSelectionPath(parentLINode, currentRange);
            if (
                currentRange &&
                (currentRange.collapsed ||
                    (editor.getElementAtCursor('LI', currentRange.startContainer) == parentLINode &&
                        editor.getElementAtCursor('LI', currentRange.endContainer) == parentLINode))
            ) {
                // Handle the case for toggling between the two list types as a special case.
                // We'll let the browser handle this for now.
                if (
                    (existingList.tagName === 'OL' &&
                        command === DocumentCommand.InsertUnorderedList) ||
                    (existingList.tagName === 'UL' && command === DocumentCommand.InsertOrderedList)
                ) {
                    editor.getDocument().execCommand(command, false, null);
                } else {
                    // Get the next highest list element.
                    // In well formed HTML, this should just be the existing list's parent container.
                    const listParent = existingList.parentElement;
                    if (listParent.tagName == 'OL' || listParent.tagName == 'UL') {
                        if (parentLINode.nextElementSibling) {
                            splitBalancedNodeRange(parentLINode);
                        }
                        existingList.insertAdjacentElement('afterend', parentLINode);
                        editor.select(
                            createRange(
                                parentLINode,
                                currentSelectionPath.start,
                                currentSelectionPath.end
                            )
                        );
                    } else {
                        // In this case, we're going out to the parent root.
                        if (parentLINode.nextElementSibling) {
                            splitBalancedNodeRange(parentLINode);
                        }

                        const wrappedContents = wrap(toArray(parentLINode.childNodes));
                        const wrappedRange = createRange(
                            wrappedContents,
                            currentSelectionPath.start,
                            currentSelectionPath.end
                        );
                        const wrappedSelectionPath = getSelectionPath(
                            wrappedContents,
                            wrappedRange
                        );

                        existingList.insertAdjacentElement('afterend', wrappedContents);
                        editor.deleteNode(parentLINode);
                        let newRange = createRange(
                            wrappedContents,
                            wrappedSelectionPath.start,
                            wrappedSelectionPath.end
                        );
                        editor.select(newRange);
                    }

                    if (existingList.childElementCount == 0) {
                        editor.deleteNode(existingList);
                    }
                }
            } else {
                editor.getDocument().execCommand(command, false, null);
            }
        } else {
            editor.getDocument().execCommand(command, false, null);
        }
    } else {
        editor.getDocument().execCommand(command, false, null);
    }
    let newList = editor.getElementAtCursor('OL,UL');
    if (newList == existingList) {
        newList = null;
    }
    return newList;
}
