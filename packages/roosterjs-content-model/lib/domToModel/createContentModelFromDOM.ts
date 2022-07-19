import { containerProcessor } from './processors/containerProcessor';
import { ContentModelDocument } from '../publicTypes/block/group/ContentModelDocument';
import { createContentModelDocument } from './creators/createContentModelDocument';
import { FormatContext } from '../publicTypes/format/FormatContext';

/**
 * Create Content Model from DOM node
 * @param root Root node of the DOM tree. This node itself will not be included in the Content Model
 * @param range Selection range
 * @param isDarkMode Whether the content is in dark mode @default false
 * @param zoomScale Zoom scale value of the content @default 1
 * @param isRtl Whether the content is from right to left @default false
 * @returns A Content Model of the given root and selection
 */
export default function createContentModelFromDOM(
    root: ParentNode,
    range: Range | null,
    isDarkMode: boolean = false,
    zoomScale: number = 1,
    isRtl: boolean = false
): ContentModelDocument {
    const model = createContentModelDocument(root.ownerDocument!);
    const context = createFormatContext(isDarkMode, zoomScale, isRtl);

    containerProcessor(model, root, context);

    return model;
}

function createFormatContext(
    isDarkMode: boolean,
    zoomScale: number,
    isRightToLeft: boolean
): FormatContext {
    return {
        isDarkMode,
        zoomScale,
        isRightToLeft,
    };
}
