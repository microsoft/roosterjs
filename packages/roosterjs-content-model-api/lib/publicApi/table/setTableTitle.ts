import { getFirstSelectedTable, mutateBlock } from 'roosterjs-content-model-dom';
import type { IEditor } from 'roosterjs-content-model-types';

/**
 * Set table title
 * @param editor The editor instance
 * @param title The title to set
 */
export function setTableTitle(editor: IEditor, title: string) {
    editor.focus();

    editor.formatContentModel(
        model => {
            const [table] = getFirstSelectedTable(model);

            if (table) {
                mutateBlock(table).format.title = title;

                return true;
            } else {
                return false;
            }
        },
        {
            apiName: 'setTableTitle',
        }
    );
}
