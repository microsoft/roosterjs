import {
    createTableCell,
    createTableRow,
    trimModelForSelection,
} from 'roosterjs-content-model-dom';
import type {
    ContentModelBlock,
    ContentModelTable,
    ContentModelTableCellFormat,
    IEditor,
    ReadonlyContentModelTable,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function getSelectedContentForTable(editor: IEditor): ContentModelBlock[][] {
    const selectedRows: ContentModelBlock[][] = [];
    const selection = editor.getDOMSelection();
    if (selection && (selection?.type !== 'range' || !selection.range.collapsed)) {
        const selectedModel = editor.getContentModelCopy('disconnected');
        trimModelForSelection(selectedModel, selection);

        for (const block of selectedModel.blocks) {
            if (block.blockType === 'Table') {
                extractTableCellsContent(block, selectedRows);
            } else {
                selectedRows.push([block as ContentModelBlock]);
            }
        }
    }

    return selectedRows;
}

function extractTableCellsContent(
    table: ReadonlyContentModelTable,
    selectedRows: ContentModelBlock[][]
) {
    for (const row of table.rows) {
        const rowBlocks: ContentModelBlock[] = [];
        for (const cell of row.cells) {
            if (!cell.spanLeft && !cell.spanAbove) {
                rowBlocks.push(...(cell.blocks as ContentModelBlock[]));
            }
        }
        if (rowBlocks.length > 0) {
            selectedRows.push(rowBlocks);
        }
    }
}

/**
 * @internal
 */
export function insertTableContent(
    table: ContentModelTable,
    contentRows: ContentModelBlock[][],
    colNumber: number,
    customCellFormat?: ContentModelTableCellFormat
) {
    let rowIndex = 0;
    for (const rowBlocks of contentRows) {
        if (!table.rows[rowIndex]) {
            const row = createTableRow();
            for (let i = 0; i < colNumber; i++) {
                const cell = createTableCell(
                    undefined /*spanLeftOrColSpan */,
                    undefined /*spanAboveOrRowSpan */,
                    undefined /* isHeader */,
                    customCellFormat
                );
                row.cells.push(cell);
            }
            table.rows.push(row);
        }

        let cellIndex = 0;
        for (const block of rowBlocks) {
            if (cellIndex < table.rows[rowIndex].cells.length) {
                table.rows[rowIndex].cells[cellIndex].blocks = [block];
            }
            cellIndex++;
        }
        rowIndex++;
    }
}
