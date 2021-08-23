import { ChangeSource, IEditor } from 'roosterjs-editor-types';

/**
 * Set the List Number Position (Margin) of a List
 * @param editor The editor instance
 * @param list The HTML element
 * @param config Configuration Arguments to set to the List
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
