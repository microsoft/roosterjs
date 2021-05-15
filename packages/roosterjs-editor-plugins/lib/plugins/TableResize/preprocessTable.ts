import { normalizeRect } from 'roosterjs-editor-dom';

/**
 * Preprocess the HTML content of the table so that we can resize it properly:
 *     1. Calculate and set table width. This is to ensure that table width is fixed when resizing individual column
 *     2. Remove useless width/height HTML attributes
 *     3. For each cell, convert pt to px if there is any.
 *        If unit used is neither px nor pt, or, no unit specified, caculate it based on bounding rectangle
 */

const Pt2PxCoefficient = 1.333;

function setHTMLElementWidthInPx(element: HTMLElement) {
    element.removeAttribute('width');
    const rect = normalizeRect(element.getBoundingClientRect());
    element.style.boxSizing = 'border-box';
    element.style.width = `${rect.right - rect.left}px`;
}

export default function preProcessTable(table: HTMLTableElement) {
    setHTMLElementWidthInPx(table);
    for (let i = 0, row; (row = table.rows[i]); i++) {
        row.removeAttribute('width');
        row.removeAttribute('height');
        row.style.height = null;
        for (let j = 0, cell; (cell = row.cells[j]); j++) {
            cell.removeAttribute('width');
            cell.removeAttribute('height');

            const unit = cell.style?.width?.substr(cell.style.width.length - 2);
            if (!unit || (unit !== 'px' && unit !== 'pt')) {
                const rect = normalizeRect(cell.getBoundingClientRect());
                cell.style.boxSizing = 'border-box';
                cell.style.width = `${rect.right - rect.left}px`;
            } else if (unit === 'pt') {
                const width = parseFloat(cell.style.width.substr(0, cell.style.width.length - 2));
                cell.style.width = `${width * Pt2PxCoefficient}px`;
            }
        }
    }
}
