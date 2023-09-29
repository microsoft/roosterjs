import { TableOperation } from 'roosterjs-editor-types';
import type { ContentModelTable } from 'roosterjs-content-model-types';
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
    table.format.marginLeft = operation == TableOperation.AlignLeft ? '' : 'auto';
    table.format.marginRight = operation == TableOperation.AlignRight ? '' : 'auto';

    delete table.cachedElement;
}
