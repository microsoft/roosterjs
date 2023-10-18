import { extractBorderValues } from '../../domUtils/borderValues';
import { formatWithContentModel } from '../utils/formatWithContentModel';
import { getFirstSelectedTable } from '../../modelApi/selection/collectSelections';
import { getSelectedCells } from '../../modelApi/table/getSelectedCells';
import { parseValueWithUnit } from 'roosterjs-content-model-dom';
import { updateTableCellMetadata } from '../../domUtils/metadata/updateTableCellMetadata';
import type { BorderOperations } from '../../publicTypes/enum/BorderOperations';
import type { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import type { Border } from '../../publicTypes/interface/Border';
import type { ContentModelTableCell } from 'roosterjs-content-model-types';

/**
 * UNFINISHED - only All Borders is implemented
 * @param editor The editor instance
 * @param border The border to apply
 * @param operation The operation to apply
 */
export default function applyTableBorderFormat(
    editor: IContentModelEditor,
    border: Border,
    operation: BorderOperations
) {
    formatWithContentModel(editor, 'tableBorder', model => {
        const [tableModel] = getFirstSelectedTable(model);

        if (tableModel) {
            const sel = getSelectedCells(tableModel);
            const perimeter = {
                Top: false,
                Bottom: false,
                Left: false,
                Right: false,
            };

            // Create border format with table format as backup
            let borderFormat = '';
            const format = tableModel.format;
            const { width, style, color } = border;
            const extractedBorder = extractBorderValues(format.borderTop);
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

            if (sel) {
                switch (operation) {
                    case 'AllBorders':
                        for (let rowIndex = sel.firstRow; rowIndex <= sel.lastRow; rowIndex++) {
                            for (let colIndex = sel.firstCol; colIndex <= sel.lastCol; colIndex++) {
                                const cell = tableModel.rows[rowIndex].cells[colIndex];
                                // Format cells - All borders
                                applyAllBorderFormat(cell, borderFormat);
                            }
                        }

                        // Format perimeter
                        perimeter.Top = true;
                        perimeter.Bottom = true;
                        perimeter.Left = true;
                        perimeter.Right = true;
                        break;

                    default:
                        break;
                }

                //Format perimeter if necessary
                // Top of selection
                if (perimeter.Top && sel.firstRow - 1 >= 0) {
                    for (let colIndex = sel.firstCol; colIndex <= sel.lastCol; colIndex++) {
                        const cell = tableModel.rows[sel.firstRow - 1].cells[colIndex];
                        applySingleBorderFormat(cell, borderFormat, 'borderBottom');
                    }
                }
                // Bottom of selection
                if (perimeter.Bottom && sel.lastRow + 1 < tableModel.rows.length) {
                    for (let colIndex = sel.firstCol; colIndex <= sel.lastCol; colIndex++) {
                        const cell = tableModel.rows[sel.lastRow + 1].cells[colIndex];
                        applySingleBorderFormat(cell, borderFormat, 'borderTop');
                    }
                }
                // Left of selection
                if (perimeter.Left && sel.firstCol - 1 >= 0) {
                    for (let rowIndex = sel.firstRow; rowIndex <= sel.lastRow; rowIndex++) {
                        const cell = tableModel.rows[rowIndex].cells[sel.firstCol - 1];
                        applySingleBorderFormat(cell, borderFormat, 'borderRight');
                    }
                }
                // Right of selection
                if (perimeter.Right && sel.lastCol + 1 < tableModel.rows[0].cells.length) {
                    for (let rowIndex = sel.firstRow; rowIndex <= sel.lastRow; rowIndex++) {
                        const cell = tableModel.rows[rowIndex].cells[sel.lastCol + 1];
                        applySingleBorderFormat(cell, borderFormat, 'borderLeft');
                    }
                }
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
