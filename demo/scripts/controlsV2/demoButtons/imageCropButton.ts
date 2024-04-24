import type { RibbonButton } from '../roosterjsReact/ribbon';

/**
 * @internal
 * "Crop Image" button on the format ribbon
 */
export const imageCropButton: RibbonButton<'buttonNameCropImage'> = {
    key: 'buttonNameCropImage',
    unlocalizedText: 'Crop Image',
    iconName: 'Crop',
    isDisabled: formatState => !formatState.canAddImageAltText,
    onClick: editor => {
        const selection = editor.getDOMSelection();
        if (selection?.type === 'image') {
            editor.triggerEvent('editImage', {
                image: selection.image,
                previousSrc: selection.image.src,
                newSrc: selection.image.src,
                originalSrc: selection.image.src,
                apiOperation: {
                    action: 'crop',
                },
            });
        }
    },
};
