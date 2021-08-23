import { ChangeSource, IEditor } from 'roosterjs-editor-types';

/**
 * Set the List Number Position (Margin) of a List
 * @param editor The editor instance
 * @param list The HTML element
 * @param numberPosition The number position value to be set to the list
 * @param unit The Unit to be used.
 */
export default function setListNumberPosition(
    editor: IEditor,
    list: HTMLElement,
    numberPosition: number,
    unit: 'em' | 'px' | '%' | 'in'
) {
    editor.addUndoSnapshot((start, end) => {
        editor.focus();
        list.style.marginLeft = numberPosition.toString() + unit;

        editor.select(start, end);
    }, ChangeSource.Format);
}
