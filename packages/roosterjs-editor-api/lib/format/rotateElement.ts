import formatUndoSnapshot from '../utils/formatUndoSnapshot';
import { IEditor } from 'roosterjs-editor-types';

/**
 * Rotate an element visually
 * @param editor The editor instance
 * @param element The element that should be rotated
 * @param angle The degree at which to rotate the element from it's center
 */
export default function rotateElement(editor: IEditor, element: HTMLElement, angle: number): void {
    if (element) {
        formatUndoSnapshot(
            editor,
            () => {
                element.style.transform = `rotate(${angle}deg)`;
            },
            'rotateElement'
        );
    }
}
