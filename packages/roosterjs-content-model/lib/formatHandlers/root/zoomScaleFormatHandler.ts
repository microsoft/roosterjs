import { FormatHandler } from '../FormatHandler';
import { ZoomScaleFormat } from '../../publicTypes/format/formatParts/ZoomScaleFormat';

/**
 * @internal
 */
export const zoomScaleFormatHandler: FormatHandler<ZoomScaleFormat> = {
    parse: (format, element) => {
        const originalWidth = element.getBoundingClientRect().width;
        const visualWidth = element.offsetWidth;

        format.zoomScale =
            visualWidth > 0 && originalWidth > 0
                ? Math.round((originalWidth / visualWidth) * 100) / 100
                : 1;
    },
    apply: () => {},
};
