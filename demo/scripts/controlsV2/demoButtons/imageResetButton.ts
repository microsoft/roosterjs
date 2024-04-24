import { resetImage } from 'roosterjs-content-model-plugins';
import type { RibbonButton } from '../roosterjsReact/ribbon';

/**
 * @internal
 * "Reset Image" button on the format ribbon
 */
export const imageResetButton: RibbonButton<'buttonNameResetImage'> = {
    key: 'buttonNameResetImage',
    unlocalizedText: 'Reset Image',
    iconName: 'Photo2Remove',
    isDisabled: formatState => !formatState.canAddImageAltText,
    onClick: editor => {
        resetImage(editor);
    },
};
