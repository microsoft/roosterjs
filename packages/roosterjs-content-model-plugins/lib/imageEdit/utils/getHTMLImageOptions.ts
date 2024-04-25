import { MIN_HEIGHT_WIDTH } from '../constants/constants';
import type { IEditor, ImageMetadataFormat } from 'roosterjs-content-model-types';
import type { ImageEditOptions } from '../types/ImageEditOptions';
import type { ImageHtmlOptions } from '../types/ImageHtmlOptions';

/**
 * Default background colors for rotate handle
 */
const LIGHT_MODE_BGCOLOR = 'white';
const DARK_MODE_BGCOLOR = '#333';

/**
 * @internal
 */
export const getHTMLImageOptions = (
    editor: IEditor,
    options: ImageEditOptions,
    editInfo: ImageMetadataFormat
): ImageHtmlOptions => {
    return {
        borderColor:
            options.borderColor || (editor.isDarkMode() ? DARK_MODE_BGCOLOR : LIGHT_MODE_BGCOLOR),
        rotateHandleBackColor: editor.isDarkMode() ? DARK_MODE_BGCOLOR : LIGHT_MODE_BGCOLOR,
        isSmallImage: isASmallImage(editInfo.widthPx ?? 0, editInfo.heightPx ?? 0),
    };
};

function isASmallImage(widthPx: number, heightPx: number): boolean {
    return widthPx && heightPx && (widthPx < MIN_HEIGHT_WIDTH || heightPx < MIN_HEIGHT_WIDTH)
        ? true
        : false;
}
