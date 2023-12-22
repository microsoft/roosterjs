import { coreApiMap } from '../coreApi/coreApiMap';
import { createContextMenuPlugin } from '../corePlugins/ContextMenuPlugin';
import { createEditPlugin } from '../corePlugins/EditPlugin';
import { createNormalizeTablePlugin } from '../corePlugins/NormalizeTablePlugin';
import type { ContentModelCorePluginState } from '../publicTypes/ContentModelCorePlugins';
import type { BridgePlugin } from '../corePlugins/BridgePlugin';
import type { ContentModelEditorCore } from '../publicTypes/ContentModelEditorCore';
import type { ContentModelEditorOptions } from '../publicTypes/IContentModelEditor';
import type { SizeTransformer } from 'roosterjs-editor-types';

/**
 * @internal
 * Create a new instance of Content Model Editor Core
 * @param contentDiv The DIV HTML element which will be the container element of editor
 * @param bridgePlugin Bridge plugin used for connect StandaloneEditor and ContentModelEditor
 * @param sizeTransformer @deprecated A size transformer function to calculate size when editor is zoomed
 */
export function createEditorCore(
    options: ContentModelEditorOptions,
    bridgePlugin: BridgePlugin,
    sizeTransformer: SizeTransformer
): ContentModelEditorCore {
    const editPlugin = createEditPlugin();
    const contextMenuPlugin = createContextMenuPlugin(options);
    const corePluginState: ContentModelCorePluginState = {
        edit: editPlugin.getState(),
        contextMenu: contextMenuPlugin.getState(),
    };

    bridgePlugin.addLegacyPlugin(
        [
            editPlugin,
            ...(options.legacyPlugins ?? []),
            contextMenuPlugin,
            createNormalizeTablePlugin(),
        ].filter(x => !!x)
    );

    const core: ContentModelEditorCore = {
        api: { ...coreApiMap, ...options.legacyCoreApiOverride },
        originalApi: coreApiMap,
        bridgePlugin,
        customData: {},
        experimentalFeatures: options.experimentalFeatures ?? [],
        sizeTransformer,
        ...corePluginState,
    };

    return core;
}
