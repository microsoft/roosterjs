import { ContentModelTableCell } from '../../publicTypes/group/ContentModelTableCell';
import { getTextColorForBackground } from 'roosterjs-editor-dom';
import { updateTableCellMetadata } from '../metadata/updateTableCellMetadata';

/**
 * @internal
 */
export function setTableCellBackgroundColor(
    cell: ContentModelTableCell,
    color: string | null | undefined,
    isColorOverride?: boolean
) {
    if (color) {
        cell.format.backgroundColor = color;

        if (isColorOverride) {
            updateTableCellMetadata(cell, metadata => {
                metadata = metadata || {};
                metadata.bgColorOverride = true;
                return metadata;
            });
        }

        const textColor = getTextColorForBackground(color);

        if (textColor) {
            cell.format.textColor = textColor.lightModeColor;
        } else {
            delete cell.format.textColor;
        }
    } else {
        delete cell.format.backgroundColor;
        delete cell.format.textColor;
    }
}
