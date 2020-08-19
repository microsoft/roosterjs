import { ChangeSource } from 'roosterjs-editor-types';
import { Editor } from 'roosterjs-editor-core';

/**
 * Rotate an element visually
 * @param editor The editor instance
 * @param element The element that should be rotated
 * @param angle The degree at which to rotate the element from it's center
 */
export default function rotateElement(editor: Editor, element: HTMLElement, angle: number): void {
    if (element) {
        editor.addUndoSnapshot(() => {
            element.style.transform = `rotate(${angle}deg)`;
        }, ChangeSource.Format);
    }
}
