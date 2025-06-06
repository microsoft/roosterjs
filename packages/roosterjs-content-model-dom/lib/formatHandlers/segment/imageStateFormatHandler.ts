import { getImageState, setImageState } from '../../domUtils/hiddenProperties/imageState';
import type { ImageStateFormat } from 'roosterjs-content-model-types';
import type { FormatHandler } from '../FormatHandler';

/**
 * @internal
 */
export const imageStateFormatHandler: FormatHandler<ImageStateFormat> = {
    parse: (format, element) => {
        const marker = getImageState(element);
        if (marker) {
            format.imageState = marker;
        }
    },
    apply: (format, element) => {
        if (format.imageState) {
            setImageState(element, format.imageState);
        }
    },
};
