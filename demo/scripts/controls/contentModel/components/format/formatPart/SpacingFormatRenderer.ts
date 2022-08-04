import { createCheckboxFormatRenderer } from '../utils/createCheckboxFormatRenderer';
import { SpacingFormat } from 'roosterjs-content-model';

export const SpacingFormatRenderer = createCheckboxFormatRenderer<SpacingFormat>(
    'BorderCollapsed',
    format => format.borderCollapse,
    (format, value) => (format.borderCollapse = value)
);
