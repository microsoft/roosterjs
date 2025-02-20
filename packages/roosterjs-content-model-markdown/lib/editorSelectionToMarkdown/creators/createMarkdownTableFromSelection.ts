import { isNodeOfType } from 'roosterjs-content-model-dom';
import type { TableSelection } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function createMarkdownTableFromSelection(tableSelection: TableSelection): string {
    let content = '';
    const { table, firstColumn, firstRow, lastRow, lastColumn } = tableSelection;
    for (let i = firstRow; i <= lastRow; i++) {
        const row = table.rows[i];
        for (let j = firstColumn; j <= lastColumn; j++) {
            const cell = row.cells[j];
            if (cell) {
                content += `| ${cell.textContent} `;
            }
        }
        if (i == firstRow) {
            content += '|\n';
            for (let j = firstColumn; j <= lastColumn; j++) {
                if (row.cells[j]) {
                    content += getCellAlignment(row.cells[j]);
                }
            }
        }
        content += '|\n';
    }

    return content;
}

function getCellAlignment(cell: HTMLTableCellElement): string {
    const text = cell.firstElementChild;
    if (text && isNodeOfType(text, 'ELEMENT_NODE')) {
        const style = text.style.textAlign;
        switch (style) {
            case 'center':
                return '|:----:';
            case 'end':
                return '|----:';
            default:
                return '|----';
        }
    }
    return '|----';
}
