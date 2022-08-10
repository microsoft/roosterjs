import { createMetadataFormatHandler } from '../utils/createMetadataFormatHandler';
import { TableMetadataFormat } from '../../publicTypes/format/formatParts/TableMetadataFormat';
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
            0 /* first table border format */,
            7 /* last table border format */
        ),
    },
    false /* isOptional */,
    true /** allowNull */
);

/**
 * @internal
 */
export const tableMetadataFormatHandler = createMetadataFormatHandler<TableMetadataFormat>(
    TableFormatDefinition,
    format => ({
        topBorderColor: format.topBorderColor,
        bottomBorderColor: format.bottomBorderColor,
        verticalBorderColor: format.verticalBorderColor,
        hasHeaderRow: format.hasHeaderRow,
        headerRowColor: format.headerRowColor,
        hasFirstColumn: format.hasFirstColumn,
        hasBandedColumns: format.hasBandedColumns,
        hasBandedRows: format.hasBandedRows,
        bgColorEven: format.bgColorEven,
        bgColorOdd: format.bgColorOdd,
        tableBorderFormat: format.tableBorderFormat,
    })
);
