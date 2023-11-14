import { arrayPush, getIntersectedRect, getObjectKeys } from 'roosterjs-editor-dom';
import { coreApiMap } from '../coreApi/coreApiMap';
import { createCorePlugins, getPluginState } from '../corePlugins/createCorePlugins';
import { createDomToModelConfig, createModelToDomConfig } from 'roosterjs-content-model-dom';
import { DarkColorHandlerImpl } from './DarkColorHandlerImpl';
import type { DomToModelOption, ModelToDomOption } from 'roosterjs-content-model-types';
import {
    createContentModelCachePlugin,
    createContentModelFormatPlugin,
    getStandaloneEditorPluginState,
    listItemMetadataApplier,
    listLevelMetadataApplier,
    tablePreProcessor,
} from 'roosterjs-content-model-core';
import type { EditorPlugin } from 'roosterjs-editor-types';
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
    const standaloneEditorPluginState = getStandaloneEditorPluginState(options);
    const plugins: EditorPlugin[] = [
        createContentModelCachePlugin(standaloneEditorPluginState.cache),
        createContentModelFormatPlugin(standaloneEditorPluginState.format),
    ];

    getObjectKeys(corePlugins).forEach(name => {
        if (name == '_placeholder') {
            if (options.plugins) {
                arrayPush(plugins, options.plugins);
            }
        } else {
            plugins.push(corePlugins[name]);
        }
    });

    const pluginState = getPluginState(corePlugins);
    const zoomScale: number = (options.zoomScale ?? -1) > 0 ? options.zoomScale! : 1;
    const getVisibleViewport =
        options.getVisibleViewport ||
        (() => {
            const scrollContainer = pluginState.domEvent.scrollContainer;

            return getIntersectedRect(
                scrollContainer == core.contentDiv
                    ? [scrollContainer]
                    : [scrollContainer, core.contentDiv]
            );
        });

    const defaultDomToModelOptions: (DomToModelOption | undefined)[] = [
        {
            processorOverride: {
                table: tablePreProcessor,
            },
        },
        options.defaultDomToModelOptions,
    ];
    const defaultModelToDomOptions: (ModelToDomOption | undefined)[] = [
        {
            metadataAppliers: {
                listItem: listItemMetadataApplier,
                listLevel: listLevelMetadataApplier,
            },
        },
        options.defaultModelToDomOptions,
    ];

    const core: ContentModelEditorCore = {
        contentDiv,
        api: {
            ...coreApiMap,
            ...(options.coreApiOverride || {}),
        },
        originalApi: { ...coreApiMap },
        plugins: plugins.filter(x => !!x),
        ...pluginState,
        ...standaloneEditorPluginState,
        trustedHTMLHandler: options.trustedHTMLHandler || ((html: string) => html),
        zoomScale: zoomScale,
        sizeTransformer: options.sizeTransformer || ((size: number) => size / zoomScale),
        getVisibleViewport,
        imageSelectionBorderColor: options.imageSelectionBorderColor,
        darkColorHandler: new DarkColorHandlerImpl(contentDiv, pluginState.lifecycle.getDarkColor),
        disposeErrorHandler: options.disposeErrorHandler,

        defaultDomToModelOptions,
        defaultModelToDomOptions,
        defaultDomToModelConfig: createDomToModelConfig(defaultDomToModelOptions),
        defaultModelToDomConfig: createModelToDomConfig(defaultModelToDomOptions),

        environment: {
            // It is ok to use global window here since the environment should always be the same for all windows in one session
            isMac: window.navigator.appVersion.indexOf('Mac') != -1,
            isAndroid: /android/i.test(window.navigator.userAgent),
        },
    };

    return core;
}
