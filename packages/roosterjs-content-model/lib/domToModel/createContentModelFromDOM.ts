import { containerProcessor } from './processors/containerProcessor';
import { ContentModelDocument } from '../publicTypes/block/group/ContentModelDocument';
import { createContentModelDocument } from './creators/createContentModelDocument';
import { createFormatContext } from '../formatHandlers/createFormatContext';

/**
 * Create Content Model from DOM node
 * @param root Root node of the DOM tree. This node itself will not be included in the Content Model
 * @param range Selection range
 * @param isDarkMode Whether the content is in dark mode
 * @param zoomScale Zoom scale value of the content
 * @param isRtl Whether the content is from right to left
 * @param getDarkColor A callback function used for calculate dark mode color from light mode color
 * @returns A Content Model of the given root and selection
 */
export default function createContentModelFromDOM(
    root: ParentNode,
    range: Range | null,
    isDarkMode: boolean,
    zoomScale: number,
    isRtl: boolean,
    getDarkColor: (lightColor: string) => string
): ContentModelDocument {
    const model = createContentModelDocument(root.ownerDocument!);
    const context = createFormatContext(isDarkMode, zoomScale, isRtl, getDarkColor);

    containerProcessor(model, root, context);

    return model;
}
