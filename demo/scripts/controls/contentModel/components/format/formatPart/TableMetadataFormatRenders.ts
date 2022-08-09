import { CompatibleTableBorderFormat } from 'roosterjs-editor-types/lib/compatibleTypes';
import { createCheckboxFormatRenderer } from '../utils/createCheckboxFormatRenderer';
import { createDropDownFormatRenderer } from '../utils/createDropDownFormatRenderer';
import { createTextFormatRenderer } from '../utils/createTextFormatRenderer';
import { FormatRenderer } from '../utils/FormatRenderer';
import { TableFormat } from 'roosterjs-editor-types';

export const TableMetadataFormatRenders: FormatRenderer<TableFormat>[] = [
    createTextFormatRenderer<TableFormat>(
        'TopBorderColor',
        format => format.topBorderColor,
        (format, value) => {
            format.topBorderColor = value;
            return undefined;
        },
        'color'
    ),
    createTextFormatRenderer<TableFormat>(
        'BottomBorderColor',
        format => format.bottomBorderColor,
        (format, value) => {
            format.bottomBorderColor = value;
            return undefined;
        },
        'color'
    ),
    createTextFormatRenderer<TableFormat>(
        'VerticalBorderColor',
        format => format.verticalBorderColor,
        (format, value) => {
            format.verticalBorderColor = value;
            return undefined;
        },
        'color'
    ),
    createCheckboxFormatRenderer<TableFormat>(
        'HasHeaderRow',
        format => format.hasHeaderRow,
        (format, value) => (format.hasHeaderRow = value)
    ),
    createTextFormatRenderer<TableFormat>(
        'HeaderRowColor',
        format => format.headerRowColor,
        (format, value) => {
            format.headerRowColor = value;
            return undefined;
        },
        'color'
    ),
    createCheckboxFormatRenderer<TableFormat>(
        'HasFirstColumn',
        format => format.hasFirstColumn,
        (format, value) => (format.hasFirstColumn = value)
    ),
    createCheckboxFormatRenderer<TableFormat>(
        'HasBandedColumns',
        format => format.hasBandedColumns,
        (format, value) => (format.hasBandedColumns = value)
    ),
    createCheckboxFormatRenderer<TableFormat>(
        'HasBandedRows',
        format => format.hasBandedRows,
        (format, value) => (format.hasBandedRows = value)
    ),
    createTextFormatRenderer<TableFormat>(
        'BgColorEven',
        format => format.bgColorEven,
        (format, value) => {
            format.bgColorEven = value;
            return undefined;
        },
        'color'
    ),
    createTextFormatRenderer<TableFormat>(
        'BgColorOdd',
        format => format.bgColorOdd,
        (format, value) => {
            format.bgColorOdd = value;
            return undefined;
        },
        'color'
    ),
    createDropDownFormatRenderer<TableFormat, keyof typeof CompatibleTableBorderFormat>(
        'TableBorderFormat',
        [
            'DEFAULT',
            'LIST_WITH_SIDE_BORDERS',
            'NO_HEADER_BORDERS',
            'NO_SIDE_BORDERS',
            'FIRST_COLUMN_HEADER_EXTERNAL',
            'ESPECIAL_TYPE_1',
            'ESPECIAL_TYPE_2',
            'ESPECIAL_TYPE_3',
            'CLEAR',
        ],
        format =>
            CompatibleTableBorderFormat[
                format.tableBorderFormat
            ] as keyof typeof CompatibleTableBorderFormat,
        (format, newValue) => (format.tableBorderFormat = CompatibleTableBorderFormat[newValue])
    ),
    createCheckboxFormatRenderer<TableFormat>(
        'KeepCellShade',
        format => format.keepCellShade,
        (format, value) => (format.keepCellShade = value)
    ),
];
