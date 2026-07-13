import { createCheckboxFormatRenderer } from '../utils/createCheckboxFormatRenderer';
import { FormatRenderer } from '../utils/FormatRenderer';
import { UndeletableFormat } from 'roosterjs-content-model-types';

export const UndeletableFormatRenderer: FormatRenderer<UndeletableFormat> = createCheckboxFormatRenderer<
    UndeletableFormat
>(
    'Undeletable',
    format => format.undeletable,
    (format, value) => (format.undeletable = value)
);
