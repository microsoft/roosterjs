import { createBooleanDefinition, createObjectDefinition } from './definitionCreators';
import { updateMetadata } from './updateMetadata';
import type {
    ShallowMutableContentModelTableCell,
    TableCellMetadataFormat,
} from 'roosterjs-content-model-types';

const TableCellMetadataFormatDefinition = createObjectDefinition<Required<TableCellMetadataFormat>>(
    {
        bgColorOverride: createBooleanDefinition(true /** isOptional */),
        vAlignOverride: createBooleanDefinition(true /** isOptional */),
        borderOverride: createBooleanDefinition(true /** isOptional */),
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
    cell: ShallowMutableContentModelTableCell,
    callback?: (format: TableCellMetadataFormat | null) => TableCellMetadataFormat | null
): TableCellMetadataFormat | null {
    return updateMetadata(cell, callback, TableCellMetadataFormatDefinition);
}
