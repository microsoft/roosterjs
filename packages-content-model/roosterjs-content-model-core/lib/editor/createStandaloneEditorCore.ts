import { createStandaloneEditorCorePlugins } from '../corePlugin/createStandaloneEditorCorePlugins';
import { createStandaloneEditorDefaultSettings } from './createStandaloneEditorDefaultSettings';
import { DarkColorHandlerImpl } from './DarkColorHandlerImpl';
import { standaloneCoreApiMap } from './standaloneCoreApiMap';
import type {
    EditorEnvironment,
    StandaloneEditorCore,
    StandaloneEditorCorePlugins,
    StandaloneEditorOptions,
    UnportedCoreApiMap,
    UnportedCorePluginState,
} from 'roosterjs-content-model-types';

/**
 * A temporary function to create Standalone Editor core
 * @param contentDiv Editor content DIV
 * @param options Editor options
 */
export function createStandaloneEditorCore(
    contentDiv: HTMLDivElement,
    options: StandaloneEditorOptions,
    unportedCoreApiMap: UnportedCoreApiMap,
    unportedCorePluginState: UnportedCorePluginState
): StandaloneEditorCore {
    const corePlugins = createStandaloneEditorCorePlugins(options, contentDiv);

    return {
        contentDiv,
        api: { ...standaloneCoreApiMap, ...unportedCoreApiMap, ...options.coreApiOverride },
        originalApi: { ...standaloneCoreApiMap, ...unportedCoreApiMap },
        plugins: [
            corePlugins.cache,
            corePlugins.format,
            corePlugins.copyPaste,
            corePlugins.domEvent,
            // TODO: Add additional plugins here
        ],
        environment: createEditorEnvironment(),
        darkColorHandler: new DarkColorHandlerImpl(contentDiv, options.baseDarkColor),
        imageSelectionBorderColor: options.imageSelectionBorderColor, // TODO: Move to Selection core plugin
        trustedHTMLHandler: options.trustedHTMLHandler || defaultTrustHtmlHandler,
        ...createStandaloneEditorDefaultSettings(options),
        ...getPluginState(corePlugins),
        ...unportedCorePluginState,
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

function getPluginState(corePlugins: StandaloneEditorCorePlugins) {
    return {
        domEvent: corePlugins.domEvent.getState(),
        copyPaste: corePlugins.copyPaste.getState(),
        cache: corePlugins.cache.getState(),
        format: corePlugins.format.getState(),
    };
}
