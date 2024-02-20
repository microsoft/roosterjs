import { parseValueWithUnit } from 'roosterjs-content-model-dom';
import type { EditorContext, CreateEditorContext, EditorCore } from 'roosterjs-content-model-types';

const DefaultRootFontSize = 16;

/**
 * @internal
 * Create a EditorContext object used by ContentModel API
 */
export const createEditorContext: CreateEditorContext = (core, saveIndex) => {
    const { lifecycle, format, darkColorHandler, contentDiv, cache, domHelper } = core;

    const context: EditorContext = {
        isDarkMode: lifecycle.isDarkMode,
        defaultFormat: format.defaultFormat,
        pendingFormat: format.pendingFormat ?? undefined,
        darkColorHandler: darkColorHandler,
        addDelimiterForEntity: true,
        allowCacheElement: true,
        domIndexer: saveIndex ? cache.domIndexer : undefined,
        zoomScale: domHelper.calculateZoomScale(),
        rootFontSize:
            parseValueWithUnit(getRootComputedStyle(core)?.fontSize) || DefaultRootFontSize,
    };

    checkRootRtl(contentDiv, context);

    return context;
};

function checkRootRtl(element: HTMLElement, context: EditorContext) {
    const style = element?.ownerDocument.defaultView?.getComputedStyle(element);

    if (style?.direction == 'rtl') {
        context.isRootRtl = true;
    }
}

function getRootComputedStyle(core: EditorCore) {
    const document = core.contentDiv.ownerDocument;
    const rootComputedStyle = document.defaultView?.getComputedStyle(document.documentElement);
    return rootComputedStyle;
}
