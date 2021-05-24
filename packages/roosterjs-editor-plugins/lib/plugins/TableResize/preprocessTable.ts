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

export function setHTMLElementSizeInPx(element: HTMLElement, dimension: Dimension) {
    if (!!element) {
        if (dimension === Dimension.WIDTH || dimension === Dimension.BOTH) {
            element.removeAttribute('width');
            element.removeAttribute('height');
            const unit = element.style?.width?.substr(element.style.width.length - 2);
            if (!unit || unit !== 'px' /*&& unit !== 'pt'*/) {
                const rect = normalizeRect(element.getBoundingClientRect());
                element.style.boxSizing = 'border-box';
                element.style.width = `${rect.right - rect.left}px`;
            }
        }

        if (dimension === Dimension.HEIGHT || dimension === Dimension.BOTH) {
            const unit2 = element.style?.height?.substr(element.style.height.length - 2);
            if (!unit2 || unit2 !== 'px' /*&& unit2 !== 'pt' */) {
                const rect = normalizeRect(element.getBoundingClientRect());
                element.style.boxSizing = 'border-box';
                element.style.height = `${rect.bottom - rect.top}px`;
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

export function setTableCells(table: HTMLTableElement, dimension: Dimension) {
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
            setHTMLElementSizeInPx(cell, dimension);
        }
    }
}

export default function preProcessTable(
    table: HTMLTableElement,
    resizeState: ResizeState,
    byAddingNewColumn: boolean = false
) {
    if (resizeState === ResizeState.Both) {
        setHTMLElementSizeInPx(table, Dimension.BOTH); // Need to set table width/height since the new width/height depend on them
        setTableCells(table, Dimension.BOTH); // Make sure every cell has both 'width' and 'height' instead of null in order to be resized properly
    } else if (resizeState === ResizeState.Horizontal) {
        setHTMLElementSizeInPx(table, Dimension.WIDTH); // we should not chnage table width when resizing table height
        // unlock table height by removing height properties
        table.removeAttribute('height');
        table.style.height = null;
    } else if (resizeState === ResizeState.Vertical) {
        setTableCells(table, Dimension.WIDTH); // Make sure every cell has 'width' instead of null in order to be resized properly
        /*
        Since dragging the last border would cause table width to change, we need to remove width properties
        if it is not dragging the last border, we should set table width to make sure the table width won't be changed during resizing
        */
        if (!byAddingNewColumn) {
            setHTMLElementSizeInPx(table, Dimension.WIDTH);
        } else {
            table.removeAttribute('width');
            table.style.width = null;
        }
    }
}
