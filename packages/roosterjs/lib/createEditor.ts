import {
    DefaultShortcut,
    HtmlSnapshotUndo,
    HyperLink,
    PasteManager,
    TabIndent,
} from 'roosterjs-editor-plugins';
import { Editor, EditorOptions, EditorPlugin } from 'roosterjs-editor-core';

// Create an editor instance with most common options
export default function createEditor(
    contentDiv: HTMLDivElement,
    additionalPlugins?: EditorPlugin[]
): Editor {
    let plugins: EditorPlugin[] = [
        new DefaultShortcut(),
        new HyperLink(),
        new PasteManager(),
        new TabIndent(),
    ];

    if (additionalPlugins) {
        plugins = plugins.concat(additionalPlugins);
    }

    let options: EditorOptions = {
        plugins: plugins,
        undo: new HtmlSnapshotUndo(),
        defaultFormat: {
            fontFamily: 'Calibri,Arial,Helvetica,sans-serif',
            fontSize: '11pt',
            textColor: '#000000',
        },
    };
    return new Editor(contentDiv, options);
}
