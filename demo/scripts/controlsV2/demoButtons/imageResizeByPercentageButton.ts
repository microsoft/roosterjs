import { IEditor } from 'roosterjs-content-model-types';
import { resizeByPercentage } from 'roosterjs-content-model-plugins';
import type { RibbonButton } from '../roosterjsReact/ribbon';

const size: Record<string, string> = {
    small: '0.5',
    normal: '1',
    big: '2',
};

/**
 * @internal
 * "Flip Image" button on the format ribbon
 */
export const imageResizeByPercentageButton: RibbonButton<'buttonNameResizeByPercentageImage'> = {
    key: 'buttonNameResizeByPercentageImage',
    unlocalizedText: 'ResizeByPercentage Image',
    iconName: 'ImageCrosshair',
    dropDownMenu: {
        items: size,
        allowLivePreview: true,
    },
    isDisabled: formatState => !formatState.canAddImageAltText,
    onClick: (editor, size) => {
        setResizeImage(editor, size);
    },
};

const setResizeImage = (editor: IEditor, imageSize: string) => {
    const sizes: Record<string, number> = {
        small: 0.5,
        normal: 1,
        big: 2,
    };

    resizeByPercentage(editor, sizes[imageSize], 10, 10);
};
