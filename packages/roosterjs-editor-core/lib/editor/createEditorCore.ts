import createCorePlugins, { getPluginState } from '../corePlugins/createCorePlugins';
import DarkColorHandlerImpl from './DarkColorHandlerImpl';
import { arrayPush, getIntersectedRect, getObjectKeys } from 'roosterjs-editor-dom';
import { coreApiMap } from '../coreApi/coreApiMap';
import { CoreCreator, EditorCore, EditorOptions, EditorPlugin } from 'roosterjs-editor-types';

/**
 * Create a new instance of Editor Core
 * @param contentDiv The DIV HTML element which will be the container element of editor
 * @param options An optional options object to customize the editor
 */
export const createEditorCore: CoreCreator<EditorCore, EditorOptions> = (contentDiv, options) => {
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

    const core: EditorCore = {
        contentDiv,
        api: {
            ...coreApiMap,
            ...(options.coreApiOverride || {}),
        },
        originalApi: coreApiMap,
        plugins: plugins.filter(x => !!x),
        ...pluginState,
        trustedHTMLHandler: options.trustedHTMLHandler || ((html: string) => html),
        zoomScale: zoomScale,
        sizeTransformer: options.sizeTransformer || ((size: number) => size / zoomScale),
        getVisibleViewport,
        imageSelectionBorderColor: options.imageSelectionBorderColor,
        darkColorHandler: new DarkColorHandlerImpl(contentDiv, pluginState.lifecycle.getDarkColor),
    };

    return core;
};
