import { getSelectedCells, updateTableCellMetadata } from 'roosterjs-content-model-core';
import type {
    ContentModelTable,
    ContentModelTableCell,
    TableCellHorizontalAlignOperation,
    TableCellVerticalAlignOperation,
} from 'roosterjs-content-model-types';

const TextAlignValueMap: Partial<Record<
    TableCellHorizontalAlignOperation,
    'start' | 'center' | 'end'
>> = {
    alignCellLeft: 'start',
    alignCellCenter: 'center',
    alignCellRight: 'end',
};

const VerticalAlignValueMap: Partial<Record<
    TableCellVerticalAlignOperation,
    'top' | 'middle' | 'bottom'
>> = {
    alignCellTop: 'top',
    alignCellMiddle: 'middle',
    alignCellBottom: 'bottom',
};

/**
 * @internal
 */
export function alignTableCellHorizontally(
    table: ContentModelTable,
    operation: TableCellHorizontalAlignOperation
) {
    alignTableCellInternal(table, cell => {
        cell.format.textAlign = TextAlignValueMap[operation];
    });
}

/**
 * @internal
 */
export function alignTableCellVertically(
    table: ContentModelTable,
    operation: TableCellVerticalAlignOperation
) {
    alignTableCellInternal(table, cell => {
        cell.format.verticalAlign = VerticalAlignValueMap[operation];

        updateTableCellMetadata(cell, metadata => {
            metadata = metadata || {};
            metadata.vAlignOverride = true;
            return metadata;
        });
    });
}

function alignTableCellInternal(
    table: ContentModelTable,
    callback: (cell: ContentModelTableCell) => void
) {
    const sel = getSelectedCells(table);

    if (sel) {
        for (let rowIndex = sel.firstRow; rowIndex <= sel.lastRow; rowIndex++) {
            for (let colIndex = sel.firstColumn; colIndex <= sel.lastColumn; colIndex++) {
                const cell = table.rows[rowIndex]?.cells[colIndex];
                const format = cell?.format;

                if (format) {
                    delete cell.cachedElement;

                    callback(cell);

                    cell.blocks.forEach(block => {
                        if (block.blockType === 'Paragraph') {
                            delete block.format.textAlign;
                        }
                    });
                }
            }
        }
    }
}
