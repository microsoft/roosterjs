import createCorePlugins, { getPluginState } from '../../lib/corePlugins/createCorePlugins';
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
        plugins: options.plugins || [],
        ...getPluginState(createCorePlugins(contentDiv, options)),
        trustedHTMLHandler: (html: string) => html,
        sizeTransformer: x => x,
        zoomScale: 1,
        documentOrShadowRoot: document,
    };
}
