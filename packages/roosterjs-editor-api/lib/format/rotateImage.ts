import { ChangeSource } from 'roosterjs-editor-types';
import { Editor } from 'roosterjs-editor-core';

/**
 * Rotate an image
 * @param editor The editor instance
 * @param image The selected image file
 * @param angle The degree at which to rotate the image from it's center
 */
export default function rotateImage(editor: Editor, image: HTMLImageElement, angle: number): void {
    if (image) {
        editor.addUndoSnapshot(() => {
            image.style.transform = `rotate(${angle}deg)`;
        }, ChangeSource.Format);
    }
}
