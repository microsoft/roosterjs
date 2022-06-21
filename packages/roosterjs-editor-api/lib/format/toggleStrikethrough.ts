import execCommand from '../utils/execCommand';
import { DocumentCommand, IEditor } from 'roosterjs-editor-types';

/**
 * Toggle strikethrough at selection
 * If selection is collapsed, it will only affect the input after caret
 * If selection contains only strikethrough text, the strikethrough style will be removed
 * If selection contains only normal text, strikethrough style will be added to the whole selected text
 * If selection contains both strikethrough and normal text, strikethrough style will be added to the whole selected text
 * @param editor The editor instance
 */
export default function toggleStrikethrough(editor: IEditor) {
    execCommand(editor, DocumentCommand.StrikeThrough, 'toggleStrikethrough');
}
