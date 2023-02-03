import { IContentModelEditor } from 'roosterjs-content-model';
import { IEditor } from 'roosterjs-editor-types';

export default function isContentModelEditor(editor: IEditor): editor is IContentModelEditor {
    const experimentalEditor = editor as IContentModelEditor;

    return !!experimentalEditor.createContentModel && 'contentDiv' in experimentalEditor;
}
