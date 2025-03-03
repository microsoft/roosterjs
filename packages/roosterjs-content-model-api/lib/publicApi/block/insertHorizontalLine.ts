import { insertHorizontalLineIntoModel } from '../../modelApi/block/insertHorizontalLineIntoModel';
import type { IEditor } from 'roosterjs-content-model-types';

/**
 * Inserts a horizontal line at the current selection
 * @param editor The editor to insert horizontal line
 */
export function insertHorizontalLine(editor: IEditor) {
    editor.formatContentModel(
        (model, context) => {
            insertHorizontalLineIntoModel(model, context);
            return true;
        },
        {
            apiName: 'insertHorizontalLine',
        }
    );
}
