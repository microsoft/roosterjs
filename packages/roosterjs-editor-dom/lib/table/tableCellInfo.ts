import { createBooleanDefinition, createObjectDefinition } from '../metadata/definitionCreators';
import { getMetadata, setMetadata } from '../metadata/metadata';
import { TableCellMetadataFormat } from 'roosterjs-editor-types';

const BooleanDefinition = createBooleanDefinition(
    false /** isOptional */,
    undefined /** value */,
    true /** allowNull */
);

const TableCellFormatMetadata = createObjectDefinition<Required<TableCellMetadataFormat>>(
    {
        bgColorOverride: BooleanDefinition,
    },
    false /* isOptional */,
    true /** allowNull */
);

/**
 * @internal
 * Get the format info of a table cell
 * @param cell The table cell to use
 */
export function getTableCellMetadata(cell: HTMLTableCellElement) {
    return getMetadata(cell, TableCellFormatMetadata);
}

/**
 * Add metadata to a cell
 * @param cell The table cell to add the metadata
 * @param format The format of the table
 */
export function saveTableCellMetadata(cell: HTMLTableCellElement, format: TableCellMetadataFormat) {
    if (cell && format) {
        setMetadata(cell, format, TableCellFormatMetadata);
    }
}
