import { setModelListStartNumber } from '../../modelApi/list/setModelListStartNumber';
import type { IEditor } from 'roosterjs-content-model-types';

/**
 * Set start number of a list item
 * @param editor The editor to operate on
 * @param value The number to set to, must be equal or greater than 1
 */
export function setListStartNumber(editor: IEditor, value: number) {
    editor.focus();

    editor.formatContentModel(
        model => {
            return setModelListStartNumber(model, value);
        },
        {
            apiName: 'setListStartNumber',
        }
    );
}
