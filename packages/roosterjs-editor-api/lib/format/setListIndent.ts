import { ChangeSource, IEditor } from 'roosterjs-editor-types';
/**
 * Resets Ordered List Numbering back to the value of the parameter startNumber
 * @param editor The editor instance
 * @param separator The HTML element that indicates when to split the VList
 * @param startNumber The number of that the splitted list should start
 */
export default function setListIndent(editor: IEditor, list: HTMLOListElement, textIndent: number) {
    editor.addUndoSnapshot(() => {
        editor.focus();
        list.style.textIndent = `${textIndent.toString()}px`;
    }, ChangeSource.Format);
}
