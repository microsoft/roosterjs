import type { ContentModelTable } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function deleteTable(table: ContentModelTable) {
    table.rows = [];
    delete table.cachedElement;
}
