import { adjustTableIndentation } from '../../modelApi/common/adjustIndentation';
import { createTableStructure } from '../../modelApi/table/createTableStructure';
import { getSelectedContentForTable, insertTableContent } from '../../modelApi/table/tableContent';
import {
    createContentModelDocument,
    createSelectionMarker,
    applyTableFormat,
    deleteSelection,
    mergeModel,
    normalizeTable,
    setSelection,
    MIN_ALLOWED_TABLE_CELL_WIDTH,
} from 'roosterjs-content-model-dom';
import type {
    ContentModelTable,
    ContentModelTableFormat,
    IEditor,
    TableMetadataFormat,
    ContentModelTableCellFormat,
} from 'roosterjs-content-model-types';

/**
 * Insert table into editor at current selection
 * @param editor The editor instance
 * @param columns Number of columns in table, it also controls the default table cell width:
 * if columns &lt;= 4, width = 120px; if columns &lt;= 6, width = 100px; else width = 70px
 * @param rows Number of rows in table
 * @param tableMetadataFormat (Optional) The table format that are stored as metadata. If not passed, the default format will be applied: background color: #FFF; border color: #ABABAB
 * @param format (Optional) The table format used for style attributes
 * @param cellFormat (Optional) custom format for table cells, except for borders styles, for borders use tableMetadataFormat
 */
export function insertTable(
    editor: IEditor,
    columns: number,
    rows: number,
    tableMetadataFormat?: Partial<TableMetadataFormat>,
    format?: ContentModelTableFormat,
    customCellFormat?: ContentModelTableCellFormat
) {
    editor.focus();

    const blocks = getSelectedContentForTable(editor);

    editor.formatContentModel(
        (model, context) => {
            const deleteSelectionResult = deleteSelection(model, [], context);
            const insertPosition = deleteSelectionResult.insertPoint;

            if (insertPosition) {
                const doc = createContentModelDocument();

                const table = createTableStructure(doc, columns, rows, customCellFormat);

                if (format) {
                    table.format = { ...format };
                }

                normalizeTable(table, editor.getPendingFormat() || insertPosition.marker.format);
                initCellWidth(table);

                insertTableContent(table, blocks, columns, customCellFormat);

                adjustTableIndentation(insertPosition, table);

                // Assign default vertical align
                tableMetadataFormat = tableMetadataFormat || { verticalAlign: 'top' };
                applyTableFormat(table, tableMetadataFormat);

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

function initCellWidth(table: ContentModelTable) {
    const columns = Math.max(...table.rows.map(row => row.cells.length));

    for (let i = 0; i < columns; i++) {
        if (table.widths[i] === undefined) {
            table.widths[i] = getTableCellWidth(columns);
        } else if (table.widths[i] < MIN_ALLOWED_TABLE_CELL_WIDTH) {
            table.widths[i] = MIN_ALLOWED_TABLE_CELL_WIDTH;
        }
    }
}

function getTableCellWidth(columns: number): number {
    if (columns <= 4) {
        return 120;
    } else if (columns <= 6) {
        return 100;
    } else {
        return 70;
    }
}
