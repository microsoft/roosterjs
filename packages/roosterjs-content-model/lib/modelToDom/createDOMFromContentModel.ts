import { ContentModelDocument } from '../publicTypes/block/group/ContentModelDocument';
import { createFormatContext } from '../formatHandlers/createFormatContext';
import { handleBlock } from './handlers/handleBlock';
import { optimize } from './optimizers/optimize';
import { SelectionRangeEx } from 'roosterjs-editor-types';

/**
 * Create DOM tree from Content Model
 * @param model The root of Content Model
 * @param isDarkMode Whether the content is in dark mode @default false
 * @param zoomScale Zoom scale value of the content @default 1
 * @param isRtl Whether the content is from right to left @default false
 * @param getDarkColor A callback function used for calculate dark mode color from light mode color
 * @param optimizeLevel Optimization level, @default 2
 * @returns A DocumentFragment of DOM tree from the Content Model and the selection from this model
 */
export default function createDOMFromContentModel(
    model: ContentModelDocument,
    isDarkMode: boolean,
    zoomScale: number,
    isRtl: boolean,
    getDarkColor?: (lightColor: string) => string,
    optimizeLevel: number = 2
): [DocumentFragment, SelectionRangeEx | undefined] {
    const fragment = model.document.createDocumentFragment();
    const context = createFormatContext(isDarkMode, zoomScale, isRtl, getDarkColor);

    handleBlock(model.document, fragment, model, context);

    optimize(fragment, optimizeLevel);

    return [fragment, undefined];
}
