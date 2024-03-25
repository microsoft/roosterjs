import { setModelListStyle } from '../../modelApi/list/setModelListStyle';
import type { IEditor, ListMetadataFormat } from 'roosterjs-content-model-types';

/**
 * Set style of list items with in same thread of current item
 * @param editor The editor to operate on
 * @param style The target list item style to set
 */
export function setListStyle(editor: IEditor, style: ListMetadataFormat) {
    editor.focus();

    editor.formatContentModel(
        model => {
            return setModelListStyle(model, style);
        },
        {
            apiName: 'setListStyle',
        }
    );
}
