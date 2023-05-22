import { ContentModelBlockFormat } from '../../publicTypes/format/ContentModelBlockFormat';
import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';

/**
 * @internal
 */
export function stackFormat(
    context: ModelToDomContext,
    tagNameOrFormat: string | (ContentModelSegmentFormat & ContentModelBlockFormat) | null,
    callback: () => void,
    additionalFormat?: ContentModelSegmentFormat & ContentModelBlockFormat
) {
    const newFormat =
        typeof tagNameOrFormat == 'string'
            ? context.defaultImplicitFormatMap[tagNameOrFormat] || {}
            : typeof tagNameOrFormat == 'object'
            ? tagNameOrFormat
            : null;

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
