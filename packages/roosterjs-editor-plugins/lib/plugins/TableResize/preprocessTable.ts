export const enum ResizeState {
    None,
    Horizontal,
    Vertical,
    Both, // when resizing the whole table
}

export function setHTMLElementSizeInPx(element: HTMLElement, storeOnly: boolean) {
    if (!!element) {
        const rect = element.getBoundingClientRect();
        if (!storeOnly) {
            element.removeAttribute('width');
            element.removeAttribute('height');
            element.style.boxSizing = 'border-box';
            element.style.width = `${rect.width}px`;
            element.style.height = `${rect.height}px`;
        } else {
            element.setAttribute('newWidth', `${rect.width}px`);
            element.setAttribute('newHeight', `${rect.height}px`);
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

export function setTableCells(table: HTMLTableElement) {
    // measure and store the width/height into attribute
    for (let i = 0, row; (row = table.rows[i]); i++) {
        for (let j = 0, cell; (cell = row.cells[j]); j++) {
            setHTMLElementSizeInPx(cell, true);
        }
    }

    // set width/height for each cell
    for (let i = 0, row; (row = table.rows[i]); i++) {
        row.removeAttribute('width');
        row.style.width = null;
        row.removeAttribute('height');
        row.style.height = null;

        for (let j = 0, cell; (cell = row.cells[j]); j++) {
            cell.removeAttribute('width');
            cell.removeAttribute('height');
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

export default function preProcessTable(table: HTMLTableElement) {
    const isProcessed = table.getAttribute('isProcessed');
    if (!isProcessed) {
        setTableCells(table);
        setHTMLElementSizeInPx(table, false); // Make sure table width/height is fixed to avoid shifting effect
        table.setAttribute('isProcessed', 'yes');
    }
}
