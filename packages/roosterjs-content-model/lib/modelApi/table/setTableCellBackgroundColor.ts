import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';
import { hasSelectionInBlock } from '../selection/hasSelectionInBlock';

/**
 * @internal
 */
export function setTableCellBackgroundColor(table: ContentModelTable, color: string) {
    table.cells.forEach(row =>
        row.forEach(cell => {
            if (hasSelectionInBlock(cell)) {
                cell.format.backgroundColor = color;

                if (!cell.format.metadata) {
                    cell.format.metadata = {};
                }

                cell.format.metadata.bgColorOverride = true;
            }
        })
    );
}
