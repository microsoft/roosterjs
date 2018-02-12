import execFormatWithUndo from '../format/execFormatWithUndo';
import getNodeAtCursor from '../cursor/getNodeAtCursor';
import { Editor } from 'roosterjs-editor-core';
import { TableOperation } from 'roosterjs-editor-types';
import { VTable } from 'roosterjs-editor-dom';

/**
 * Edit table with given operation. If there is no table at cursor then no op.
 * @param editor The editor instance
 * @param operation Table operation
 */
export default function editTable(editor: Editor, operation: TableOperation) {
    let td = getNodeAtCursor(editor, 'TD') as HTMLTableCellElement;
    if (td) {
        execFormatWithUndo(
            editor,
            () => {
                let vtable = new VTable(td);
                let currentRow = vtable.cells[vtable.row];
                let currentCell = currentRow[vtable.col];
                switch (operation) {
                    case TableOperation.InsertAbove:
                    case TableOperation.InsertBelow:
                        let newRow = vtable.row + (operation == TableOperation.InsertAbove ? 0 : 1);
                        vtable.cells.splice(
                            newRow,
                            0,
                            currentRow.map(cell => VTable.cloneCell(cell))
                        );
                        break;

                    case TableOperation.InsertLeft:
                    case TableOperation.InsertRight:
                        let newCol = vtable.col + (operation == TableOperation.InsertLeft ? 0 : 1);
                        vtable.forEachCellOfCurrentColumn((cell, row) => {
                            row.splice(newCol, 0, VTable.cloneCell(cell));
                        });
                        break;

                    case TableOperation.DeleteRow:
                        vtable.forEachCellOfCurrentRow((cell, i) => {
                            let nextCell = vtable.getCell(vtable.row + 1, i);
                            if (cell.td && cell.td.rowSpan > 1 && nextCell.spanAbove) {
                                nextCell.td = cell.td;
                            }
                        });
                        vtable.cells.splice(vtable.row, 1);
                        break;

                    case TableOperation.DeleteColumn:
                        vtable.forEachCellOfCurrentColumn((cell, row, i) => {
                            let nextCell = vtable.getCell(i, vtable.col);
                            if (cell.td && cell.td.colSpan > 1 && nextCell.spanLeft) {
                                nextCell.td = cell.td;
                            }
                            row.splice(vtable.col, 1);
                        });
                        break;

                    case TableOperation.MergeAbove:
                    case TableOperation.MergeBelow:
                        let rowStep = operation == TableOperation.MergeAbove ? -1 : 1;
                        for (
                            let rowIndex = vtable.row + rowStep;
                            rowIndex >= 0 && rowIndex < vtable.cells.length;
                            rowIndex += rowStep
                        ) {
                            let cell = vtable.getCell(rowIndex, vtable.col);
                            if (cell.td && !cell.spanAbove) {
                                let aboveCell = rowIndex < vtable.row ? cell : currentCell;
                                let belowCell = rowIndex < vtable.row ? currentCell : cell;
                                if (aboveCell.td.colSpan == belowCell.td.colSpan) {
                                    VTable.moveChildren(belowCell.td, aboveCell.td);
                                    belowCell.td = null;
                                    belowCell.spanAbove = true;
                                }
                                break;
                            }
                        }
                        break;

                    case TableOperation.MergeLeft:
                    case TableOperation.MergeRight:
                        let colStep = operation == TableOperation.MergeLeft ? -1 : 1;
                        for (
                            let colIndex = vtable.col + colStep;
                            colIndex >= 0 && colIndex < vtable.cells[vtable.row].length;
                            colIndex += colStep
                        ) {
                            let cell = vtable.getCell(vtable.row, colIndex);
                            if (cell.td && !cell.spanLeft) {
                                let leftCell = colIndex < vtable.col ? cell : currentCell;
                                let rightCell = colIndex < vtable.col ? currentCell : cell;
                                if (leftCell.td.rowSpan == rightCell.td.rowSpan) {
                                    VTable.moveChildren(rightCell.td, leftCell.td);
                                    rightCell.td = null;
                                    rightCell.spanLeft = true;
                                }
                                break;
                            }
                        }
                        break;

                    case TableOperation.DeleteTable:
                        vtable.cells = null;
                        break;

                    case TableOperation.SplitVertically:
                        if (currentCell.td.rowSpan > 1) {
                            vtable.getCell(vtable.row + 1, vtable.col).td = VTable.cloneNode(
                                currentCell.td
                            );
                        } else {
                            let splitRow = currentRow.map(cell => {
                                return {
                                    td: cell == currentCell ? VTable.cloneNode(cell.td) : null,
                                    spanAbove: cell != currentCell,
                                    spanLeft: cell.spanLeft,
                                };
                            });
                            vtable.cells.splice(vtable.row + 1, 0, splitRow);
                        }
                        break;

                    case TableOperation.SplitHorizontally:
                        if (currentCell.td.colSpan > 1) {
                            vtable.getCell(vtable.row, vtable.col + 1).td = VTable.cloneNode(
                                currentCell.td
                            );
                        } else {
                            vtable.forEachCellOfCurrentColumn((cell, row) => {
                                row.splice(vtable.col + 1, 0, {
                                    td: row == currentRow ? VTable.cloneNode(cell.td) : null,
                                    spanAbove: cell.spanAbove,
                                    spanLeft: row != currentRow,
                                });
                            });
                        }
                        break;
                }
                vtable.writeBack();
                td = editor.contains(td) ? td : vtable.getCurrentTd();
                editor.focus();
                return td;
            },
            true /*preserveSelection*/
        );
    }
}
