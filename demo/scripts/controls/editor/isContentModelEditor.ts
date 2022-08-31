import { IEditor } from 'roosterjs-editor-types';
import { IExperimentalContentModelEditor } from 'roosterjs-content-model';

export default function isContentModelEditor(
    editor: IEditor
): editor is IExperimentalContentModelEditor {
    const experimentalEditor = editor as IExperimentalContentModelEditor;

    return !!experimentalEditor.createContentModelContext && 'contentDiv' in experimentalEditor;
}
