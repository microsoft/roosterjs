import { defaultContentModelFormatMap } from '../../config/defaultContentModelFormatMap';
import type {
    ModelToDomContext,
    ReadonlyContentModelBlockFormat,
    ReadonlyContentModelSegmentFormat,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function stackFormat(
    context: ModelToDomContext,
    tagNameOrFormat:
        | string
        | (ReadonlyContentModelSegmentFormat & ReadonlyContentModelBlockFormat)
        | null,
    callback: () => void
) {
    const newFormat =
        typeof tagNameOrFormat === 'string'
            ? defaultContentModelFormatMap[tagNameOrFormat]
            : tagNameOrFormat;

    if (newFormat) {
        const implicitFormat = context.implicitFormat;

        try {
            context.implicitFormat = {
                ...implicitFormat,
                ...newFormat,
            };

            callback();
        } finally {
            context.implicitFormat = implicitFormat;
        }
    } else {
        callback();
    }
}
