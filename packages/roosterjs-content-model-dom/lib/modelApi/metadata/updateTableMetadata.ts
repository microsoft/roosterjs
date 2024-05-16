import { getMetadata, updateMetadata } from './updateMetadata';
import { TableBorderFormat } from '../../constants/TableBorderFormat';
import {
    createBooleanDefinition,
    createNumberDefinition,
    createObjectDefinition,
    createStringDefinition,
} from './definitionCreators';
import type {
    ReadonlyContentModelTable,
    ShallowMutableContentModelTable,
    TableMetadataFormat,
} from 'roosterjs-content-model-types';

const NullStringDefinition = createStringDefinition(
    false /** isOptional */,
    undefined /** value */,
    true /** allowNull */
);

const BooleanDefinition = createBooleanDefinition(false /** isOptional */);

const TableFormatDefinition = createObjectDefinition<Required<TableMetadataFormat>>(
    {
        topBorderColor: NullStringDefinition,
        bottomBorderColor: NullStringDefinition,
        verticalBorderColor: NullStringDefinition,
        hasHeaderRow: BooleanDefinition,
        headerRowColor: NullStringDefinition,
        hasFirstColumn: BooleanDefinition,
        hasBandedColumns: BooleanDefinition,
        hasBandedRows: BooleanDefinition,
        bgColorEven: NullStringDefinition,
        bgColorOdd: NullStringDefinition,
        tableBorderFormat: createNumberDefinition(
            false /** isOptional */,
            undefined /* value */,
            TableBorderFormat.Min /* first table border format */,
            TableBorderFormat.Max /* last table border format */
        ),
        verticalAlign: NullStringDefinition,
    },
    false /* isOptional */,
    true /** allowNull */
);

/**
 * Get table metadata
 * @param table The table Content Model
 */
export function getTableMetadata(table: ReadonlyContentModelTable): TableMetadataFormat | null {
    return getMetadata(table, TableFormatDefinition);
}

/**
 * Update table metadata with a callback
 * @param table The table Content Model
 * @param callback The callback function used for updating metadata
 */
export function updateTableMetadata(
    table: ShallowMutableContentModelTable,
    callback?: (format: TableMetadataFormat | null) => TableMetadataFormat | null
): TableMetadataFormat | null {
    return updateMetadata(table, callback, TableFormatDefinition);
}
