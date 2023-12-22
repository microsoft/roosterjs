import { coreApiMap } from '../coreApi/coreApiMap';
import { createContextMenuPlugin } from '../corePlugins/ContextMenuPlugin';
import { createEditPlugin } from '../corePlugins/EditPlugin';
import { createNormalizeTablePlugin } from '../corePlugins/NormalizeTablePlugin';
import type { BridgePlugin } from '../corePlugins/BridgePlugin';
import type { ContentModelEditorCore } from '../publicTypes/ContentModelEditorCore';
import type { ContentModelEditorOptions } from '../publicTypes/IContentModelEditor';
import type { SizeTransformer } from 'roosterjs-editor-types';

/**
 * @internal
 * Create a new instance of Content Model Editor Core
 * @param contentDiv The DIV HTML element which will be the container element of editor
 * @param options An optional options object to customize the editor
 */
export function createEditorCore(
    options: ContentModelEditorOptions,
    bridgePlugin: BridgePlugin,
    sizeTransformer: SizeTransformer
): ContentModelEditorCore {
    const editPlugin = createEditPlugin();

    bridgePlugin.addLegacyPlugin(
        [
            editPlugin,
            ...(options.legacyPlugins ?? []),
            createContextMenuPlugin(options),
            createNormalizeTablePlugin(),
        ].filter(x => !!x)
    );

    const core: ContentModelEditorCore = {
        api: { ...coreApiMap, ...options.legacyCoreApiOverride },
        originalApi: coreApiMap,
        bridgePlugin,
        customData: {},
        experimentalFeatures: options.experimentalFeatures ?? [],
        edit: editPlugin.getState(),
        sizeTransformer,
    };

    return core;
}
