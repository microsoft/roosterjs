import execCommand from '../utils/execCommand';
import { DocumentCommand, IEditor } from 'roosterjs-editor-types';

/**
 * Toggle superscript at selection
 * If selection is collapsed, it will only affect the input after caret
 * If selection contains only superscript text, the superscript style will be removed
 * If selection contains only normal text, superscript style will be added to the whole selected text
 * If selection contains both superscript and normal text, the superscript style will be removed from whole selected text
 * If selection contains any subscript text, the behavior is determined by corresponding realization of browser
 * execCommand API
 * @param editor The editor instance
 */
export default function toggleSuperscript(editor: IEditor) {
    execCommand(editor, DocumentCommand.Superscript, 'toggleSuperscript');
}
