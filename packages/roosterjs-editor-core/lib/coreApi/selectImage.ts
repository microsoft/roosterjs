import { createRange } from 'roosterjs-editor-dom';
import { SelectImage, SelectionRangeTypes } from 'roosterjs-editor-types';

/**
 * @internal
 * Select a image and save data of the selected range
 * @param image Image to select
 * @returns Selected image information
 */
export const selectImage: SelectImage = (image: HTMLImageElement | null) => {
    if (image) {
        const range = createRange(image);

        return {
            type: SelectionRangeTypes.ImageSelection,
            ranges: [range],
            image: image,
            areAllCollapsed: range.collapsed,
        };
    }

    return null;
};
