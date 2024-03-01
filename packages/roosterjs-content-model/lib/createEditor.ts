import { Editor } from 'roosterjs-content-model-core';
import { EditPlugin, PastePlugin } from 'roosterjs-content-model-plugins';
import type {
    ContentModelDocument,
    EditorPlugin,
    IEditor,
    EditorOptions,
} from 'roosterjs-content-model-types';

/**
 * Create a new Editor instance using the given options
 * @param contentDiv The html div element needed for creating the editor
 * @param additionalPlugins The additional user defined plugins. Currently the default plugins that are already included are
 * PastePlugin, EditPlugin, user don't need to add those.
 * @param initialModel The initial content model to show in editor. It can't be removed by undo, user need to manually remove it if needed.
 * @returns The Editor instance
 */
export function createEditor(
    contentDiv: HTMLDivElement,
    additionalPlugins?: EditorPlugin[],
    initialModel?: ContentModelDocument
): IEditor {
    const plugins = [new PastePlugin(), new EditPlugin(), ...(additionalPlugins ?? [])];

    const options: EditorOptions = {
        plugins: plugins,
        initialModel,
        defaultSegmentFormat: {
            fontFamily: 'Calibri,Arial,Helvetica,sans-serif',
            fontSize: '11pt',
            textColor: '#000000',
        },
    };
    return new Editor(contentDiv, options);
}
