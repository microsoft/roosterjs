import { getRootComputedStyleForContext } from './getRootComputedStyleForContext';
import type { EditorContext, CreateEditorContext } from 'roosterjs-content-model-types';

/**
 * @internal
 * Create a EditorContext object used by ContentModel API
 */
export const createEditorContext: CreateEditorContext = (core, saveIndex) => {
    const { lifecycle, format, darkColorHandler, logicalRoot, cache, domHelper } = core;

    saveIndex = saveIndex && !core.lifecycle.shadowEditFragment;

    const context: EditorContext = {
        isDarkMode: lifecycle.isDarkMode,
        defaultFormat: format.defaultFormat,
        pendingFormat: format.pendingFormat ?? undefined,
        darkColorHandler: darkColorHandler,
        addDelimiterForEntity: true,
        allowCacheElement: true,
        domIndexer: saveIndex ? cache.domIndexer : undefined,
        zoomScale: domHelper.calculateZoomScale(),
        experimentalFeatures: core.experimentalFeatures ?? [],
        ...getRootComputedStyleForContext(logicalRoot.ownerDocument),
    };

    if (core.domHelper.isRightToLeft()) {
        context.isRootRtl = true;
    }

    return context;
};
