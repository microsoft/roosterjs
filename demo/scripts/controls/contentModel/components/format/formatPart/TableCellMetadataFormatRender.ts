import { createCheckboxFormatRenderer } from '../utils/createCheckboxFormatRenderer';
import { TableCellMetadataFormat } from 'roosterjs-content-model';

export const TableCellMetadataFormatRender = createCheckboxFormatRenderer<TableCellMetadataFormat>(
    'BgColorOverride',
    format => format.bgColorOverride,
    (format, value) => (format.bgColorOverride = value)
);
