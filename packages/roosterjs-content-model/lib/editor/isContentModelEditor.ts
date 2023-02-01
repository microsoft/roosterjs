import { IContentModelEditor } from 'roosterjs-content-model';
import { IEditor } from 'roosterjs-editor-types';

export default function isContentModelEditor(editor: IEditor): editor is IContentModelEditor {
    const contentModelEditor = editor as IContentModelEditor;

    return !!contentModelEditor.createContentModel && 'contentDiv' in contentModelEditor;
}
