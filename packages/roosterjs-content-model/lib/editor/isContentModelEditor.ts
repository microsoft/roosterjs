import { IEditor } from 'roosterjs-editor-types';
import { IExperimentalContentModelEditor } from '../publicTypes/IExperimentalContentModelEditor';

export default function isContentModelEditor(
    editor: IEditor
): editor is IExperimentalContentModelEditor {
    const experimentalEditor = editor as IExperimentalContentModelEditor;

    return !!experimentalEditor.createContentModelContext;
}
