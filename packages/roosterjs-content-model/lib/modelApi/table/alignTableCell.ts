import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';
import { getSelectedCells } from './getSelectedCells';
import { TableOperation } from 'roosterjs-editor-types';
import type { CompatibleTableOperation } from 'roosterjs-editor-types/lib/compatibleTypes';

const TextAlignValueMap: Partial<Record<TableOperation, 'start' | 'center' | 'end'>> = {
    [TableOperation.AlignCellLeft]: 'start',
    [TableOperation.AlignCellCenter]: 'center',
    [TableOperation.AlignCellRight]: 'end',
};

const VerticalAlignValueMap: Partial<Record<TableOperation, 'top' | 'middle' | 'bottom'>> = {
    [TableOperation.AlignCellTop]: 'top',
    [TableOperation.AlignCellMiddle]: 'middle',
    [TableOperation.AlignCellBottom]: 'bottom',
};

/**
 * @internal
 */
export function alignTableCell(
    table: ContentModelTable,
    operation:
        | TableOperation.AlignCellCenter
        | TableOperation.AlignCellLeft
        | TableOperation.AlignCellRight
        | TableOperation.AlignCellTop
        | TableOperation.AlignCellMiddle
        | TableOperation.AlignCellBottom
        | CompatibleTableOperation.AlignCellCenter
        | CompatibleTableOperation.AlignCellLeft
        | CompatibleTableOperation.AlignCellRight
        | CompatibleTableOperation.AlignCellTop
        | CompatibleTableOperation.AlignCellMiddle
        | CompatibleTableOperation.AlignCellBottom
) {
    const sel = getSelectedCells(table);

    if (sel) {
        const textAlign = TextAlignValueMap[operation];
        const verticalAlign = VerticalAlignValueMap[operation];

        for (let rowIndex = sel.firstRow; rowIndex <= sel.lastRow; rowIndex++) {
            for (let colIndex = sel.firstCol; colIndex <= sel.lastCol; colIndex++) {
                const cell = table.rows[rowIndex]?.cells[colIndex];
                const format = cell?.format;

                if (format) {
                    delete cell.cachedElement;

                    format.textAlign = textAlign || format.textAlign;
                    format.verticalAlign = verticalAlign || format.verticalAlign;
                }
            }
        }
    }
}
