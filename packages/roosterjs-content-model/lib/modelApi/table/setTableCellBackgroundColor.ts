import hasSelectionInBlockGroup from '../../publicApi/selection/hasSelectionInBlockGroup';
import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';
import { updateTableCellMetadata } from '../metadata/updateTableCellMetadata';

/**
 * @internal
 */
export function setTableCellBackgroundColor(table: ContentModelTable, color: string) {
    table.cells.forEach(row =>
        row.forEach(cell => {
            if (hasSelectionInBlockGroup(cell)) {
                cell.format.backgroundColor = color;
                updateTableCellMetadata(cell, metadata => {
                    metadata = metadata || {};
                    metadata.bgColorOverride = true;
                    return metadata;
                });
            }
        })
    );
}
