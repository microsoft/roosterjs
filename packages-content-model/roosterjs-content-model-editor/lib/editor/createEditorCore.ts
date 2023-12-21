import { coreApiMap } from '../coreApi/coreApiMap';
import type { ContentModelEditorCore } from '../publicTypes/ContentModelEditorCore';
import type { ContentModelEditorOptions } from '../publicTypes/IContentModelEditor';
import type { EditPluginState } from 'roosterjs-editor-types';
import type { EditorPlugin } from 'roosterjs-content-model-types';

/**
 * @internal
 * Create a new instance of Content Model Editor Core
 * @param contentDiv The DIV HTML element which will be the container element of editor
 * @param options An optional options object to customize the editor
 */
export function createEditorCore(
    options: ContentModelEditorOptions,
    bridgePlugin: EditorPlugin,
    editPluginState: EditPluginState
): ContentModelEditorCore {
    const core: ContentModelEditorCore = {
        api: { ...coreApiMap, ...options.coreApiOverride },
        originalApi: coreApiMap,
        bridgePlugin,
        customData: {},
        experimentalFeatures: options.experimentalFeatures ?? [],
        edit: editPluginState,
    };

    return core;
}
