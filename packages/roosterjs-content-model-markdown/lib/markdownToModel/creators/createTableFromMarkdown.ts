import { createParagraphFromMarkdown } from './createParagraphFromMarkdown';
import type { ContentModelTable } from 'roosterjs-content-model-types';
import {
    applyTableFormat,
    createTable,
    createTableCell,
    createTableRow,
} from 'roosterjs-content-model-dom';
import type { MarkdownToModelOptions } from '../types/MarkdownToModelOptions';

/**
 * @internal
 */
export function createTableFromMarkdown(
    tableLines: string[],
    options: MarkdownToModelOptions
): ContentModelTable {
    const tableDivider = tableLines[1].split('|').filter(content => content.trim() !== '');
    tableLines.splice(1, 1);
    const table = createTable(
        0,
        options.direction
            ? { borderCollapse: true, direction: options.direction }
            : { borderCollapse: true }
    );

    for (const line of tableLines) {
        createTableModel(line, table, tableDivider, options);
    }
    applyTableFormat(table, {
        hasHeaderRow: true,
    });
    return table;
}

function createTableModel(
    markdown: string,
    table: ContentModelTable,
    tableDivider: string[],
    options: MarkdownToModelOptions
) {
    const contents = markdown.split('|');
    if (contents[0].trim() === '') {
        contents.shift();
    }
    if (contents[contents.length - 1].trim() === '') {
        contents.pop();
    }

    addTableRow(table, contents, tableDivider, options);
}

function addTableRow(
    table: ContentModelTable,
    contents: string[],
    tableDivider: string[],
    options: MarkdownToModelOptions
) {
    const row = createTableRow(options.direction ? { direction: options.direction } : undefined);

    let index = 0;
    for (const content of contents) {
        const paragraph = createParagraphFromMarkdown(content, options);
        const cell = createTableCell(
            undefined /* spanLeftOrColSpan */,
            undefined /* spanAboveOrRowSpan */,
            undefined /* isHeader */,
            options.direction ? { direction: options.direction } : undefined
        );

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
