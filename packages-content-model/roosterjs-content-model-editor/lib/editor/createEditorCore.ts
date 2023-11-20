import { coreApiMap } from '../coreApi/coreApiMap';
import { createCorePlugins, getPluginState } from '../corePlugins/createCorePlugins';
import { createStandaloneEditorCore } from 'roosterjs-content-model-core';
import { getObjectKeys } from 'roosterjs-content-model-dom';
import type { ContentModelEditorCore } from '../publicTypes/ContentModelEditorCore';
import type { ContentModelEditorOptions } from '../publicTypes/IContentModelEditor';

/**
 * @internal
 * Create a new instance of Content Model Editor Core
 * @param contentDiv The DIV HTML element which will be the container element of editor
 * @param options An optional options object to customize the editor
 */
export function createEditorCore(
    contentDiv: HTMLDivElement,
    options: ContentModelEditorOptions
): ContentModelEditorCore {
    const corePlugins = createCorePlugins(contentDiv, options);
    const pluginState = getPluginState(corePlugins);

    const zoomScale: number = (options.zoomScale ?? -1) > 0 ? options.zoomScale! : 1;

    const standaloneEditorCore = createStandaloneEditorCore(
        contentDiv,
        options,
        coreApiMap,
        pluginState
    );

    const core: ContentModelEditorCore = {
        ...standaloneEditorCore,
        ...pluginState,
        zoomScale: zoomScale,
        sizeTransformer: (size: number) => size / zoomScale,
        disposeErrorHandler: options.disposeErrorHandler,
    };

    getObjectKeys(corePlugins).forEach(name => {
        if (name == '_placeholder') {
            if (options.plugins) {
                core.plugins.push(...options.plugins.filter(x => !!x));
            }
        } else if (corePlugins[name]) {
            core.plugins.push(corePlugins[name]);
        }
    });

    return core;
}
