import { ChangeSource, IEditor } from 'roosterjs-editor-types';

/**
 * Set the Indent of a list
 * @param editor The editor instance
 * @param list The HTML element
 * @param config The configuration arguments to set to the element, if the
 *               Global property is set it will use it, otherwise, it will use the
 *               text Indent and the unit.
 */
export default function setListIndent(
    editor: IEditor,
    list: HTMLElement,
    config: ListIndentConfiguration
) {
    editor.addUndoSnapshot((start, end) => {
        editor.focus();
        list.style.textIndent = config.globalValue ?? config.textIdent.toString() + config.unit;

        editor.select(start, end);
    }, ChangeSource.Format);
}

interface ListIndentConfiguration {
    textIdent?: number;
    unit?: 'em' | 'px' | '%' | 'in';
    globalValue?: 'inherit' | 'initial' | 'revert' | 'unset';
}
