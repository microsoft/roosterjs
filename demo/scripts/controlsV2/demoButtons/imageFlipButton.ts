import { flipImage } from 'roosterjs-content-model-plugins';
import { IEditor } from 'roosterjs-content-model-types';
import type { RibbonButton } from '../roosterjsReact/ribbon';

const directions: Record<string, string> = {
    horizontal: 'horizontal',
    vertical: 'vertical',
};

/**
 * @internal
 * "Flip Image" button on the format ribbon
 */
export const imageFlipButton: RibbonButton<'buttonNameFlipImage'> = {
    key: 'buttonNameFlipImage',
    unlocalizedText: 'Flip Image',
    iconName: 'ImagePixel',
    dropDownMenu: {
        items: directions,
        allowLivePreview: true,
    },
    isDisabled: formatState => !formatState.canAddImageAltText,
    onClick: (editor, direction) => {
        setFlipImage(editor, direction as 'horizontal' | 'vertical');
    },
};

const setFlipImage = (editor: IEditor, direction: 'horizontal' | 'vertical') => {
    flipImage(editor, direction);
};
