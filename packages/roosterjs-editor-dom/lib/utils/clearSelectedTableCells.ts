import safeInstanceOf from './safeInstanceOf';
import VCell from 'roosterjs-editor-types/lib/interface/VCell';
import VTable from '../table/VTable';
import { findClosestElementAncestor } from '..';

const TABLE_CELL_SELECTED_CLASS = 'TableCellSelected';
const TEMP_BACKGROUND_COLOR = 'tempBackgroundColor';
const ON_FOCUS_CACHE = 'onFocusCache';
const SELECTION_COLOR_OPACITY = 0.7;
/**
 * Remove the selected style of the cells
 * @param editor Editor Instance
 */
export function clearSelectedTableCells(container: Node, shouldRemoveClass: boolean = true) {
    getSelectedTableCells(container).forEach((element: Element) => {
        if (safeInstanceOf(element, 'HTMLTableElement')) {
            const vTable = new VTable(element);
            vTable.forEachCell((vCell: VCell) => {
                const cell = vCell.td;

                if (
                    cell &&
                    safeInstanceOf(cell, 'HTMLTableCellElement') &&
                    cell.classList.contains(TABLE_CELL_SELECTED_CLASS)
                ) {
                    if (
                        shouldRemoveClass &&
                        cell.dataset[ON_FOCUS_CACHE] &&
                        cell.dataset[ON_FOCUS_CACHE] == 'true'
                    ) {
                        delete cell.dataset[ON_FOCUS_CACHE];
                        return;
                    }
                    if (shouldRemoveClass) {
                        cell.classList.remove(TABLE_CELL_SELECTED_CLASS);
                    } else {
                        cell.dataset[ON_FOCUS_CACHE] = 'true';
                    }
                    cell.style.backgroundColor = getOriginalColor(
                        cell.dataset[TEMP_BACKGROUND_COLOR]
                    );
                    delete cell.dataset[TEMP_BACKGROUND_COLOR];
                }
            });
        }
    });
}

/**
 * Set the selected style to the selected cells
 * @param editor Editor Instance
 */
export function setSelectedTableCells(container: Node) {
    if (container) {
        getSelectedTableCells(container).forEach((element: Element) => {
            if (safeInstanceOf(element, 'HTMLTableElement')) {
                const vTable = new VTable(element);
                vTable.forEachCell((vCell: VCell) => {
                    const cell = vCell.td;
                    if (
                        cell &&
                        safeInstanceOf(cell, 'HTMLTableCellElement') &&
                        cell.classList.contains(TABLE_CELL_SELECTED_CLASS)
                    ) {
                        const highlighColor = getHighlightColor(cell.style.backgroundColor);
                        cell.dataset[TEMP_BACKGROUND_COLOR] = getOriginalColor(
                            cell.style.backgroundColor
                        );
                        cell.style.backgroundColor = highlighColor;
                    }
                });
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
export function getSelectedTableCells(container: Node) {
    if (container && safeInstanceOf(container, 'HTMLElement')) {
        let result = container.querySelectorAll('table');
        if (result.length == 0) {
            let table = findClosestElementAncestor(container, null, 'table');
            if (table) {
                return [table];
            }
        }

        return result;
    }
}

/**
 * @internal
 * Retrieve the color to be applied when a cell is selected
 * @param colorString Color
 * @returns color to be applied when a cell is selected
 */
export function getHighlightColor(colorString: string) {
    if (colorString && (colorString.indexOf('rgba') > -1 || colorString.indexOf('rgb') > -1)) {
        const rgb = colorString
            .trim()
            .substring(colorString.indexOf('(') + 1, colorString.length - 1)
            .split(',');

        const red = parseInt(rgb[0]);
        const green = parseInt(rgb[1]);
        const blue = parseInt(rgb[2]);
        if (red && green && blue) {
            return `rgba(${red}, ${green}, ${blue}, ${SELECTION_COLOR_OPACITY})`;
        }
    }

    return `rgba(198,198,198, ${SELECTION_COLOR_OPACITY})`;
}

/**
 * @internal
 * Get the original color before the selection was made
 * @param colorString Color
 * @returns original color before the selection was made
 */
export function getOriginalColor(colorString: string) {
    const color = getColor(colorString);

    if (color) {
        return color;
    }

    return '';
}

function getColor(colorString: string, prefix: string = 'rgb') {
    if (colorString && (colorString.indexOf('rgba') > -1 || colorString.indexOf('rgb') > -1)) {
        const rgb = colorString
            .trim()
            .substring(colorString.indexOf('(') + 1, colorString.length - 1)
            .split(',');
        colorString = `${prefix}(${rgb[0]}, ${rgb[1]}, ${rgb[2]}${
            prefix == 'rgba' ? ', ' + SELECTION_COLOR_OPACITY : ''
        })`;
    }
    return colorString;
}
