import { ImageEditor } from 'roosterjs-content-model-types';
import type { RibbonButton } from '../roosterjsReact/ribbon';

/**
 * @internal
 * "Image Crop" button on the format ribbon
 */
function createImageCropButton(handler: ImageEditor): RibbonButton<'buttonNameCropImage'> {
    return {
        key: 'buttonNameCropImage',
        unlocalizedText: 'Crop Image',
        iconName: 'Crop',
        isDisabled: formatState =>
            !formatState.canAddImageAltText || !handler.isOperationAllowed('crop'),
        onClick: () => {
            handler.cropImage();
        },
    };
}

const directions: Record<string, string> = {
    left: 'Left',
    right: 'Right',
};

/**
 * @internal
 * "Image Rotate" button on the format ribbon
 */
function createImageRotateButton(handler: ImageEditor): RibbonButton<'buttonNameRotateImage'> {
    return {
        key: 'buttonNameRotateImage',
        unlocalizedText: 'Rotate Image',
        iconName: 'Rotate',
        dropDownMenu: {
            items: directions,
        },
        isDisabled: formatState => !formatState.canAddImageAltText,
        onClick: (_editor, direction) => {
            const rotateDirection = direction as 'left' | 'right';
            const rad = degreeToRad(rotateDirection == 'left' ? 270 : 90);
            handler.rotateImage(rad);
        },
    };
}

const flipDirections: Record<string, string> = {
    horizontal: 'horizontal',
    vertical: 'vertical',
};

/**
 * @internal
 * "Image Flip" button on the format ribbon
 */
function createImageFlipButton(handler: ImageEditor): RibbonButton<'buttonNameFlipImage'> {
    return {
        key: 'buttonNameFlipImage',
        unlocalizedText: 'Flip Image',
        iconName: 'ImagePixel',
        dropDownMenu: {
            items: flipDirections,
        },
        isDisabled: formatState => !formatState.canAddImageAltText,
        onClick: (_editor, flipDirection) => {
            handler.flipImage(flipDirection as 'horizontal' | 'vertical');
        },
    };
}

export const createImageEditButtons = (handler: ImageEditor) => {
    return [
        createImageCropButton(handler),
        createImageRotateButton(handler),
        createImageFlipButton(handler),
    ];
};

const degreeToRad = (degree: number) => {
    return degree * (Math.PI / 180);
};
