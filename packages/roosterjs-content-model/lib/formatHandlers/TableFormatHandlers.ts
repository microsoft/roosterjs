import { backgroundColorFormatHandler } from './common/backgroundColorFormatHandler';
import { ContentModelTableFormat } from '../publicTypes/format/ContentModelTableFormat';
import { createMetadataFormatHandler } from './common/metadataFormatHandler';
import { FormatHandler } from './FormatHandler';
import { idFormatHandler } from './common/idFormatHandler';
import { TableFormat } from 'roosterjs-editor-types';
import { tableSpacingFormatHandler } from './table/tableSpacingFormatHandler';
import {
    createBooleanDefinition,
    createStringDefinition,
    createObjectDefinition,
    createNumberDefinition,
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
export const TableFormatHandlers: FormatHandler<ContentModelTableFormat>[] = [
    idFormatHandler,
    createMetadataFormatHandler<TableFormat>(TableFormatDefinition),
    tableSpacingFormatHandler,
    backgroundColorFormatHandler,
];
