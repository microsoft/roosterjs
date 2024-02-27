import { getRootComputedStyleForContext } from '../utils/getRootComputedStyleForContext';
import type { EditorContext, CreateEditorContext } from 'roosterjs-content-model-types';

/**
 * @internal
 * Create a EditorContext object used by ContentModel API
 */
export const createEditorContext: CreateEditorContext = (core, saveIndex) => {
    const { lifecycle, format, darkColorHandler, logicalRoot, cache, domHelper } = core;

    const context: EditorContext = {
        isDarkMode: lifecycle.isDarkMode,
        defaultFormat: format.defaultFormat,
        pendingFormat: format.pendingFormat ?? undefined,
        darkColorHandler: darkColorHandler,
        addDelimiterForEntity: true,
        allowCacheElement: true,
        domIndexer: saveIndex ? cache.domIndexer : undefined,
        zoomScale: domHelper.calculateZoomScale(),
        ...getRootComputedStyleForContext(contentDiv.ownerDocument),
    };

    checkRootRtl(logicalRoot, context);

    return context;
};

function checkRootRtl(element: HTMLElement, context: EditorContext) {
    const style = element?.ownerDocument.defaultView?.getComputedStyle(element);

    if (style?.direction == 'rtl') {
        context.isRootRtl = true;
    }
}
