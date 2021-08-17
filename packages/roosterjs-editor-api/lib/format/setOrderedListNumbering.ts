import splitList from '../utils/splitList';
import { IEditor } from 'roosterjs-editor-types';

/**
 * Resets Ordered List Numbering back to 1
 * @param editor The editor instance
 * @param list The List that is going to be split
 * @param startNumber The number of that the splitted list should start
 */
export default function setOrderedListNumbering(
    editor: IEditor,
    separator: HTMLLIElement,
    startNumber?: number
) {
    splitList(editor, separator, startNumber);
}
