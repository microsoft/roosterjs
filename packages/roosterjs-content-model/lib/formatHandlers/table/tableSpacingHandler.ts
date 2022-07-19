import { ContentModelTableFormat } from '../../publicTypes/format/ContentModelTableFormat';
import { FormatHandler } from '../FormatHandler';

const BorderCollapsed = 'collapse';

/**
 * @internal
 */
export const tableSpacingHandler: FormatHandler<ContentModelTableFormat> = {
    parse: (format, element) => {
        format.borderCollapse = element.style.borderCollapse == BorderCollapsed;
    },
    apply: (format, element) => {
        if (format.borderCollapse) {
            element.style.borderCollapse = BorderCollapsed;
            element.style.borderSpacing = '0';
            element.style.boxShadow = 'border-box';
        }
    },
};
