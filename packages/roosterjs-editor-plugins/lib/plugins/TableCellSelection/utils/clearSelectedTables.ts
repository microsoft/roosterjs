import { deselectTable } from './deselectTable';
import { TABLE_SELECTED } from '../TableCellSelection';

/**
 * @internal
 * Clear selection inside of a element
 * @param element element to clear selection
 */
export function clearSelectedTables(element: HTMLElement) {
    element.querySelectorAll('table.' + TABLE_SELECTED).forEach(deselectTable);
}
