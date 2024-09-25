import { PaddingKeys } from '../block/paddingFormatHandler';
import type { FormatHandler } from '../FormatHandler';
import type { SpacingFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const tableCellPaddingFormatHandler: FormatHandler<SpacingFormat> = {
    parse: () => {},
    apply: (_format, element, context) => {
        const cellPadding = context.tableFormat?.cellPadding;
        if (cellPadding) {
            const padding = cellPadding.concat(cellPadding.endsWith('%') ? '' : 'px');
            PaddingKeys.forEach(key => {
                element.style[key] = padding;
            });
        }
    },
};
