import { createBooleanDefinition, createObjectDefinition } from 'roosterjs-editor-dom';
import { updateMetadata } from 'roosterjs-content-model-dom';
import type { ContentModelTableCell } from 'roosterjs-content-model-types';
import type { TableCellMetadataFormat } from 'roosterjs-editor-types';

const TableCellMetadataFormatDefinition = createObjectDefinition<Required<TableCellMetadataFormat>>(
    {
        bgColorOverride: createBooleanDefinition(true /** isOptional */),
        vAlignOverride: createBooleanDefinition(true /** isOptional */),
    },
    false /* isOptional */,
    true /** allowNull */
);

/**
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
