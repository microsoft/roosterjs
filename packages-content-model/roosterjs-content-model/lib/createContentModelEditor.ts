import { EditorPlugin } from 'roosterjs-editor-types';
import { getDarkColor } from 'roosterjs-color-utils';
import {
    ContentModelEditor,
    ContentModelEditorOptions,
    ContentModelPastePlugin,
    IContentModelEditor,
} from 'roosterjs-content-model-editor';

/**
 * Create a Content Model Editor using the given options
 * @param contentDiv The html div element needed for creating the editor
 * @param additionalPlugins The additional user defined plugins. Currently the default plugins that are already included are
 * ContentEdit, HyperLink and Paste, user don't need to add those.
 * @param initialContent The initial content to show in editor. It can't be removed by undo, user need to manually remove it if needed.
 * @returns The ContentModelEditor instance
 */
export function createContentModelEditor(
    contentDiv: HTMLDivElement,
    additionalPlugins?: EditorPlugin[],
    initialContent?: string
): IContentModelEditor {
    let plugins: EditorPlugin[] = [new ContentModelPastePlugin()];

    if (additionalPlugins) {
        plugins = plugins.concat(additionalPlugins);
    }

    let options: ContentModelEditorOptions = {
        plugins: plugins,
        initialContent: initialContent,
        getDarkColor: getDarkColor,
        defaultFormat: {
            fontFamily: 'Calibri,Arial,Helvetica,sans-serif',
            fontSize: '11pt',
            textColor: '#000000',
        },
    };
    return new ContentModelEditor(contentDiv, options);
}
