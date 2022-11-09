import { BorderBoxFormat } from 'roosterjs-content-model';
import { createCheckboxFormatRenderer } from '../utils/createCheckboxFormatRenderer';
import { FormatRenderer } from '../utils/FormatRenderer';

export const BorderBoxFormatRenderer: FormatRenderer<BorderBoxFormat> = createCheckboxFormatRenderer<
    BorderBoxFormat
>(
    'UseBorderBox',
    format => format.useBorderBox,
    (format, value) => (format.useBorderBox = value)
);
