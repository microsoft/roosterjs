import { applyTableFormat } from '../../modelApi/table/applyTableFormat';
import { extractBorderValues } from '../../domUtils/borderValues';
import { formatWithContentModel } from '../utils/formatWithContentModel';
import { getFirstSelectedTable } from '../../modelApi/selection/collectSelections';
import { getSelectedCells } from '../../modelApi/table/getSelectedCells';
import { hasMetadata, parseValueWithUnit } from 'roosterjs-content-model-dom';
import { updateTableCellMetadata } from '../../domUtils/metadata/updateTableCellMetadata';
import type { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import type { Border } from 'roosterjs-content-model';
import type { ContentModelTableCell } from 'roosterjs-content-model-types';

/**
 * All Border operations
 * @internal
 */
export const enum BorderOperations {
    AllBorders,
}

/**
 * UNFINISHED - only All Borders is implemented
 * @param editor The editor instance
 * @param border The border to apply
 * @param operation The operation to apply
 */
export default function applyTableBorderFormatOperation(
    editor: IContentModelEditor,
    border: Border,
    operation: BorderOperations
) {
    formatWithContentModel(editor, 'tableBorder', model => {
        const [tableModel] = getFirstSelectedTable(model);

        if (tableModel) {
            const sel = getSelectedCells(tableModel);
            const Perimeter = {
                Top: false,
                Bottom: false,
                Left: false,
                Right: false,
            };
            let borderFormat = '';
            if (border) {
                const format = tableModel.format;
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
                delete tableModel.format.borderLeft;
                delete tableModel.format.borderTop;
                delete tableModel.format.borderBottom;
                delete tableModel.format.borderRight;
            }

            if (sel) {
                switch (operation) {
                    case BorderOperations.AllBorders:
                        for (let rowIndex = sel.firstRow; rowIndex <= sel.lastRow; rowIndex++) {
                            for (let colIndex = sel.firstCol; colIndex <= sel.lastCol; colIndex++) {
                                const cell = tableModel.rows[rowIndex].cells[colIndex];
                                // Format cells - All borders
                                applyAllBorderFormat(cell, borderFormat);
                            }
                        }

                        // Format perimeter
                        Perimeter.Top = true;
                        Perimeter.Bottom = true;
                        Perimeter.Left = true;
                        Perimeter.Right = true;

                    default:
                        break;
                }

                // Format perimeter if necessary
                // Top of selection
                if (Perimeter.Top && sel.firstRow - 1 >= 0) {
                    for (let colIndex = sel.firstCol; colIndex <= sel.lastCol; colIndex++) {
                        const cell = tableModel.rows[sel.firstRow - 1].cells[colIndex];
                        applySingleBorderFormat(cell, borderFormat, 'borderBottom');
                    }
                }
                // Bottom of selection
                if (Perimeter.Bottom && sel.lastRow + 1 < tableModel.rows.length) {
                    for (let colIndex = sel.firstCol; colIndex <= sel.lastCol; colIndex++) {
                        const cell = tableModel.rows[sel.lastRow + 1].cells[colIndex];
                        applySingleBorderFormat(cell, borderFormat, 'borderTop');
                    }
                }
                // Left of selection
                if (Perimeter.Left && sel.firstCol - 1 >= 0) {
                    for (let rowIndex = sel.firstRow; rowIndex <= sel.lastRow; rowIndex++) {
                        const cell = tableModel.rows[rowIndex].cells[sel.firstCol - 1];
                        applySingleBorderFormat(cell, borderFormat, 'borderRight');
                    }
                }
                // Right of selection
                if (Perimeter.Right && sel.lastCol + 1 < tableModel.rows[0].cells.length) {
                    for (let rowIndex = sel.firstRow; rowIndex <= sel.lastRow; rowIndex++) {
                        const cell = tableModel.rows[rowIndex].cells[sel.lastCol + 1];
                        applySingleBorderFormat(cell, borderFormat, 'borderLeft');
                    }
                }
            }
            if (hasMetadata(tableModel)) {
                applyTableFormat(tableModel, undefined /*newFormat*/, true /*keepCellShade*/);
            }
            return true;
        } else {
            return false;
        }
    });
}

function applySingleBorderFormat(
    cell: ContentModelTableCell,
    borderFormat: string,
    position: 'borderTop' | 'borderBottom' | 'borderLeft' | 'borderRight'
) {
    cell.format[position] = borderFormat;
    updateBorderMetaOverride(cell);
}

function applyAllBorderFormat(cell: ContentModelTableCell, borderFormat: string) {
    cell.format.borderTop = borderFormat;
    cell.format.borderBottom = borderFormat;
    cell.format.borderLeft = borderFormat;
    cell.format.borderRight = borderFormat;
    updateBorderMetaOverride(cell);
}

function updateBorderMetaOverride(cell: ContentModelTableCell) {
    updateTableCellMetadata(cell, metadata => {
        metadata = metadata || {};
        metadata.borderOverride = true;
        return metadata;
    });
}
