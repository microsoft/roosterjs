import { createMetadataFormatHandler } from '../utils/createMetadataFormatHandler';
import { TableFormat } from 'roosterjs-editor-types';
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

const TableFormatDefinition = createObjectDefinition<Required<TableFormat>>(
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
        keepCellShade: BooleanDefinition,
    },
    false /* isOptional */,
    true /** allowNull */
);

/**
 * @internal
 */
export const tableMetadataFormatHandler = createMetadataFormatHandler<TableFormat>(
    TableFormatDefinition
);
