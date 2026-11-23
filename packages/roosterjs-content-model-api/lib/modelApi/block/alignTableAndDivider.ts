import type {
    ContentModelDivider,
    ShallowMutableContentModelTable,
    TableAlignOperation,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function alignTableAndDivider(
    table: ShallowMutableContentModelTable | ContentModelDivider,
    operation: TableAlignOperation
) {
    table.format.marginLeft = operation == 'alignLeft' ? '' : 'auto';
    table.format.marginRight = operation == 'alignRight' ? '' : 'auto';
}
