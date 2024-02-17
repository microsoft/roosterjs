import { createCheckboxFormatRenderer } from '../utils/createCheckboxFormatRenderer';
import { SpacingFormat } from 'roosterjs-content-model-types';

export const SpacingFormatRenderer = createCheckboxFormatRenderer<SpacingFormat>(
    'BorderCollapsed',
    format => format.borderCollapse,
    (format, value) => (format.borderCollapse = value)
);
