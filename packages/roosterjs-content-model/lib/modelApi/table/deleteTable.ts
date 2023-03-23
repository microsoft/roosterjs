import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';

/**
 * @internal
 */
export function deleteTable(table: ContentModelTable) {
    table.cells = [];
    delete table.cachedElement;
}
