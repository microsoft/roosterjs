import { getImageMarker, setImageMarker } from '../../domUtils/hiddenProperties/imageMarker';
import type { ImageMarkerFormat } from 'roosterjs-content-model-types';
import type { FormatHandler } from '../FormatHandler';

/**
 * @internal
 */
export const imageMarkerFormatHandler: FormatHandler<ImageMarkerFormat> = {
    parse: (format, element) => {
        const marker = getImageMarker(element);
        if (marker) {
            format.imageMarker = marker;
        }
    },
    apply: (format, element) => {
        if (format.imageMarker) {
            setImageMarker(element, format.imageMarker);
        }
    },
};
