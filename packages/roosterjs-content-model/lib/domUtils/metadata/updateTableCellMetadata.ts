import { ContentModelTableCell } from '../../publicTypes/group/ContentModelTableCell';
import { createBooleanDefinition, createObjectDefinition } from 'roosterjs-editor-dom';
import { TableCellMetadataFormat } from 'roosterjs-editor-types';
import { updateMetadata } from './updateMetadata';

const TableCellMetadataFormatDefinition = createObjectDefinition<Required<TableCellMetadataFormat>>(
    {
        bgColorOverride: createBooleanDefinition(true /** isOptional */),
    },
    false /* isOptional */,
    true /** allowNull */
);

/**
 * @internal
 * Update table cell metadata with a callback
 * @param cell The table cell Content Model
 * @param callback The callback function used for updating metadata
 */
export function updateTableCellMetadata(
    cell: ContentModelTableCell,
    callback?: (format: TableCellMetadataFormat | null) => TableCellMetadataFormat | null
): TableCellMetadataFormat | null {
    return updateMetadata(cell, callback, TableCellMetadataFormatDefinition);
}
