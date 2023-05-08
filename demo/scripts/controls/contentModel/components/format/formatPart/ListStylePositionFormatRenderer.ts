import { createDropDownFormatRenderer } from '../utils/createDropDownFormatRenderer';
import { FormatRenderer } from '../utils/FormatRenderer';
import { ListStylePositionFormat } from 'roosterjs-content-model';

export const ListStylePositionFormatRenderer: FormatRenderer<ListStylePositionFormat> = createDropDownFormatRenderer(
    'List Type',
    ['inside', 'outside'],
    format => format.listStylePosition,
    (format, value) => (format.listStylePosition = value)
);
