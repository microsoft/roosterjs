import { createTextFormatRenderer } from '../utils/createTextFormatRenderer';
import { FormatRenderer } from '../utils/FormatRenderer';
import { RoleFormat } from 'roosterjs-content-model-types';

export const RoleFormatRenderer: FormatRenderer<RoleFormat> = createTextFormatRenderer<RoleFormat>(
    'Role',
    format => format.role,
    (format, value) => (format.role = value)
);
