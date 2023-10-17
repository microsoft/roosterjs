import { getSelectedCells } from './getSelectedCells';
import { updateTableCellMetadata } from '../../domUtils/metadata/updateTableCellMetadata';
import type {
    TableCellHorizontalAlignOperation,
    TableCellVerticalAlignOperation,
} from '../../publicTypes/parameter/TableOperation';
import type { ContentModelTable, ContentModelTableCell } from 'roosterjs-content-model-types';

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
            for (let colIndex = sel.firstCol; colIndex <= sel.lastCol; colIndex++) {
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
