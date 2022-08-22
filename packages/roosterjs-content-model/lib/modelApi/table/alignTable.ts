import { BorderIndex, combineBorderValue, extractBorderValues } from '../../domUtils/borderValues';
import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';
import { TableOperation } from 'roosterjs-editor-types';
import type { CompatibleTableOperation } from 'roosterjs-editor-types/lib/compatibleTypes';

/**
 * @internal
 */
export function alignTable(
    table: ContentModelTable,
    operation:
        | TableOperation.AlignCenter
        | TableOperation.AlignLeft
        | TableOperation.AlignRight
        | CompatibleTableOperation.AlignCenter
        | CompatibleTableOperation.AlignLeft
        | CompatibleTableOperation.AlignRight
) {
    const values = extractBorderValues(table.format.margin || '');

    values[BorderIndex.Left] = operation == TableOperation.AlignLeft ? '' : 'auto';
    values[BorderIndex.Right] = operation == TableOperation.AlignRight ? '' : 'auto';

    table.format.margin = combineBorderValue(values, '0');
}
