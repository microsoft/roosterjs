import { IEditor } from 'roosterjs-content-model-types';
import { rotateImage } from 'roosterjs-content-model-plugins';
import type { RibbonButton } from '../roosterjsReact/ribbon';

const directions: Record<string, string> = {
    left: 'left',
    right: 'right',
};

/**
 * @internal
 * "Rotate Image" button on the format ribbon
 */
export const imageRotateButton: RibbonButton<'buttonNameRotateImage'> = {
    key: 'buttonNameRotateImage',
    unlocalizedText: 'Rotate Image',
    iconName: 'Rotate',
    dropDownMenu: {
        items: directions,
        allowLivePreview: true,
    },
    isDisabled: formatState => !formatState.canAddImageAltText,
    onClick: (editor, direction) => {
        setRotateImage(editor, direction);
    },
};

const setRotateImage = (editor: IEditor, direction: string) => {
    rotateImage(editor, direction === 'left' ? 270 : 90);
};
