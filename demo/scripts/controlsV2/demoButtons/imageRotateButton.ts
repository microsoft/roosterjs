import { IEditor } from 'roosterjs-content-model-types';
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
        rotateImage(editor, direction);
    },
};

const rotateImage = (editor: IEditor, direction: string) => {
    const selection = editor.getDOMSelection();
    if (selection?.type === 'image') {
        const degree = direction === 'left' ? 270 : 90;
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
};

function degreesToRadians(degrees: number) {
    return degrees * (Math.PI / 180);
}
