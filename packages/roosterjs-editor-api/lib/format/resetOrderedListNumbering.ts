import splitList from '../utils/splitList';
import { IEditor } from 'roosterjs-editor-types';

/**
 * Resets Ordered List Numbering back to 1
 * @param editor The editor instance
 * @param list The List that is going to be split
 */
export default function resetOrderedListNumbering(editor: IEditor, list: HTMLOListElement) {
    splitList(editor, list);
}
