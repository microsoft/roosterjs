import { FormatHandler } from '../FormatHandler';
import { TableFormat } from 'roosterjs-editor-types';
import {
    createBooleanDefinition,
    createNumberDefinition,
    createObjectDefinition,
    createStringDefinition,
    getMetadata,
    getObjectKeys,
    removeMetadata,
    setMetadata,
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
export const tableMetadataFormatHandler: FormatHandler<TableFormat> = {
    parse: (format, element) => {
        const metadata = getMetadata(element, TableFormatDefinition);

        if (metadata) {
            Object.assign(format, metadata);
        }
    },
    apply: (format, element) => {
        const metadata = {
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
            keepCellShade: format.keepCellShade,
        };

        if (
            getObjectKeys(metadata).every(key => typeof metadata[key] === 'undefined') ||
            !setMetadata(element, metadata, TableFormatDefinition)
        ) {
            removeMetadata(element);
        }
    },
};
