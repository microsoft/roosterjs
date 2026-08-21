import {
    getSelectedCells,
    mutateBlock,
    updateTableCellMetadata,
} from 'roosterjs-content-model-dom';
import type {
    ShallowMutableContentModelTable,
    ShallowMutableContentModelTableCell,
    TableCellHorizontalAlignOperation,
    TableCellVerticalAlignOperation,
} from 'roosterjs-content-model-types';

const TextAlignValueMap: Record<
    TableCellHorizontalAlignOperation,
    Partial<Record<'ltr' | 'rtl', 'start' | 'center' | 'end'>>
> = {
    alignCellLeft: {
        ltr: 'start',
        rtl: 'end',
    },
    alignCellCenter: {
        ltr: 'center',
        rtl: 'center',
    },
    alignCellRight: {
        ltr: 'end',
        rtl: 'start',
    },
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
    table: ShallowMutableContentModelTable,
    operation: TableCellHorizontalAlignOperation
) {
    alignTableCellInternal(table, cell => {
        const alignment =
            TextAlignValueMap[operation][cell.format.direction == 'rtl' ? 'rtl' : 'ltr'];
        cell.format.textAlign = alignment;
        for (const block of cell.blocks) {
            if (block.blockType === 'Paragraph' && block.format.textAlign) {
                delete mutateBlock(block).format.textAlign;
            } else if (block.blockType == 'BlockGroup' && block.blockGroupType == 'ListItem') {
                mutateBlock(block).format.textAlign = alignment;
            }
        }
    });
}

/**
 * @internal
 */
export function alignTableCellVertically(
    table: ShallowMutableContentModelTable,
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
    table: ShallowMutableContentModelTable,
    callback: (cell: ShallowMutableContentModelTableCell) => void
) {
    const sel = getSelectedCells(table);

    if (sel) {
        for (let rowIndex = sel.firstRow; rowIndex <= sel.lastRow; rowIndex++) {
            for (let colIndex = sel.firstColumn; colIndex <= sel.lastColumn; colIndex++) {
                const cell = table.rows[rowIndex]?.cells[colIndex];
                const format = cell?.format;

                if (format) {
                    callback(mutateBlock(cell));
                }
            }
        }
    }
}
