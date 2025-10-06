import type { RoleFormat } from 'roosterjs-content-model-types';
import type { FormatHandler } from '../FormatHandler';

/**
 * @internal
 */
export const roleFormatHandler: FormatHandler<RoleFormat> = {
    parse: (format, element) => {
        const role = element.getAttribute('role');

        if (role) {
            format.role = role;
        }
    },
    apply: (format, element) => {
        if (format.role) {
            element.setAttribute('role', format.role);
        }
    },
};
