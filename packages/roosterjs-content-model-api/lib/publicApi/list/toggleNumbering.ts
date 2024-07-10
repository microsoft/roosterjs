import { NumberingListType } from 'roosterjs-content-model-dom';
import { setListType } from '../../modelApi/list/setListType';
import { setModelListStyle } from '../../modelApi/list/setModelListStyle';
import type { IEditor } from 'roosterjs-content-model-types';

/**
 * Toggle numbering list type
 * - When there are some blocks not in numbering list, set all blocks to the given type
 * - When all blocks are already in numbering list, turn off / outdent there list type
 * @param editor The editor to operate on
 * @param removeMargins true to remove margins, false to keep margins @default false
 */
export function toggleNumbering(editor: IEditor, removeMargins: boolean = false) {
    editor.focus();

    editor.formatContentModel(
        (model, context) => {
            context.newPendingFormat = 'preserve';

            const result = setListType(model, 'OL', removeMargins);
            setModelListStyle(model, {
                orderedStyleType: NumberingListType.Decimal,
            });

            return result;
        },
        {
            apiName: 'toggleNumbering',
        }
    );
}
