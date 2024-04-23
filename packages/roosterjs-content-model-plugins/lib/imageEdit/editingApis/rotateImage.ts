import { IEditor } from 'roosterjs-content-model-types';

/**
 *
 * @param editor The editor instance
 */
export function rotateImage(editor: IEditor, degree: number) {
    const selection = editor.getDOMSelection();
    if (selection?.type === 'image') {
        editor.triggerEvent('editImage', {
            image: selection.image,
            previousSrc: selection.image.src,
            newSrc: selection.image.src,
            originalSrc: selection.image.src,
            apiOperation: {
                action: 'rotate',
                angleRad: degreesToRadians(degree),
            },
        });
    }
}

function degreesToRadians(degrees: number) {
    return degrees * (Math.PI / 180);
}
