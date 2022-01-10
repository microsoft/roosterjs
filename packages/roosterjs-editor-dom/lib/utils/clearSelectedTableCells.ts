import findClosestElementAncestor from './findClosestElementAncestor';
import safeInstanceOf from './safeInstanceOf';
import VTable from '../table/VTable';
import { TableMetadata } from '../table/tableMetadata';

const TABLE_CELL_SELECTED_CLASS = TableMetadata.TABLE_CELL_SELECTED;

/**
 * Remove the selected style of the cells
 * @param editor Editor Instance
 */
export default function clearSelectedTableCells(container: Node, cacheSelection: boolean = false) {
    const tables = getSelectedTables(container);

    if (tables) {
        tables.forEach(element => {
            if (safeInstanceOf(element, 'HTMLTableElement')) {
                const vTable = new VTable(element);
                vTable.deSelectAll(cacheSelection);
            }
        });
    }
}

/**
 * @internal
 * Get the cells with the selected cells class
 * @param editor Editor Instance
 * @returns Array of Nodes
 */
export function getSelectedTables(container: Node) {
    if (container && safeInstanceOf(container, 'HTMLElement')) {
        let result = container.querySelectorAll('table');
        if (result.length == 0) {
            let table = findClosestElementAncestor(container, null, 'table');
            if (table && table.querySelectorAll('.' + TABLE_CELL_SELECTED_CLASS).length > 0) {
                return [table];
            }
        }

        return result;
    }
}
