import { createMarkdownBlock } from './createMarkdownBlock';
import type { ListCounter } from './createMarkdownBlockGroup';
import type { ContentModelTable, ContentModelTableRow } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function createMarkdownTable(table: ContentModelTable, listCounter: ListCounter): string {
    let markdownString = '';
    const { rows } = table;
    let firstRow = true;
    for (const row of rows) {
        markdownString += '|';
        for (const cell of row.cells) {
            for (const block of cell.blocks) {
                markdownString += createMarkdownBlock(block, listCounter);
            }
            markdownString += '|';
        }
        markdownString += '\n';
        if (firstRow) {
            markdownString += addTableDivider(row);
            firstRow = false;
        }
    }

    return markdownString;
}

function addTableDivider(headerRow: ContentModelTableRow) {
    let divider = '|';
    const { cells } = headerRow;
    for (const cell of cells) {
        switch (cell.format.textAlign) {
            case 'center':
                divider += ':----:|';
                break;
            case 'end':
                divider += '----:|';
                break;
            default:
                divider += '----|';
                break;
        }
    }
    return divider + '\n';
}
