import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';
import { getSelectedCells } from './getSelectedCells';
import { TableOperation } from 'roosterjs-editor-types';

/**
 * @internal
 */
export function alignTable(
    table: ContentModelTable,
    operation: TableOperation.AlignCenter | TableOperation.AlignLeft | TableOperation.AlignRight
) {
    const sel = getSelectedCells(table);

    if (sel) {
        table.format.marginLeft = operation == TableOperation.AlignLeft ? '' : 'auto';
        table.format.marginRight = operation == TableOperation.AlignRight ? '' : 'auto';
    }
}
