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
export function createTableFromMarkdown(
    markdown: string,
    table?: ContentModelTable
): ContentModelTable {
    const contents = markdown.split('|').filter(content => content.trim() !== '');
    const tableModel = table || createTable(0, { borderCollapse: true });
    const shouldAddHeader =
        tableModel.rows.length === 1 && contents.every(content => isHeaderRow(content));
    if (!shouldAddHeader) {
        addTableRow(tableModel, contents);
    }
    applyTableFormat(tableModel, { hasHeaderRow: true });
    return tableModel;
}

function addTableRow(table: ContentModelTable, contents: string[]) {
    const row = createTableRow();
    for (const content of contents) {
        const paragraph = createParagraphFromMarkdown(content);
        const cell = createTableCell();
        cell.blocks.push(paragraph);
        row.cells.push(cell);
    }
    table.rows.push(row);
}

function isHeaderRow(content: string) {
    const pattern = /^-+$/;
    return pattern.test(content);
}
