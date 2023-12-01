import { createCheckboxFormatRenderer } from '../utils/createCheckboxFormatRenderer';
import { createColorFormatRenderer } from '../utils/createColorFormatRender';
import { createDropDownFormatRenderer } from '../utils/createDropDownFormatRenderer';
import { FormatRenderer } from '../utils/FormatRenderer';
import { getObjectKeys } from 'roosterjs-content-model-dom';
import { TableBorderFormat } from 'roosterjs-content-model-core';
import { TableMetadataFormat } from 'roosterjs-content-model-types';

export const TableMetadataFormatRenders: FormatRenderer<TableMetadataFormat>[] = [
    createColorFormatRenderer<TableMetadataFormat>(
        'TopBorderColor',
        format => format.topBorderColor,
        (format, value) => {
            format.topBorderColor = value;
        }
    ),
    createColorFormatRenderer<TableMetadataFormat>(
        'BottomBorderColor',
        format => format.bottomBorderColor,
        (format, value) => (format.bottomBorderColor = value)
    ),
    createColorFormatRenderer<TableMetadataFormat>(
        'VerticalBorderColor',
        format => format.verticalBorderColor,
        (format, value) => (format.verticalBorderColor = value)
    ),
    createCheckboxFormatRenderer<TableMetadataFormat>(
        'HasHeaderRow',
        format => format.hasHeaderRow,
        (format, value) => (format.hasHeaderRow = value)
    ),
    createColorFormatRenderer<TableMetadataFormat>(
        'HeaderRowColor',
        format => format.headerRowColor,
        (format, value) => (format.headerRowColor = value)
    ),
    createCheckboxFormatRenderer<TableMetadataFormat>(
        'HasFirstColumn',
        format => format.hasFirstColumn,
        (format, value) => (format.hasFirstColumn = value)
    ),
    createCheckboxFormatRenderer<TableMetadataFormat>(
        'HasBandedColumns',
        format => format.hasBandedColumns,
        (format, value) => (format.hasBandedColumns = value)
    ),
    createCheckboxFormatRenderer<TableMetadataFormat>(
        'HasBandedRows',
        format => format.hasBandedRows,
        (format, value) => (format.hasBandedRows = value)
    ),
    createColorFormatRenderer<TableMetadataFormat>(
        'BgColorEven',
        format => format.bgColorEven,
        (format, value) => (format.bgColorEven = value)
    ),
    createColorFormatRenderer<TableMetadataFormat>(
        'BgColorOdd',
        format => format.bgColorOdd,
        (format, value) => (format.bgColorOdd = value)
    ),
    createDropDownFormatRenderer<TableMetadataFormat, keyof typeof TableBorderFormat>(
        'TableBorderFormat',
        [
            'Default',
            'ListWithSideBorders',
            'NoHeaderBorders',
            'NoSideBorders',
            'FirstColumnHeaderExternal',
            'EspecialType1',
            'EspecialType2',
            'EspecialType3',
            'Clear',
        ],
        format =>
            getObjectKeys(TableBorderFormat)[
                Object.values(TableBorderFormat).indexOf(format.tableBorderFormat)
            ],
        (format, newValue) => (format.tableBorderFormat = TableBorderFormat[newValue])
    ),
];
