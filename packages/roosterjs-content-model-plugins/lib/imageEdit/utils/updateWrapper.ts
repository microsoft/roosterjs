import { doubleCheckResize } from './doubleCheckResize';
import { getGeneratedImageSize } from './generateImageSize';
import { ImageEditElementClass } from '../types/ImageEditElementClass';
import { isElementOfType, isNodeOfType } from 'roosterjs-content-model-dom';
import { updateHandleCursor } from './updateHandleCursor';
import { updateSideHandlesVisibility } from '../Resizer/updateSideHandlesVisibility';
import type { ImageEditOptions } from '../types/ImageEditOptions';
import type { ImageMetadataFormat } from 'roosterjs-content-model-types';
import {
    getPx,
    isASmallImage,
    isRTL,
    setFlipped,
    setSize,
    setWrapperSizeDimensions,
} from './imageEditUtils';

/**
 * @internal
 */
export function updateWrapper(
    editInfo: ImageMetadataFormat,
    options: ImageEditOptions,
    image: HTMLImageElement,
    clonedImage: HTMLImageElement,
    wrapper: HTMLSpanElement,
    resizers?: HTMLDivElement[],
    croppers?: HTMLDivElement[]
) {
    const {
        angleRad,
        bottomPercent,
        leftPercent,
        rightPercent,
        topPercent,
        flippedHorizontal,
        flippedVertical,
    } = editInfo;

    const generateImageSize = getGeneratedImageSize(editInfo, croppers && croppers?.length > 0);
    if (!generateImageSize) {
        return;
    }
    const {
        targetWidth,
        targetHeight,
        originalWidth,
        originalHeight,
        visibleWidth,
        visibleHeight,
    } = generateImageSize;

    const marginHorizontal = (targetWidth - visibleWidth) / 2;
    const marginVertical = (targetHeight - visibleHeight) / 2;
    const cropLeftPx = originalWidth * (leftPercent || 0);
    const cropRightPx = originalWidth * (rightPercent || 0);
    const cropTopPx = originalHeight * (topPercent || 0);
    const cropBottomPx = originalHeight * (bottomPercent || 0);

    // Update size and margin of the wrapper
    wrapper.style.margin = `${marginVertical}px ${marginHorizontal}px`;
    wrapper.style.transform = `rotate(${angleRad}rad)`;
    setWrapperSizeDimensions(wrapper, image, visibleWidth, visibleHeight);

    // Update the text-alignment to avoid the image to overflow if the parent element have align center or right
    // or if the direction is Right To Left
    if (isRTL(clonedImage)) {
        wrapper.style.textAlign = 'right';
        if (!croppers) {
            clonedImage.style.left = getPx(cropLeftPx);
            clonedImage.style.right = getPx(-cropRightPx);
        }
    } else {
        wrapper.style.textAlign = 'left';
    }

    // Update size of the image
    clonedImage.style.width = getPx(originalWidth);
    clonedImage.style.height = getPx(originalHeight);
    clonedImage.style.verticalAlign = 'bottom';
    clonedImage.style.position = 'absolute';

    //Update flip direction
    setFlipped(clonedImage.parentElement, flippedHorizontal, flippedVertical);
    const smallImage = isASmallImage(visibleWidth, visibleWidth);

    if (!croppers) {
        // For rotate/resize, set the margin of the image so that cropped part won't be visible
        clonedImage.style.margin = `${-cropTopPx}px 0 0 ${-cropLeftPx}px`;
    }

    if (croppers && croppers.length > 0) {
        const cropContainer = croppers[0];
        const cropOverlays = croppers.filter(
            cropper => cropper.className === ImageEditElementClass.CropOverlay
        );

        setSize(
            cropContainer,
            cropLeftPx,
            cropTopPx,
            cropRightPx,
            cropBottomPx,
            undefined,
            undefined
        );
        setSize(cropOverlays[0], 0, 0, cropRightPx, undefined, undefined, cropTopPx);
        setSize(cropOverlays[1], undefined, 0, 0, cropBottomPx, cropRightPx, undefined);
        setSize(cropOverlays[2], cropLeftPx, undefined, 0, 0, undefined, cropBottomPx);
        setSize(cropOverlays[3], 0, cropTopPx, undefined, 0, cropLeftPx, undefined);
        if (angleRad) {
            updateHandleCursor(croppers, angleRad);
        }
    }

    if (resizers) {
        const clientWidth = wrapper.clientWidth;
        const clientHeight = wrapper.clientHeight;

        doubleCheckResize(editInfo, options.preserveRatio || false, clientWidth, clientHeight);

        const resizeHandles = resizers
            .map(resizer => {
                const resizeHandle = resizer.firstElementChild;
                if (
                    isNodeOfType(resizeHandle, 'ELEMENT_NODE') &&
                    isElementOfType(resizeHandle, 'div')
                ) {
                    return resizeHandle;
                }
            })
            .filter(handle => !!handle) as HTMLDivElement[];

        if (angleRad) {
            updateHandleCursor(resizeHandles, angleRad);
        }

        updateSideHandlesVisibility(resizeHandles, smallImage);
    }
}
