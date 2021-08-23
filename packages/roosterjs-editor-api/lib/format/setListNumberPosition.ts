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
    config: ListNumberPositionConfiguration
) {
    editor.addUndoSnapshot((start, end) => {
        editor.focus();
        list.style.marginLeft = config.numberPosition.toString() + config.unit;

        editor.select(start, end);
    }, ChangeSource.Format);
}

interface ListNumberPositionConfiguration {
    numberPosition: number;
    unit: 'em' | 'px' | '%' | 'in';
}
