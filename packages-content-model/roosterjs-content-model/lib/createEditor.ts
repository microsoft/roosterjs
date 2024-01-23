import { ContentModelEditPlugin, ContentModelPastePlugin } from 'roosterjs-content-model-plugins';
import { StandaloneEditor } from 'roosterjs-content-model-core';
import type {
    ContentModelDocument,
    EditorPlugin,
    IStandaloneEditor,
    StandaloneEditorOptions,
} from 'roosterjs-content-model-types';

/**
 * Create a Content Model Editor using the given options
 * @param contentDiv The html div element needed for creating the editor
 * @param additionalPlugins The additional user defined plugins. Currently the default plugins that are already included are
 * ContentEdit, HyperLink and Paste, user don't need to add those.
 * @param initialContent The initial content to show in editor. It can't be removed by undo, user need to manually remove it if needed.
 * @returns The ContentModelEditor instance
 */
export function createEditor(
    contentDiv: HTMLDivElement,
    additionalPlugins?: EditorPlugin[],
    initialModel?: ContentModelDocument
): IStandaloneEditor {
    const plugins = [
        new ContentModelPastePlugin(),
        new ContentModelEditPlugin(),
        ...(additionalPlugins ?? []),
    ];

    const options: StandaloneEditorOptions = {
        plugins: plugins,
        initialModel,
        defaultSegmentFormat: {
            fontFamily: 'Calibri,Arial,Helvetica,sans-serif',
            fontSize: '11pt',
            textColor: '#000000',
        },
    };
    return new StandaloneEditor(contentDiv, options);
}
