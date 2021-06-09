import { normalizeRect } from 'roosterjs-editor-dom';

export const enum Dimension {
    HEIGHT,
    WIDTH,
    BOTH,
}

export const enum ResizeState {
    None,
    Horizontal,
    Vertical,
    Both, // when resizing the whole table
}

function setHTMLElementSizeInPx(element: HTMLElement, dimension: Dimension, storeOnly: boolean) {
    if (!!element) {
        if (dimension === Dimension.WIDTH || dimension === Dimension.BOTH) {
            const rect = normalizeRect(element.getBoundingClientRect());
            if (!storeOnly) {
                element.removeAttribute('width');
                element.style.boxSizing = 'border-box';
                element.style.width = `${rect.right - rect.left}px`;
            } else {
                element.setAttribute('newWidth', `${rect.right - rect.left}px`);
            }
        }

        if (dimension === Dimension.HEIGHT || dimension === Dimension.BOTH) {
            const rect = normalizeRect(element.getBoundingClientRect());
            if (!storeOnly) {
                element.removeAttribute('height');
                element.style.boxSizing = 'border-box';
                element.style.height = `${rect.bottom - rect.top}px`;
            } else {
                element.setAttribute('newHeight', `${rect.bottom - rect.top}px`);
            }
        }
    }
}

export function setEmptyTableCells(table: HTMLTableElement) {
    for (let i = 0, row; (row = table.rows[i]); i++) {
        for (let j = 0, cell; (cell = row.cells[j]); j++) {
            if (!cell.innerHTML) {
                cell.appendChild(document.createElement('br'));
            }
        }
    }
}

function setTableCells(table: HTMLTableElement, dimension: Dimension) {
    // measure and store the width/height into attribute
    for (let i = 0, row; (row = table.rows[i]); i++) {
        for (let j = 0, cell; (cell = row.cells[j]); j++) {
            setHTMLElementSizeInPx(cell, dimension, true);
        }
    }

    // set width/height for each cell
    for (let i = 0, row; (row = table.rows[i]); i++) {
        if (dimension === Dimension.BOTH || dimension === Dimension.WIDTH) {
            row.removeAttribute('width');
            row.style.width = null;
        }
        if (dimension === Dimension.BOTH || dimension === Dimension.HEIGHT) {
            row.removeAttribute('height');
            row.style.height = null;
        }
        for (let j = 0, cell; (cell = row.cells[j]); j++) {
            if (dimension === Dimension.BOTH || dimension === Dimension.WIDTH) {
                cell.removeAttribute('width');
            }
            if (dimension === Dimension.BOTH || dimension === Dimension.HEIGHT) {
                cell.removeAttribute('height');
            }

            cell.style.boxSizing = 'border-box';
            const newWidth = cell.getAttribute('newWidth');
            const newHeight = cell.getAttribute('newHeight');
            if (newWidth) {
                cell.style.width = newWidth;
                cell.removeAttribute('newWidth');
            }

            if (newHeight) {
                cell.style.height = newHeight;
                cell.removeAttribute('newHeight');
            }
        }
    }
}

export default function preProcessTable(
    table: HTMLTableElement,
    resizeState: ResizeState,
    byAddingNewColumn: boolean = false
) {
    if (resizeState === ResizeState.Both) {
        setTableCells(table, Dimension.BOTH); // Make sure every cell has both 'width' and 'height' instead of null in order to be resized properly
    } else if (resizeState === ResizeState.Horizontal) {
        setHTMLElementSizeInPx(table, Dimension.WIDTH, false); // we should not change table width when resizing table height
        // unlock table height by removing height properties
        table.removeAttribute('height');
        table.style.height = null;
    } else if (resizeState === ResizeState.Vertical) {
        setHTMLElementSizeInPx(table, Dimension.BOTH, false); // Make sure table width/height is fixed to avoid shifting effect
        setTableCells(table, Dimension.WIDTH); // Make sure every cell has 'width' instead of null in order to be resized properly
        /*
        Since dragging the last border would cause table width to change, we need to remove width properties
        if it is not dragging the last border, we should set table width to make sure the table width won't be changed during resizing
        */
        if (byAddingNewColumn) {
            table.removeAttribute('width');
            table.style.width = null;
        }
    }
}
