import { createRange } from 'roosterjs-editor-dom';
import { EditorCore, SelectImage, SelectionRangeTypes } from 'roosterjs-editor-types';

/**
 * @internal
 * Select a image and save data of the selected range
 * @param core The EditorCore object
 * @param image Image to select
 * @param wrapper Selected image wrapper
 * @returns Selected image information
 */
export const selectImage: SelectImage = (
    core: EditorCore,
    image: HTMLImageElement | null,
    wrapper?: HTMLSpanElement
) => {
    const selectedImage = image
        ? image
        : wrapper
        ? (document.querySelector(`img[id$="${wrapper.id}"]`) as HTMLImageElement)
        : null;
    if (selectedImage) {
        const range = wrapper ? createRange(wrapper) : createRange(selectedImage);
        core.api.selectRange(core, range);

        return {
            type: SelectionRangeTypes.ImageSelection,
            ranges: [range],
            imageId: selectedImage.id,
            image: selectedImage,
            areAllCollapsed: range.collapsed,
        };
    }

    return null;
};
