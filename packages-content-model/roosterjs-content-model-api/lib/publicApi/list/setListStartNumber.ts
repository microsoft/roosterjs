import { getFirstSelectedListItem } from 'roosterjs-content-model-core';
import type { IEditor } from 'roosterjs-content-model-types';

/**
 * Set start number of a list item
 * @param editor The editor to operate on
 * @param value The number to set to, must be equal or greater than 1
 */
export default function setListStartNumber(editor: IEditor, value: number) {
    editor.focus();

    editor.formatContentModel(
        model => {
            const listItem = getFirstSelectedListItem(model);
            const level = listItem?.levels[listItem?.levels.length - 1];

            if (level) {
                level.format.startNumberOverride = value;

                return true;
            } else {
                return false;
            }
        },
        {
            apiName: 'setListStartNumber',
        }
    );
}
