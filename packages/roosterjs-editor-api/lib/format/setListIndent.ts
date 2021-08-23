import { ChangeSource, IEditor } from 'roosterjs-editor-types';

/**
 * Set the Indent of a list
 * @param editor The editor instance
 * @param list The HTML element
 * @param textIdent The indent value to be set to the list
 * @param unit The Unit to be used.
 */
export default function setListIndent(
    editor: IEditor,
    list: HTMLElement,
    textIdent: number,
    unit: 'em' | 'px' | '%' | 'in'
) {
    editor.addUndoSnapshot((start, end) => {
        editor.focus();
        list.style.textIndent = textIdent.toString() + unit;

        editor.select(start, end);
    }, ChangeSource.Format);
}
