import { createTextFormatRenderer } from '../utils/createTextFormatRenderer';
import { WhiteSpaceFormat } from 'roosterjs-content-model';

export const WhiteSpaceFormatRenderer = createTextFormatRenderer<WhiteSpaceFormat>(
    'White space',
    format => format.whiteSpace,
    (format, value) => (format.whiteSpace = value)
);
