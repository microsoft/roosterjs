import { ContentEdit } from 'roosterjs-editor-plugins/lib/ContentEdit';
import { Editor } from 'roosterjs-editor-core';
import { EditorOptions, EditorPlugin, IEditor } from 'roosterjs-editor-types';
import { getDarkColor } from 'roosterjs-color-utils';
import { HyperLink } from 'roosterjs-editor-plugins/lib/HyperLink';
import { Paste } from 'roosterjs-editor-plugins/lib/Paste';

/**
 * Create an editor instance with most common options
 * @param contentDiv The html div element needed for creating the editor
 * @param additionalPlugins The additional user defined plugins. Currently the default plugins that are already included are
 * ContentEdit, HyperLink and Paste, user don't need to add those.
 * @param initialContent The initial content to show in editor. It can't be removed by undo, user need to manually remove it if needed.
 * @returns The editor instance
 */
export default function createEditor(
    contentDiv: HTMLDivElement,
    additionalPlugins?: EditorPlugin[],
    initialContent?: string
): IEditor {
    let plugins: EditorPlugin[] = [new HyperLink(), new Paste(), new ContentEdit()];

    if (additionalPlugins) {
        plugins = plugins.concat(additionalPlugins);
    }

    let options: EditorOptions = {
        plugins: plugins,
        initialContent: initialContent,
        getDarkColor: getDarkColor,
        defaultFormat: {
            fontFamily: 'Calibri,Arial,Helvetica,sans-serif',
            fontSize: '11pt',
            textColor: '#000000',
        },
    };
    return new Editor(contentDiv, options);
}
