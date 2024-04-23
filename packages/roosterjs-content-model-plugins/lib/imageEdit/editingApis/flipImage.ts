import { IEditor } from 'roosterjs-content-model-types';

/**
 *
 * @param editor The editor instance
 */
export function flipImage(editor: IEditor, direction: 'horizontal' | 'vertical') {
    const selection = editor.getDOMSelection();
    if (selection?.type === 'image') {
        editor.triggerEvent('editImage', {
            image: selection.image,
            previousSrc: selection.image.src,
            newSrc: selection.image.src,
            originalSrc: selection.image.src,
            apiOperation: {
                action: 'flip',
                flipDirection: direction,
            },
        });
    }
}
