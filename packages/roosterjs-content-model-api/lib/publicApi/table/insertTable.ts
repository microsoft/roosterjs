import { createContentModelDocument, createSelectionMarker } from 'roosterjs-content-model-dom';
import { createTableStructure } from '../../modelApi/table/createTableStructure';
import {
    applyTableFormat,
    deleteSelection,
    mergeModel,
    normalizeTable,
    setSelection,
} from 'roosterjs-content-model-core';
import type { IEditor, TableMetadataFormat } from 'roosterjs-content-model-types';

/**
 * Insert table into editor at current selection
 * @param editor The editor instance
 * @param columns Number of columns in table, it also controls the default table cell width:
 * if columns &lt;= 4, width = 120px; if columns &lt;= 6, width = 100px; else width = 70px
 * @param rows Number of rows in table
 * @param format (Optional) The table format. If not passed, the default format will be applied:
 * background color: #FFF; border color: #ABABAB
 */
export function insertTable(
    editor: IEditor,
    columns: number,
    rows: number,
    format?: Partial<TableMetadataFormat>
) {
    editor.focus();

    editor.formatContentModel(
        (model, context) => {
            const insertPosition = deleteSelection(model, [], context).insertPoint;

            if (insertPosition) {
                const doc = createContentModelDocument();
                const table = createTableStructure(doc, columns, rows);

                normalizeTable(table, editor.getPendingFormat() || insertPosition.marker.format);
                // Assign default vertical align
                format = format || { verticalAlign: 'top' };
                applyTableFormat(table, format);
                mergeModel(model, doc, context, {
                    insertPosition,
                    mergeFormat: 'mergeAll',
                });

                const firstBlock = table.rows[0]?.cells[0]?.blocks[0];

                if (firstBlock?.blockType == 'Paragraph') {
                    const marker = createSelectionMarker(firstBlock.segments[0]?.format);
                    firstBlock.segments.unshift(marker);
                    setSelection(model, marker);
                }

                return true;
            } else {
                return false;
            }
        },
        {
            apiName: 'insertTable',
        }
    );
}
