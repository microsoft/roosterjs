import { createParagraphFromMarkdown } from './createParagraphFromMarkdown';
import type { ContentModelTable } from 'roosterjs-content-model-types';
import {
    applyTableFormat,
    createTable,
    createTableCell,
    createTableRow,
} from 'roosterjs-content-model-dom';

/**
 * @internal
 */
export function createTableFromMarkdown(tableLines: string[]): ContentModelTable {
    const tableDivider = tableLines[1].split('|').filter(content => content.trim() !== '');
    tableLines.splice(1, 1);
    const table = createTable(0, { borderCollapse: true });
    for (const line of tableLines) {
        createTableModel(line, table, tableDivider);
    }
    applyTableFormat(table, {
        hasHeaderRow: true,
    });
    return table;
}

function createTableModel(markdown: string, table: ContentModelTable, tableDivider: string[]) {
    const contents = markdown.split('|');
    if (contents[0].trim() === '') {
        contents.shift();
    }
    if (contents[contents.length - 1].trim() === '') {
        contents.pop();
    }

    addTableRow(table, contents, tableDivider);
}

function addTableRow(table: ContentModelTable, contents: string[], tableDivider: string[]) {
    const row = createTableRow();
    let index = 0;
    for (const content of contents) {
        const paragraph = createParagraphFromMarkdown(content);
        const cell = createTableCell();
        cell.blocks.push(paragraph);
        if (tableDivider[index]) {
            cell.format.textAlign = getCellAlignment(tableDivider[index]);
        }
        row.cells.push(cell);
        index++;
    }
    table.rows.push(row);
}

function getCellAlignment(content: string) {
    if (content.startsWith(':') && content.endsWith(':')) {
        return 'center';
    }
    if (content.endsWith(':')) {
        return 'end';
    }
    return 'start';
}
