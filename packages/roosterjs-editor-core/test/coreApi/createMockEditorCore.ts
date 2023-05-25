import createCorePlugins, { getPluginState } from '../../lib/corePlugins/createCorePlugins';
import DarkColorHandlerImpl from '../../lib/editor/DarkColorHandlerImpl';
import { coreApiMap } from '../../lib/coreApi/coreApiMap';
import { EditorCore, EditorOptions } from 'roosterjs-editor-types';

export default function createMockEditorCore(
    contentDiv: HTMLDivElement,
    options: EditorOptions
): EditorCore {
    return {
        contentDiv,
        api: {
            ...coreApiMap,
            ...(options.coreApiOverride || {}),
        },
        originalApi: coreApiMap,
        plugins: options.plugins || [],
        ...getPluginState(createCorePlugins(contentDiv, options)),
        trustedHTMLHandler: (html: string) => html,
        sizeTransformer: x => x,
        zoomScale: 1,
        getVisibleViewport: () => contentDiv.getBoundingClientRect(),
        darkColorHandler: new DarkColorHandlerImpl(contentDiv, s => 'darkMock: ' + s),
    };
}
