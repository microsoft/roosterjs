import { arrayPush, getIntersectedRect, getObjectKeys } from 'roosterjs-editor-dom';
import { coreApiMap } from '../coreApi/coreApiMap';
import { createCorePlugins, getPluginState } from '../corePlugins/createCorePlugins';
import { createStandaloneEditorDefaultSettings } from 'roosterjs-content-model-core';
import { DarkColorHandlerImpl } from './DarkColorHandlerImpl';
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
    const plugins: EditorPlugin[] = [];

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

    // It is ok to use global window here since the environment should always be the same for all windows in one session
    const userAgent = window.navigator.userAgent;

    const core: ContentModelEditorCore = {
        contentDiv,
        api: {
            ...coreApiMap,
            ...(options.coreApiOverride || {}),
        },
        originalApi: { ...coreApiMap },
        plugins: plugins.filter(x => !!x),
        ...pluginState,
        trustedHTMLHandler: options.trustedHTMLHandler || defaultTrustHtmlHandler,
        zoomScale: zoomScale,
        sizeTransformer: (size: number) => size / zoomScale,
        getVisibleViewport,
        imageSelectionBorderColor: options.imageSelectionBorderColor,
        darkColorHandler: new DarkColorHandlerImpl(contentDiv, pluginState.lifecycle.getDarkColor),
        disposeErrorHandler: options.disposeErrorHandler,

        ...createStandaloneEditorDefaultSettings(options),

        environment: {
            isMac: window.navigator.appVersion.indexOf('Mac') != -1,
            isAndroid: /android/i.test(userAgent),
            isSafari:
                userAgent.indexOf('Safari') >= 0 &&
                userAgent.indexOf('Chrome') < 0 &&
                userAgent.indexOf('Android') < 0,
        },
    };

    return core;
}

/**
 * @internal Export for test only
 */
export function defaultTrustHtmlHandler(html: string) {
    return html;
}
