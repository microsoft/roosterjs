import { getFirstSelectedTable } from 'roosterjs-content-model-dom';
import type { ContentModelTable, IEditor } from 'roosterjs-content-model-types';

/**
 * @internal
 * Get ContentModelTable from a table element if it is present in the content model
 */
export function getCMTableFromTable(editor: IEditor, table: HTMLTableElement) {
    let cmTable: ContentModelTable | undefined;

    editor.formatContentModel(
        model => {
            [cmTable] = getFirstSelectedTable(model);
            return false;
        },
        {
            selectionOverride: {
                type: 'table',
                firstColumn: 0,
                firstRow: 0,
                lastColumn: 0,
                lastRow: 0,
                table: table,
            },
        }
    );

    return cmTable;
}
