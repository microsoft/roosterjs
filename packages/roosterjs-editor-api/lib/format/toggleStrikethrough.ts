import execCommand from './execCommand';
import { DocumentCommand } from 'roosterjs-editor-types';
import { Editor } from 'roosterjs-editor-core';

/**
 * Toggle strikethrough at selection
 * If selection is collapsed, it will only affect the input after caret
 * If selection contains only strikethrough text, the strikethrough style will be removed
 * If selection contains only normal text, strikethrough style will be added to the whole selected text
 * If selection contains both strikethrough and normal text, strikethrough stlye will be added to the whole selected text
 * @param editor The editor instance
 */
export default function toggleStrikethrough(editor: Editor) {
    execCommand(editor, DocumentCommand.StrikeThrough);
}
