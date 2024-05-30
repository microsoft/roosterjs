import type { ShallowMutableContentModelTable } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function deleteTable(table: ShallowMutableContentModelTable) {
    table.rows = [];
    delete table.cachedElement;
}
