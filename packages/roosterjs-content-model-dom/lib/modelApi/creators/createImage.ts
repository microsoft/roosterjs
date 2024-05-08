import { internalConvertToMutableType } from './internalConvertToMutableType';
import type {
    ContentModelImage,
    ReadonlyContentModelImage,
    ReadonlyContentModelImageFormat,
} from 'roosterjs-content-model-types';

/**
 * Create a ContentModelImage model
 * @param src Image source
 * @param format @optional The format of this model
 */
export function createImage(
    src: string,
    format?: ReadonlyContentModelImageFormat
): ContentModelImage {
    const result: ReadonlyContentModelImage = {
        segmentType: 'Image',
        src: src,
        format: { ...format },
        dataset: {},
    };

    return internalConvertToMutableType(result);
}
