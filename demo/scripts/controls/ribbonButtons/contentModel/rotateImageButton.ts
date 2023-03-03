import { isContentModelEditor } from 'roosterjs-content-model';
import { RibbonButton } from 'roosterjs-react';
import { rotateImage } from 'roosterjs-content-model';

const optionsItems: Record<string, string> = {
    RotateLeft: 'RotateLeft',
    RotateRight: 'RotateRight',
    UpsideDown: 'UpsideDown',
};

const options: Record<string, number> = {
    RotateLeft: -Math.PI / 2,
    RotateRight: Math.PI / 2,
    UpsideDown: Math.PI,
};

/**
 * @internal
 * "Image Border Width" button on the format ribbon
 */
export const rotateImageButton: RibbonButton<'buttonNameImageRotate'> = {
    key: 'buttonNameImageRotate',
    unlocalizedText: 'Rotate Image',
    iconName: 'Photo2',
    isDisabled: formatState => !formatState.canAddImageAltText,
    dropDownMenu: {
        items: optionsItems,
        allowLivePreview: true,
    },
    onClick: (editor, size) => {
        if (isContentModelEditor(editor)) {
            rotateImage(editor, options[size]);
        }
        return true;
    },
};
