import { ContentModelTableCell } from '../../publicTypes/group/ContentModelTableCell';
import { updateTableCellMetadata } from '../../domUtils/metadata/updateTableCellMetadata';

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
        cell.format.adjustTextColor = true;

        if (isColorOverride) {
            updateTableCellMetadata(cell, metadata => {
                metadata = metadata || {};
                metadata.bgColorOverride = true;
                return metadata;
            });
        }
    } else {
        delete cell.format.backgroundColor;
        delete cell.format.textColor;
    }

    delete cell.cachedElement;
}
