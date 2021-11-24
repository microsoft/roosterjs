import findClosestElementAncestor from './findClosestElementAncestor';
import safeInstanceOf from './safeInstanceOf';
import VTable from '../table/VTable';
import { getHighlightColor, getOriginalColor } from './getTableOriginalColor';
import { TableMetadata } from '../table/tableMetadata';
import { VCell } from 'roosterjs-editor-types';

const TABLE_CELL_SELECTED_CLASS = TableMetadata.TABLE_CELL_SELECTED;
const TEMP_BACKGROUND_COLOR = TableMetadata.TEMP_BACKGROUND_COLOR;

/**
 * Remove the selected style of the cells
 * @param editor Editor Instance
 */
export function clearSelectedTableCells(container: Node, cacheSelection: boolean = false) {
    const tables = getSelectedTables(container);

    if (tables) {
        tables.forEach(element => {
            if (safeInstanceOf(element, 'HTMLTableElement')) {
                const vTable = new VTable(element);
                vTable.forEachCell(cell => {
                    if (cell.td) {
                        vTable.deselectCellHandler(cell.td, cacheSelection);
                    }
                });
            }
        });
    }
}

/**
 * Set the selected style to the selected cells
 * @param editor Editor Instance
 */
export function OnFocusTableSelection(container: Node) {
    if (container) {
        const tables = getSelectedTables(container);

        if (tables) {
            tables.forEach((element: Element) => {
                if (safeInstanceOf(element, 'HTMLTableElement')) {
                    const vTable = new VTable(element);
                    vTable.forEachCell((vCell: VCell) => {
                        const cell = vCell.td;
                        if (cell && safeInstanceOf(cell, 'HTMLTableCellElement')) {
                            vTable.highlightCellHandler(vCell.td, (element: HTMLElement) => {
                                if (element.dataset[TableMetadata.ON_FOCUS_CACHE]) {
                                    element.dataset[TEMP_BACKGROUND_COLOR] = getOriginalColor(
                                        element.style.backgroundColor
                                    );
                                    const highlighColor = getHighlightColor(
                                        element.style.backgroundColor ?? element.style.background
                                    );
                                    element.style.background = highlighColor;
                                    element.classList.add(TABLE_CELL_SELECTED_CLASS);
                                    delete element.dataset[TableMetadata.ON_FOCUS_CACHE];
                                }
                            });
                        }
                    });
                }
            });
        }
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
