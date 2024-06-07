import { createCheckboxFormatRenderer } from '../utils/createCheckboxFormatRenderer';
import { FormatRenderer } from '../utils/FormatRenderer';
import { TableCellMetadataFormat } from 'roosterjs-content-model-types';

export const TableCellMetadataFormatRenders: FormatRenderer<TableCellMetadataFormat>[] = [
    createCheckboxFormatRenderer<TableCellMetadataFormat>(
        'BgColorOverride',
        format => format.bgColorOverride,
        (format, value) => (format.bgColorOverride = value)
    ),
    createCheckboxFormatRenderer<TableCellMetadataFormat>(
        'VAlignOverride',
        format => format.vAlignOverride,
        (format, value) => (format.vAlignOverride = value)
    ),
    createCheckboxFormatRenderer<TableCellMetadataFormat>(
        'BorderOverride',
        format => format.borderOverride,
        (format, value) => (format.borderOverride = value)
    ),
];
