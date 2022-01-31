import { safeInstanceOf } from 'roosterjs-editor-dom';
import { tableCellSelectionCommon } from './tableCellSelectionCommon';

/**
 * @internal
 * Handler to apply te selected styles on the cell
 * @param element element to apply the style
 */
export function highlightCellHandler(element: HTMLElement) {
    element.classList.add(tableCellSelectionCommon.TABLE_CELL_SELECTED);

    let style = element.style.backgroundColor;
    if (style.indexOf('!important') > -1) {
        element.style.backgroundColor = removeImportant(style);
    }

    style = element.style.background;
    if (style.indexOf('!important') > -1) {
        element.style.background = removeImportant(style);
    }

    element.querySelectorAll('td, th').forEach(cell => {
        if (safeInstanceOf(cell, 'HTMLTableCellElement')) {
            highlightCellHandler(cell);
        }
    });
}

const removeImportant = (style: string) => style.substring(0, style.indexOf('!'));
