import { ContentModelTableFormat } from '../../publicTypes/format/ContentModelTableFormat';
import { FormatHandler } from '../FormatHandler';

const BorderCollapsed = 'collapse';

/**
 * @internal
 */
export const tableSpacingHandler: FormatHandler<ContentModelTableFormat> = {
    parse: (format, element) => {
        if (element.style.borderCollapse == BorderCollapsed) {
            format.borderCollapse = true;
        }
    },
    apply: (format, element) => {
        if (format.borderCollapse) {
            element.style.borderCollapse = BorderCollapsed;
            element.style.borderSpacing = '0';
            element.style.boxShadow = 'border-box';
        }
    },
};
