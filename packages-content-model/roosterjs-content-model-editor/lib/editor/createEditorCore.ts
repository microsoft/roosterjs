import { coreApiMap } from '../coreApi/coreApiMap';
import type { ContentModelCorePluginState } from '../publicTypes/ContentModelCorePlugins';
import type { ContentModelEditorCore } from '../publicTypes/ContentModelEditorCore';
import type { ContentModelEditorOptions } from '../publicTypes/IContentModelEditor';
import type { SizeTransformer } from 'roosterjs-editor-types';

/**
 * @internal
 * Create a new instance of Content Model Editor Core
 * @param contentDiv The DIV HTML element which will be the container element of editor
 * @param corePluginState Core plugin state for Content Model editor
 * @param sizeTransformer @deprecated A size transformer function to calculate size when editor is zoomed
 */
export function createEditorCore(
    options: ContentModelEditorOptions,
    corePluginState: ContentModelCorePluginState,
    sizeTransformer: SizeTransformer
): ContentModelEditorCore {
    const core: ContentModelEditorCore = {
        api: { ...coreApiMap, ...options.legacyCoreApiOverride },
        originalApi: coreApiMap,
        customData: {},
        experimentalFeatures: options.experimentalFeatures ?? [],
        sizeTransformer,
        ...corePluginState,
    };

    return core;
}
