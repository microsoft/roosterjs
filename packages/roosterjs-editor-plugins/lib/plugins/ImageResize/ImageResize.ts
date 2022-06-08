import ImageEdit from '../ImageEdit/ImageEdit';
import { ImageEditOperation, ModeIndependentColor } from 'roosterjs-editor-types';

/**
 * @deprecated Use ImageEdit plugin instead
 */
export default class ImageResize extends ImageEdit {
    /**
     * Create a new instance of ImageResize
     * @param minWidth Minimum width of image when resize in pixel, default value is 10
     * @param minHeight Minimum height of image when resize in pixel, default value is 10
     * @param selectionBorderColor Color of resize border and handles, default value is #DB626C
     * @param forcePreserveRatio Whether always preserve width/height ratio when resize, default value is false
     * @param resizableImageSelector Selector for picking which image is resizable (e.g. for all images not placeholders), note
     * that the tag must be IMG regardless what the selector is
     */
    constructor(
        minWidth: number = 10,
        minHeight: number = 10,
        selectionBorderColor: ModeIndependentColor = {
            lightModeColor: '#DB626C',
            darkModeColor: '#DB626C',
        },
        forcePreserveRatio: boolean = false,
        resizableImageSelector: string = 'img'
    ) {
        super({
            minHeight,
            minWidth,
            borderColor: selectionBorderColor,
            preserveRatio: forcePreserveRatio,
            imageSelector: resizableImageSelector,
        });
    }

    /**
     * @deprecated
     */
    showResizeHandle(img: HTMLImageElement) {
        this.setEditingImage(img, ImageEditOperation.Resize);
    }

    /**
     * @deprecated
     */
    hideResizeHandle(selectImageAfterUnSelect?: boolean) {
        this.setEditingImage(null /*image*/, selectImageAfterUnSelect);
    }
}
