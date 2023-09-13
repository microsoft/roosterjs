import { defaultContentModelFormatMap } from '../../config/defaultContentModelFormatMap';
import {
    ContentModelBlockFormat,
    ContentModelSegmentFormat,
    ModelToDomContext,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function stackFormat(
    context: ModelToDomContext,
    tagNameOrFormat: string | (ContentModelSegmentFormat & ContentModelBlockFormat) | null,
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
