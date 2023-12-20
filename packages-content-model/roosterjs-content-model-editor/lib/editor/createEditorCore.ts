import { coreApiMap } from '../coreApi/coreApiMap';
import { createEditPlugin } from '../corePlugins/EditPlugin';
import { createEventTypeTranslatePlugin } from '../corePlugins/EventTypeTranslatePlugin';
import { createModelFromHtml, createStandaloneEditorCore } from 'roosterjs-content-model-core';
import { createNormalizeTablePlugin } from '../corePlugins/NormalizeTablePlugin';
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
    const editPlugin = createEditPlugin();
    const bridgePlugin = createEventTypeTranslatePlugin(
        [editPlugin, ...(options.plugins ?? []), createNormalizeTablePlugin()].filter(x => !!x),
        options.disposeErrorHandler
    );

    if (!options.standaloneEditorPlugins) {
        options.standaloneEditorPlugins = [];
    }

    options.standaloneEditorPlugins.push(bridgePlugin);

    const zoomScale: number = (options.zoomScale ?? -1) > 0 ? options.zoomScale! : 1;
    const initContent = options.initialContent ?? contentDiv.innerHTML;

    if (initContent && !options.initialModel) {
        options.initialModel = createModelFromHtml(
            initContent,
            options.defaultDomToModelOptions,
            options.trustedHTMLHandler,
            options.defaultSegmentFormat
        );
    }

    const core: ContentModelEditorCore = {
        standaloneEditorCore: createStandaloneEditorCore(contentDiv, options),
        api: { ...coreApiMap, ...options.coreApiOverride },
        originalApi: coreApiMap,
        bridgePlugin,
        zoomScale: zoomScale,
        sizeTransformer: (size: number) => size / zoomScale,
        customData: {},
        experimentalFeatures: options.experimentalFeatures ?? [],
        edit: editPlugin.getState(),
    };

    return core;
}
