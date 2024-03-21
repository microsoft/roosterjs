import { createRange } from 'roosterjs-editor-dom';
import { parseTableCells } from 'roosterjs-content-model-dom';
import { SelectionRangeTypes } from 'roosterjs-editor-types';
import type { DOMSelection, TableSelection } from 'roosterjs-content-model-types';
import type { SelectionRangeEx } from 'roosterjs-editor-types';

// In theory, all functions below are not necessary. We keep these functions here only for compatibility with old IEditor interface

/**
 * @internal
 */
export function convertRangeExToDomSelection(
    rangeEx: SelectionRangeEx | null
): DOMSelection | null {
    switch (rangeEx?.type) {
        case SelectionRangeTypes.ImageSelection:
            return {
                type: 'image',
                image: rangeEx.image,
            };

        case SelectionRangeTypes.Normal:
            return rangeEx.ranges.length > 0
                ? {
                      type: 'range',
                      range: rangeEx.ranges[0],
                      isReverted: false,
                  }
                : null;

        case SelectionRangeTypes.TableSelection:
            return rangeEx.coordinates
                ? {
                      type: 'table',
                      table: rangeEx.table,
                      firstColumn: rangeEx.coordinates.firstCell.x,
                      firstRow: rangeEx.coordinates.firstCell.y,
                      lastColumn: rangeEx.coordinates.lastCell.x,
                      lastRow: rangeEx.coordinates.lastCell.y,
                  }
                : null;

        default:
            return null;
    }
}

/**
 * @internal
 */
export function convertDomSelectionToRangeEx(selection: DOMSelection | null): SelectionRangeEx {
    switch (selection?.type) {
        case 'image':
            return {
                type: SelectionRangeTypes.ImageSelection,
                image: selection.image,
                areAllCollapsed: false,
                ranges: [createRange(selection.image)],
            };

        case 'range':
            return {
                type: SelectionRangeTypes.Normal,
                ranges: [selection.range],
                areAllCollapsed: selection.range.collapsed,
            };

        case 'table':
            return {
                type: SelectionRangeTypes.TableSelection,
                ranges: createTableRanges(selection),
                areAllCollapsed: false,
                table: selection.table,
                coordinates: {
                    firstCell: { x: selection.firstColumn, y: selection.firstRow },
                    lastCell: { x: selection.lastColumn, y: selection.lastRow },
                },
            };

        default:
            return {
                type: SelectionRangeTypes.Normal,
                ranges: [],
                areAllCollapsed: true,
            };
    }
}

/**
 * @internal
 * Create ranges from a table selection
 * @param selection The source table selection
 * @returns An array of DOM ranges of selected table cells
 */
export function createTableRanges(selection: TableSelection): Range[] {
    const result: Range[] = [];
    const { table, firstColumn, firstRow, lastColumn, lastRow } = selection;
    const cells = parseTableCells(table);

    for (let row = firstRow; row <= lastRow; row++) {
        for (let col = firstColumn; col <= lastColumn; col++) {
            const td = cells[row]?.[col];

            if (typeof td == 'object') {
                const range = table.ownerDocument.createRange();

                range.selectNode(td);
                result.push(range);
            }
        }
    }

    return result;
}
