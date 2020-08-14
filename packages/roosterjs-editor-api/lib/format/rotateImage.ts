import { ChangeSource } from 'roosterjs-editor-types';
import { Editor } from 'roosterjs-editor-core';

/**
 * Rotate an image
 * @param editor The editor instance
 * @param image The selected image file
 * @param degreeIncrements The drgree increments at which to rotate the image (90 would rotate 90 degrees clockwise)
 */
export default function rotateImage(editor: Editor, image: HTMLImageElement, degreeIncrements?: number): void {
    if (image) {
        editor.addUndoSnapshot(() => {
            const rotationalValue = degreeIncrements || 90;

            if (image.style.transform) {
                const currentRotation = getCurrentRotationFromTransform(image.style.transform);
                let newRotation = currentRotation + rotationalValue;
                newRotation = newRotation > 360 ? newRotation - 360 : newRotation;
                image.style.transform = `rotate(${newRotation}deg)`;
            } else {
                image.style.transform = `rotate(${rotationalValue}deg)`;
            }
        }, ChangeSource.Format);
    }
}

const getCurrentRotationFromTransform = (transform: string): number => +transform.match(/\d+/);
