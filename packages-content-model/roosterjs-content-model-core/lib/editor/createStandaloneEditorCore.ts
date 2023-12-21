import { createStandaloneEditorCorePlugins } from '../corePlugin/createStandaloneEditorCorePlugins';
import { DarkColorHandlerImpl } from './DarkColorHandlerImpl';
import { standaloneCoreApiMap } from './standaloneCoreApiMap';
import {
    createDomToModelSettings,
    createModelToDomSettings,
} from './createStandaloneEditorDefaultSettings';
import type {
    EditorEnvironment,
    StandaloneEditorCore,
    StandaloneEditorCorePluginState,
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
    const zoomScale: number = (options.zoomScale ?? -1) > 0 ? options.zoomScale! : 1;

    return {
        contentDiv,
        api: { ...standaloneCoreApiMap, ...options.standaloneEditorCoreApiOverride },
        originalApi: { ...standaloneCoreApiMap },
        plugins: [
            corePlugins.cache,
            corePlugins.format,
            corePlugins.copyPaste,
            corePlugins.domEvent,
            corePlugins.selection,
            corePlugins.entity,
            ...(options.standaloneEditorPlugins ?? []),
            corePlugins.undo,
            corePlugins.lifecycle,
        ],
        environment: createEditorEnvironment(),
        darkColorHandler: new DarkColorHandlerImpl(
            contentDiv,
            options.getDarkColor ?? getDarkColorFallback
        ),
        trustedHTMLHandler: options.trustedHTMLHandler || defaultTrustHtmlHandler,
        domToModelSettings: createDomToModelSettings(options),
        modelToDomSettings: createModelToDomSettings(options),
        ...getPluginState(corePlugins),
        disposeErrorHandler: options.disposeErrorHandler,
        zoomScale: zoomScale,
    };
}

function createEditorEnvironment(): EditorEnvironment {
    // It is ok to use global window here since the environment should always be the same for all windows in one session
    const userAgent = window.navigator.userAgent;

    return {
        isMac: window.navigator.appVersion.indexOf('Mac') != -1,
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

function getPluginState(corePlugins: StandaloneEditorCorePlugins): StandaloneEditorCorePluginState {
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

// A fallback function, always return original color
function getDarkColorFallback(color: string) {
    return color;
}
