import { FormatHandler } from '../FormatHandler';
import { ScaleFormat } from 'roosterjs-content-model/lib/publicTypes/format/formatParts/ScaleFormat';

/**
 * @internal
 */
export const scaleFormatHandler: FormatHandler<ScaleFormat> = {
    parse: (format, element) => {
        const originalWidth = element.getBoundingClientRect().width;
        const visualWidth = element.offsetWidth;

        format.scale =
            visualWidth > 0 && originalWidth > 0
                ? Math.round((originalWidth / visualWidth) * 100) / 100
                : 1;
    },
    apply: () => {},
};
