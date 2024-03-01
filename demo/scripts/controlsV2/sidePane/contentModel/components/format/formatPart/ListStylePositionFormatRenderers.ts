import { createDropDownFormatRenderer } from '../utils/createDropDownFormatRenderer';
import { createTextFormatRenderer } from '../utils/createTextFormatRenderer';
import { FormatRenderer } from '../utils/FormatRenderer';
import { ListStyleFormat } from 'roosterjs-content-model-types';

export const ListStylePositionFormatRenderers: FormatRenderer<ListStyleFormat>[] = [
    createDropDownFormatRenderer(
        'List position',
        ['inside', 'outside'],
        format => format.listStylePosition,
        (format, value) => (format.listStylePosition = value)
    ),
    createTextFormatRenderer(
        'List style type',
        format => format.listStyleType,
        (format, value) => (format.listStyleType = value)
    ),
];
