import { adjustTableIndentation } from '../../modelApi/common/adjustIndentation';
import { createTableStructure } from '../../modelApi/table/createTableStructure';
import {
    createContentModelDocument,
    createSelectionMarker,
    applyTableFormat,
    deleteSelection,
    mergeModel,
    normalizeTable,
    setSelection,
    MIN_ALLOWED_TABLE_CELL_WIDTH,
    cloneModel,
    iterateSelections,
    createTableCell,
    createTableRow,
} from 'roosterjs-content-model-dom';
import type {
    ContentModelTable,
    ContentModelTableFormat,
    IEditor,
    TableMetadataFormat,
    ContentModelTableCellFormat,
    ContentModelDocument,
    ContentModelBlockGroup,
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

    editor.formatContentModel(
        (model, context) => {
            const copiedModel = cloneModel(model);
            const deleteSelectionResult = deleteSelection(model, [], context);
            const insertPosition = deleteSelectionResult.insertPoint;

            if (insertPosition) {
                const doc = createContentModelDocument();
                const hasSelection = deleteSelectionResult.deleteResult == 'range';

                const table = createTableStructure(doc, columns, rows, customCellFormat);

                if (format) {
                    table.format = { ...format };
                }

                if (hasSelection) {
                    insertTableContent(copiedModel, table, columns, customCellFormat);
                }

                normalizeTable(table, editor.getPendingFormat() || insertPosition.marker.format);
                initCellWidth(table);

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

function insertTableContent(
    model: ContentModelDocument,
    table: ContentModelTable,
    colNumber: number,
    customCellFormat?: ContentModelTableCellFormat
) {
    let index = 0;
    let lastBlock: ContentModelBlockGroup | undefined = undefined;
    iterateSelections(model, (path, _tableContext, block) => {
        if (!table.rows[index]) {
            const row = createTableRow();
            for (let i = 0; i < colNumber; i++) {
                const cell = createTableCell(
                    undefined /*spanLeftOrColSpan */,
                    undefined /*spanAboveOrRowSpan */,
                    undefined /* isHeader */,
                    customCellFormat
                );
                row.cells.push(cell);
            }
            table.rows.push(row);
        }

        if (path.length == 1 && block) {
            table.rows[index].cells[0].blocks = [block];
            index++;
        } else if (
            block &&
            path[0].blockGroupType !== 'TableCell' &&
            path[0].blockGroupType !== 'Document' &&
            path[0] !== lastBlock
        ) {
            table.rows[index].cells[0].blocks = [path[0]];
            lastBlock = path[0];
            index++;
        }
    });
}
