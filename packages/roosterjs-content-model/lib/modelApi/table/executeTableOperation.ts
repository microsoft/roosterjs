import { ContentModelBlockGroupType } from '../../publicTypes/enum/BlockGroupType';
import { ContentModelBlockType } from '../../publicTypes/enum/BlockType';
import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';
import { ContentModelTableCell } from '../../publicTypes/block/group/ContentModelTableCell';
import { ContentModelTableCellFormat } from '../../publicTypes/format/ContentModelTableCellFormat';
import { hasSelectionInBlock } from '../selection/hasSelectionInBlock';
import { TableOperation } from 'roosterjs-editor-types';

const TextAlignValueMap: Partial<Record<TableOperation, 'start' | 'center' | 'end'>> = {
    [TableOperation.AlignCellLeft]: 'start',
    [TableOperation.AlignCellCenter]: 'center',
    [TableOperation.AlignCellRight]: 'end',
};

const VerticalAlignValueMap: Partial<Record<TableOperation, 'top' | 'middle' | 'bottom'>> = {
    [TableOperation.AlignCellTop]: 'top',
    [TableOperation.AlignCellMiddle]: 'middle',
    [TableOperation.AlignCellBottom]: 'bottom',
};

/**
 * @internal
 * Edit table with given operation.
 * @param table The table Content Model to edit
 * @param operation Table operation
 */
export function executeTableOperation(table: ContentModelTable, operation: TableOperation) {
    const [firstRow, lastRow, firstColumn, lastColumn] = getSelectedCells(table);

    if (firstRow >= 0 && firstColumn >= 0 && lastRow >= firstRow && lastColumn >= firstColumn) {
        switch (operation) {
            case TableOperation.InsertAbove:
                for (let i = firstRow; i <= lastRow; i++) {
                    table.cells.splice(firstRow, 0, table.cells[i].map(cloneCell));
                }
                break;
            case TableOperation.InsertBelow:
                for (let i = firstRow; i <= lastRow; i++) {
                    table.cells.splice(firstRow, lastRow + 1, table.cells[lastRow].map(cloneCell));
                }
                break;

            case TableOperation.InsertLeft:
                for (let i = firstColumn; i <= lastColumn; i++) {
                    for (let rowIndex = 0; rowIndex < table.cells.length; rowIndex++) {
                        table.cells[rowIndex].splice(
                            firstColumn,
                            0,
                            cloneCell(table.cells[rowIndex][i])
                        );
                    }
                }
                break;
            case TableOperation.InsertRight:
                for (let i = firstColumn; i <= lastColumn; i++) {
                    for (let rowIndex = 0; rowIndex < table.cells.length; rowIndex++) {
                        table.cells[rowIndex].splice(
                            lastColumn + 1,
                            0,
                            cloneCell(table.cells[rowIndex][lastColumn])
                        );
                    }
                }
                break;

            case TableOperation.DeleteRow:
                table.cells[lastRow + 1]?.forEach(cell => (cell.spanAbove = false));
                table.cells.splice(firstRow, lastRow - firstRow + 1);
                break;

            case TableOperation.DeleteColumn:
                for (let rowIndex = 0; rowIndex < table.cells.length; rowIndex++) {
                    const nextCell = table.cells[rowIndex][lastColumn + 1];
                    if (nextCell) {
                        nextCell.spanLeft = false;
                    }

                    table.cells[rowIndex].splice(firstColumn, lastColumn - firstColumn + 1);
                }
                break;
            case TableOperation.DeleteTable:
                table.cells = [];
                break;

            case TableOperation.MergeAbove:
            case TableOperation.MergeBelow:
                const mergingRowIndex =
                    operation == TableOperation.MergeAbove ? firstRow : lastRow + 1;

                if (mergingRowIndex > 0 && mergingRowIndex < table.cells.length) {
                    for (let colIndex = firstColumn; colIndex <= lastColumn; colIndex++) {
                        table.cells[mergingRowIndex][colIndex].spanAbove = true;
                    }
                }
                break;

            case TableOperation.MergeLeft:
            case TableOperation.MergeRight:
                const mergingColIndex =
                    operation == TableOperation.MergeLeft ? firstColumn : lastColumn + 1;

                if (mergingColIndex > 0 && mergingColIndex < table.cells[0].length) {
                    for (let rowIndex = firstRow; rowIndex <= lastRow; rowIndex++) {
                        const cell = table.cells[rowIndex]?.[mergingColIndex];

                        if (cell) {
                            cell.spanLeft = true;
                        }
                    }
                }
                break;

            case TableOperation.MergeCells:
                for (let rowIndex = firstRow; rowIndex <= lastRow; rowIndex++) {
                    for (let colIndex = firstColumn; colIndex <= lastColumn; colIndex++) {
                        const cell = table.cells[rowIndex][colIndex];

                        if (cell) {
                            cell.spanLeft = colIndex > firstColumn;
                            cell.spanAbove = rowIndex > firstRow;
                        }
                    }
                }
                break;

            case TableOperation.SplitVertically:
                for (let rowIndex = lastRow; rowIndex >= firstRow; rowIndex--) {
                    const row = table.cells[rowIndex];
                    const newRow = row.map((cell, colIndex) => {
                        const newCell = cloneCell(cell);

                        if (colIndex < firstColumn || colIndex > lastColumn) {
                            newCell.spanAbove = true;
                            newCell.format.height = 0;
                        } else {
                            cell.format.height! /= 2;
                            newCell.format.height! /= 2;
                        }

                        return newCell;
                    });

                    table.cells.splice(rowIndex + 1, 0, newRow);
                }
                break;

            case TableOperation.SplitHorizontally:
                for (let colIndex = lastColumn; colIndex >= firstColumn; colIndex--) {
                    table.cells.forEach((row, rowIndex) => {
                        const cell = row[colIndex];
                        if (cell) {
                            const newCell = cloneCell(cell);

                            if (rowIndex < firstRow || rowIndex > lastRow) {
                                newCell.spanLeft = true;
                                newCell.format.width = 0;
                            } else {
                                cell.format.width! /= 2;
                                newCell.format.width! /= 2;
                            }
                            row.splice(colIndex + 1, 0, newCell);
                        }
                    });
                }
                break;
            case TableOperation.AlignCenter:
            case TableOperation.AlignLeft:
            case TableOperation.AlignRight:
                table.format.marginLeft = operation == TableOperation.AlignLeft ? '' : 'auto';
                table.format.marginRight = operation == TableOperation.AlignRight ? '' : 'auto';
                break;
            case TableOperation.AlignCellCenter:
            case TableOperation.AlignCellLeft:
            case TableOperation.AlignCellRight:
            case TableOperation.AlignCellTop:
            case TableOperation.AlignCellMiddle:
            case TableOperation.AlignCellBottom:
                const textAlign = TextAlignValueMap[operation];
                const verticalAlign = VerticalAlignValueMap[operation];

                for (let rowIndex = firstRow; rowIndex <= lastRow; rowIndex++) {
                    for (let colIndex = firstColumn; colIndex <= lastColumn; colIndex++) {
                        const format = table.cells[rowIndex]?.[colIndex]?.format;

                        if (format) {
                            format.textAlign = textAlign || format.textAlign;
                            format.verticalAlign = verticalAlign || format.verticalAlign;
                        }
                    }
                }
                break;
        }
    }
}

function getSelectedCells(table: ContentModelTable): [number, number, number, number] {
    let firstRow = -1;
    let firstColumn = -1;
    let lastRow = -1;
    let lastColumn = -1;

    table.cells.forEach((row, rowIndex) =>
        row.forEach((cell, colIndex) => {
            if (hasSelectionInBlock(cell)) {
                if (firstRow < 0) {
                    firstRow = rowIndex;
                }

                if (firstColumn < 0) {
                    firstColumn = colIndex;
                }

                lastRow = Math.max(lastRow, rowIndex);
                lastColumn = Math.max(lastColumn, colIndex);
            }
        })
    );

    return [firstRow, lastRow, firstColumn, lastColumn];
}

function cloneCell(cell: ContentModelTableCell): ContentModelTableCell {
    const newCell: ContentModelTableCell = {
        blockType: ContentModelBlockType.BlockGroup,
        blockGroupType: ContentModelBlockGroupType.TableCell,
        blocks: [],
        spanLeft: cell.spanLeft,
        spanAbove: cell.spanAbove,
        isHeader: false,
        format: cloneFormat(cell.format),
    };

    return newCell;
}

function cloneFormat(format: ContentModelTableCellFormat): ContentModelTableCellFormat {
    return {
        ...format,
        borderColor: format.borderColor ? [...format.borderColor] : undefined,
        borderWidth: format.borderWidth ? [...format.borderWidth] : undefined,
        borderStyle: format.borderStyle ? [...format.borderStyle] : undefined,
        metadata: format.metadata ? { ...format.metadata } : undefined,
    };
}
