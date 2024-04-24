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
        flipImage(editor, direction as 'horizontal' | 'vertical');
    },
};

const flipImage = (editor: IEditor, direction: 'horizontal' | 'vertical') => {
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
};
