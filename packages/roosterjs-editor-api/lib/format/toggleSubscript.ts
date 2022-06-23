import execCommand from '../utils/execCommand';
import { DocumentCommand, IEditor } from 'roosterjs-editor-types';

/**
 * Toggle subscript at selection
 * If selection is collapsed, it will only affect the input after caret
 * If selection contains only subscript text, the subscript style will be removed
 * If selection contains only normal text, subscript style will be added to the whole selected text
 * If selection contains both subscript and normal text, the subscript style will be removed from whole selected text
 * If selection contains any superscript text, the behavior is determined by corresponding realization of browser
 * execCommand API
 * @param editor The editor instance
 */
export default function toggleSubscript(editor: IEditor) {
    execCommand(editor, DocumentCommand.Subscript, 'toggleSubscript');
}
