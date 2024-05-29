import type {
    ShallowMutableContentModelTable,
    TableAlignOperation,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function alignTable(table: ShallowMutableContentModelTable, operation: TableAlignOperation) {
    table.format.marginLeft = operation == 'alignLeft' ? '' : 'auto';
    table.format.marginRight = operation == 'alignRight' ? '' : 'auto';

    delete table.cachedElement;
}
