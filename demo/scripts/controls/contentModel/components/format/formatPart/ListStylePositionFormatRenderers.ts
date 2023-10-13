import { createDropDownFormatRenderer } from '../utils/createDropDownFormatRenderer';
import { FormatRenderer } from '../utils/FormatRenderer';
import { ListStyleFormat } from 'roosterjs-content-model-types';

export const ListStylePositionFormatRenderers: FormatRenderer<ListStyleFormat>[] = [
    createDropDownFormatRenderer(
        'List position',
        ['inside', 'outside'],
        format => format.listStylePosition,
        (format, value) => (format.listStylePosition = value)
    ),
];
