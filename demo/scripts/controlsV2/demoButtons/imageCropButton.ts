import { cropImage } from 'roosterjs-content-model-plugins';
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
        cropImage(editor);
    },
};
