import { createDarkColorHandler } from './DarkColorHandlerImpl';
import { createStandaloneEditorCorePlugins } from '../corePlugin/createStandaloneEditorCorePlugins';
import { standaloneCoreApiMap } from './standaloneCoreApiMap';
import {
    createDomToModelSettings,
    createModelToDomSettings,
} from './createStandaloneEditorDefaultSettings';
import type {
    EditorEnvironment,
    PluginState,
    StandaloneEditorCore,
    StandaloneEditorCorePlugins,
    StandaloneEditorOptions,
} from 'roosterjs-content-model-types';

/**
 * @internal
 * A temporary function to create Standalone Editor core
 * @param contentDiv Editor content DIV
 * @param options Editor options
 */
export function createStandaloneEditorCore(
    contentDiv: HTMLDivElement,
    options: StandaloneEditorOptions
): StandaloneEditorCore {
    const corePlugins = createStandaloneEditorCorePlugins(options, contentDiv);

    return {
        contentDiv,
        api: { ...standaloneCoreApiMap, ...options.coreApiOverride },
        originalApi: { ...standaloneCoreApiMap },
        plugins: [
            corePlugins.cache,
            corePlugins.format,
            corePlugins.copyPaste,
            corePlugins.domEvent,
            corePlugins.selection,
            corePlugins.entity,
            ...(options.plugins ?? []).filter(x => !!x),
            corePlugins.undo,
            corePlugins.lifecycle,
        ],
        environment: createEditorEnvironment(contentDiv),
        darkColorHandler: createDarkColorHandler(
            contentDiv,
            options.getDarkColor ?? getDarkColorFallback
        ),
        trustedHTMLHandler: options.trustedHTMLHandler || defaultTrustHtmlHandler,
        domToModelSettings: createDomToModelSettings(options),
        modelToDomSettings: createModelToDomSettings(options),
        ...getPluginState(corePlugins),
        disposeErrorHandler: options.disposeErrorHandler,
        zoomScale: (options.zoomScale ?? -1) > 0 ? options.zoomScale! : 1,
    };
}

function createEditorEnvironment(contentDiv: HTMLElement): EditorEnvironment {
    const navigator = contentDiv.ownerDocument.defaultView?.navigator;
    const userAgent = navigator?.userAgent ?? '';
    const appVersion = navigator?.appVersion ?? '';

    return {
        isMac: appVersion.indexOf('Mac') != -1,
        isAndroid: /android/i.test(userAgent),
        isSafari:
            userAgent.indexOf('Safari') >= 0 &&
            userAgent.indexOf('Chrome') < 0 &&
            userAgent.indexOf('Android') < 0,
    };
}

/**
 * @internal export for test only
 */
export function defaultTrustHtmlHandler(html: string) {
    return html;
}

function getPluginState(corePlugins: StandaloneEditorCorePlugins): PluginState {
    return {
        domEvent: corePlugins.domEvent.getState(),
        copyPaste: corePlugins.copyPaste.getState(),
        cache: corePlugins.cache.getState(),
        format: corePlugins.format.getState(),
        lifecycle: corePlugins.lifecycle.getState(),
        entity: corePlugins.entity.getState(),
        selection: corePlugins.selection.getState(),
        undo: corePlugins.undo.getState(),
    };
}

/**
 * @internal Export for test only
 * A fallback function, always return original color
 */
export function getDarkColorFallback(color: string) {
    return color;
}
