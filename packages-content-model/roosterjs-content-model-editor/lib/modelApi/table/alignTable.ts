import type { TableAlignOperation } from '../../publicTypes/parameter/TableOperation';
import type { ContentModelTable } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function alignTable(table: ContentModelTable, operation: TableAlignOperation) {
    table.format.marginLeft = operation == 'alignLeft' ? '' : 'auto';
    table.format.marginRight = operation == 'alignRight' ? '' : 'auto';

    delete table.cachedElement;
}
