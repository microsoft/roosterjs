import execCommand from '../utils/execCommand';
import { DocumentCommand, IEditor } from 'roosterjs-editor-types';

/**
 * Toggle underline at selection
 * If selection is collapsed, it will only affect the input after caret
 * If selection contains only underlined text, the underline style will be removed
 * If selection contains only normal text, underline style will be added to the whole selected text
 * If selection contains both underlined and normal text, the underline style will be added to the whole selected text
 * @param editor The editor instance
 */
export default function toggleUnderline(editor: IEditor) {
    execCommand(editor, DocumentCommand.Underline, 'toggleUnderline');
}
