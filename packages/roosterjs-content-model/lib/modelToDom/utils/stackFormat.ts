import { ContentModelBlockFormat } from '../../publicTypes/format/ContentModelBlockFormat';
import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';

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
            ? context.defaultImplicitFormatMap[tagNameOrFormat]
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
