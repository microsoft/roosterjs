import hasSelectionInBlockGroup from '../../publicApi/selection/hasSelectionInBlockGroup';
import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';

/**
 * @internal
 */
export function setTableCellBackgroundColor(table: ContentModelTable, color: string) {
    table.cells.forEach(row =>
        row.forEach(cell => {
            if (hasSelectionInBlockGroup(cell)) {
                cell.format.backgroundColor = color;
                cell.format.bgColorOverride = true;
            }
        })
    );
}
