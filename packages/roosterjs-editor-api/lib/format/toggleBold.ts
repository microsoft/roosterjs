import execCommand from '../utils/execCommand';
import { DocumentCommand } from 'roosterjs-editor-types';
import { Editor } from 'roosterjs-editor-core';

/**
 * Toggle bold at selection
 * If selection is collapsed, it will only affect the following input after caret
 * If selection contains only bold text, the bold style will be removed
 * If selection contains only normal text, bold style will be added to the whole selected text
 * If selection contains both bold and normal text, bold stle will be added to the whole selected text
 * @param editor The editor instance
 */
export default function toggleBold(editor: Editor) {
    execCommand(editor, DocumentCommand.Bold);
}
