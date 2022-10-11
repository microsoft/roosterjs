import { createDropDownFormatRenderer } from '../utils/createDropDownFormatRenderer';
import { FormatRenderer } from '../utils/FormatRenderer';
import { ListTypeFormat } from 'roosterjs-content-model';

export const ListTypeFormatRenderer: FormatRenderer<ListTypeFormat> = createDropDownFormatRenderer(
    'List Type',
    ['OL', 'UL'],
    format => format.listType,
    (format, value) => (format.listType = value)
);
