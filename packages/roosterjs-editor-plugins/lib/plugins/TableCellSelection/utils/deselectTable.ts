import { deselectCellHandler } from './deselectCellHandler';
import { safeInstanceOf } from 'roosterjs-editor-dom';
import { tableCellSelectionCommon } from './tableCellSelectionCommon';

/**
 * @internal
 * Removes the selection of all the tables cells inside of cell
 */
export function deselectTable(element: HTMLElement) {
    if (safeInstanceOf(element, 'HTMLTableElement')) {
        if (element?.classList.contains(tableCellSelectionCommon.TABLE_SELECTED)) {
            element.classList.remove(tableCellSelectionCommon.TABLE_SELECTED);
        }
        element.querySelectorAll('td,th').forEach(deselectCellHandler);
    }
}
