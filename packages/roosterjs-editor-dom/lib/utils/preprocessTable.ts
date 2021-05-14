import normalizeRect from './normalizeRect';

/**
 * Preprocess the HTML content of the table so that we can resize it properly:
 *     1. Remove useless width/height HTML attributes (presentational attributes) as they will be overriden by css properties
 *     2. Convert pt to px if there is any
 *     3. If unit used is neither px nor pt, or, no unit specified, caculate it based on bounding rectangle
 */

const Pt2PxCoefficient = 1.333;

export default function preProcessTable(table: HTMLTableElement) {
    if (table.hasAttribute('width')) {
        table.removeAttribute('width');
    }
    if (table.hasAttribute('height')) {
        table.removeAttribute('height');
    }

    for (let i = 0, row; (row = table.rows[i]); i++) {
        if (row.hasAttribute('width')) {
            row.removeAttribute('width');
        }
        if (row.hasAttribute('height')) {
            row.removeAttribute('height');
        }
        row.style.height = null;
        for (let j = 0, cell; (cell = row.cells[j]); j++) {
            if (cell.hasAttribute('height')) {
                cell.removeAttribute('height');
            }
            if (cell.hasAttribute('width')) {
                cell.removeAttribute('width');
            }

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
