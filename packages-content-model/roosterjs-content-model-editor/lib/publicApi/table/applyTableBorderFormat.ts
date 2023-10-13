import { extractBorderValues } from '../../domUtils/borderValues';
import { formatWithContentModel } from '../utils/formatWithContentModel';
import { getFirstSelectedTable } from '../../modelApi/selection/collectSelections';
import { getSelectedCells } from '../../modelApi/table/getSelectedCells';
import { IContentModelEditor } from 'roosterjs-content-model/lib';
import { parseValueWithUnit } from 'roosterjs-content-model-dom';
import { updateTableCellMetadata } from '../../domUtils/metadata/updateTableCellMetadata';
import type { Border } from 'roosterjs-editor-types';

export const enum BorderOperations {
    AllBorders,
}

/**
 * @internal
 * UNFINISHED - only All Borders is implemented
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

            if (sel && operation) {
                switch (operation) {
                    case BorderOperations.AllBorders:
                        for (let rowIndex = sel.firstRow; rowIndex <= sel.lastRow; rowIndex++) {
                            for (let colIndex = sel.firstCol; colIndex <= sel.lastCol; colIndex++) {
                                const cell = tableModel.rows[rowIndex].cells[colIndex];

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
            return true;
        } else {
            return false;
        }
    });
}
