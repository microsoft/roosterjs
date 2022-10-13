import { ContentModelFormatBase } from '../../publicTypes/format/ContentModelFormatBase';
import { DomToModelContext } from '../../publicTypes/context/DomToModelContext';

/**
 * @internal
 */
export type ShallowObjectStackType = 'shallowClone' | 'empty';

/**
 * @internal
 */
export interface StackFormatOptions {
    segment?: ShallowObjectStackType;
    paragraph?: ShallowObjectStackType;
}

/**
 * @internal
 */
export function stackFormat(
    context: DomToModelContext,
    options: StackFormatOptions,
    callback: () => void
) {
    const { segmentFormat, blockFormat } = context;
    const { segment, paragraph } = options;

    try {
        context.segmentFormat = stackFormatInternal(segmentFormat, segment);
        context.blockFormat = stackFormatInternal(blockFormat, paragraph);

        callback();
    } finally {
        context.segmentFormat = segmentFormat;
        context.blockFormat = blockFormat;
    }
}

function stackFormatInternal<T extends ContentModelFormatBase>(
    format: T,
    processType: ShallowObjectStackType | undefined
): T | {} {
    return processType == 'empty' ? {} : processType == 'shallowClone' ? { ...format } : format;
}
