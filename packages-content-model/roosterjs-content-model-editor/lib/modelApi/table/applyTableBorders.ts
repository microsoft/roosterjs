import { extractBorderValues } from '../../domUtils/borderValues';
import { getSelectedCells } from './getSelectedCells';
import { parseValueWithUnit } from 'roosterjs-content-model-dom';
import { TableOperation } from 'roosterjs-editor-types';
import { updateTableCellMetadata } from '../../domUtils/metadata/updateTableCellMetadata';
import type { ContentModelTable } from 'roosterjs-content-model-types';
import type { Border } from 'roosterjs-editor-types';

/**
 * @internal
 * UNFINISHED - only All Borders is implemented
 */
export default function applyBorderFormat(
    table: ContentModelTable,
    border: Border | null,
    operation: TableOperation.Border
) {
    const sel = getSelectedCells(table);
    let borderFormat = '';
    if (border) {
        const format = table.format;
        const { width, style, color } = border;
        const borderKey = 'borderTop';
        const extractedBorder = extractBorderValues(format[borderKey]);
        const borderColor = extractedBorder.color;
        const borderWidth = extractedBorder.width;
        const borderStyle = extractedBorder.style;

        if (width) {
            borderFormat = parseValueWithUnit(width) + 'px';
        } else if (borderWidth) {
            borderFormat = borderWidth;
        } else {
            borderFormat = '1px';
        }

        if (style) {
            borderFormat = `${borderFormat} ${style}`;
        } else if (borderStyle) {
            borderFormat = `${borderFormat} ${borderStyle}`;
        } else {
            borderFormat = `${borderFormat} solid`;
        }

        if (color) {
            borderFormat = `${borderFormat} ${color}`;
        } else if (borderColor) {
            borderFormat = `${borderFormat} ${borderColor}`;
        }
    } else {
        delete table.format.borderLeft;
        delete table.format.borderTop;
        delete table.format.borderBottom;
        delete table.format.borderRight;
    }

    if (sel && operation) {
        switch (operation) {
            case TableOperation.Border:
                for (let rowIndex = sel.firstRow; rowIndex <= sel.lastRow; rowIndex++) {
                    for (let colIndex = sel.firstCol; colIndex <= sel.lastCol; colIndex++) {
                        const cell = table.rows[rowIndex].cells[colIndex];

                        if (cell) {
                            //
                            cell.format.borderRight = borderFormat;
                            cell.format.borderLeft = borderFormat;
                            cell.format.borderTop = borderFormat;
                            cell.format.borderBottom = borderFormat;
                            //
                            updateTableCellMetadata(cell, metadata => {
                                metadata = metadata || {};
                                metadata.borderOverride = true;
                                return metadata;
                            });
                        }
                    }
                }
        }
    }
}
