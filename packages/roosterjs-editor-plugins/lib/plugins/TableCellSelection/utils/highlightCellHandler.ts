import { safeInstanceOf } from 'roosterjs-editor-dom';
import { tableCellSelectionCommon } from './tableCellSelectionCommon';

/**
 * @internal
 * Handler to apply te selected styles on the cell
 * @param element element to apply the style
 */
export function highlightCellHandler(element: HTMLElement) {
    if (
        !element.classList.contains(tableCellSelectionCommon.TABLE_CELL_SELECTED) &&
        element.style.backgroundColor != tableCellSelectionCommon.HIGHLIGHT_COLOR &&
        (!element.dataset[tableCellSelectionCommon.TEMP_BACKGROUND_COLOR] ||
            element.dataset[tableCellSelectionCommon.TEMP_BACKGROUND_COLOR] == '')
    ) {
        element.dataset[tableCellSelectionCommon.TEMP_BACKGROUND_COLOR] =
            element.style.backgroundColor ?? element.style.background ?? '';
    }
    element.style.backgroundColor = tableCellSelectionCommon.HIGHLIGHT_COLOR;
    element.classList.add(tableCellSelectionCommon.TABLE_CELL_SELECTED);

    element.querySelectorAll('td, th').forEach(cell => {
        if (safeInstanceOf(cell, 'HTMLTableCellElement')) {
            highlightCellHandler(cell);
        }
    });
}
