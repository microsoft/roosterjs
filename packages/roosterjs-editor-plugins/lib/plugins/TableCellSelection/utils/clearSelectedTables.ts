import { deselectTable } from './deselectTable';
import { tableCellSelectionCommon } from './tableCellSelectionCommon';

/**
 * @internal
 * Clear selection inside of a element
 * @param element element to clear selection
 */
export function clearSelectedTables(element: HTMLElement) {
    element
        .querySelectorAll('table.' + tableCellSelectionCommon.TABLE_SELECTED)
        .forEach(deselectTable);
}
