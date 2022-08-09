import { FormatHandler } from '../FormatHandler';
import { SpacingFormat } from '../../publicTypes/format/formatParts/SpacingFormat';

const BorderCollapsed = 'collapse';

/**
 * @internal
 */
export const tableSpacingFormatHandler: FormatHandler<SpacingFormat> = {
    parse: (format, element) => {
        if (element.style.borderCollapse == BorderCollapsed) {
            format.borderCollapse = true;
        }
    },
    apply: (format, element) => {
        if (format.borderCollapse) {
            element.style.borderCollapse = BorderCollapsed;
            element.style.borderSpacing = '0';
            element.style.boxSizing = 'border-box';
        }
    },
};
