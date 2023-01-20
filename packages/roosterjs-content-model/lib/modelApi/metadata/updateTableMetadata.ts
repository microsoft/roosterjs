import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';
import { TableBorderFormat } from 'roosterjs-editor-types';
import { TableMetadataFormat } from '../../publicTypes/format/formatParts/TableMetadataFormat';
import { updateMetadata } from './updateMetadata';
import {
    createBooleanDefinition,
    createNumberDefinition,
    createObjectDefinition,
    createStringDefinition,
} from 'roosterjs-editor-dom';

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
            TableBorderFormat.DEFAULT /* first table border format, TODO: Use Min/Max to specify valid values */,
            TableBorderFormat.CLEAR /* last table border format, , TODO: Use Min/Max to specify valid values */
        ),
    },
    false /* isOptional */,
    true /** allowNull */
);

/**
 * @internal
 * Update table metadata with a callback
 * @param table The table Content Model
 * @param callback The callback function used for updating metadata
 */
export function updateTableMetadata(
    table: ContentModelTable,
    callback?: (format: TableMetadataFormat | null) => TableMetadataFormat | null
): TableMetadataFormat | null {
    return updateMetadata(table, callback, TableFormatDefinition);
}
