import { coreApiMap } from '../coreApi/coreApiMap';
import { createCorePlugins, getPluginState } from '../corePlugins/createCorePlugins';
import { createDomToModelContext, domToContentModel } from 'roosterjs-content-model-dom';
import { createStandaloneEditorCore } from 'roosterjs-content-model-core';
import type { ContentModelEditorCore } from '../publicTypes/ContentModelEditorCore';
import type { ContentModelEditorOptions } from '../publicTypes/IContentModelEditor';
import type { EditorPlugin } from 'roosterjs-editor-types';

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
    const corePlugins = createCorePlugins(options);
    const pluginState = getPluginState(corePlugins);
    const additionalPlugins: EditorPlugin[] = [
        corePlugins.edit,
        ...(options.plugins ?? []),
        corePlugins.undo,
        corePlugins.entity,
        corePlugins.imageSelection,
        corePlugins.normalizeTable,
    ].filter(x => !!x);

    const zoomScale: number = (options.zoomScale ?? -1) > 0 ? options.zoomScale! : 1;
    const initContent = options.initialContent ?? contentDiv.innerHTML;

    if (initContent && !options.initialModel) {
        const doc = new DOMParser().parseFromString(
            options.trustedHTMLHandler?.(initContent) ?? initContent,
            'text/html'
        );

        if (doc?.body) {
            options.initialModel = domToContentModel(
                doc.body,
                createDomToModelContext(
                    undefined /*editorContext*/,
                    options.defaultDomToModelOptions
                )
            );
        }
    }

    const standaloneEditorCore = createStandaloneEditorCore(
        contentDiv,
        options,
        coreApiMap,
        pluginState,
        additionalPlugins
    );

    const core: ContentModelEditorCore = {
        ...standaloneEditorCore,
        ...pluginState,
        zoomScale: zoomScale,
        sizeTransformer: (size: number) => size / zoomScale,
        disposeErrorHandler: options.disposeErrorHandler,
        customData: {},
        experimentalFeatures: options.experimentalFeatures ?? [],
    };

    return core;
}
