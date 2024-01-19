import { coreApiMap } from '../coreApi/coreApiMap';
import { createDarkColorHandler } from './DarkColorHandlerImpl';
import type { ContentModelCorePluginState } from '../publicTypes/ContentModelCorePlugins';
import type { ContentModelEditorCore } from '../publicTypes/ContentModelEditorCore';
import type { ContentModelEditorOptions } from '../publicTypes/IContentModelEditor';
import type { SizeTransformer } from 'roosterjs-editor-types';
import type { DarkColorHandler } from 'roosterjs-content-model-types';

/**
 * @internal
 * Create a new instance of Content Model Editor Core
 * @param options The editor options
 * @param corePluginState Core plugin state for Content Model editor
 * @param innerDarkColorHandler Inner dark color handler
 * @param sizeTransformer @deprecated A size transformer function to calculate size when editor is zoomed
 */
export function createEditorCore(
    options: ContentModelEditorOptions,
    corePluginState: ContentModelCorePluginState,
    innerDarkColorHandler: DarkColorHandler,
    sizeTransformer: SizeTransformer
): ContentModelEditorCore {
    const core: ContentModelEditorCore = {
        api: { ...coreApiMap, ...options.legacyCoreApiOverride },
        originalApi: coreApiMap,
        customData: {},
        experimentalFeatures: options.experimentalFeatures ?? [],
        sizeTransformer,
        darkColorHandler: createDarkColorHandler(innerDarkColorHandler),
        ...corePluginState,
    };

    return core;
}
