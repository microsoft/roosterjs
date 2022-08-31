import { ContentModelFormatBase } from '../../publicTypes/format/ContentModelFormatBase';
import { DomToModelContext } from '../context/DomToModelContext';

/**
 * @internal
 */
export type ShallowObjectStackType = 'shallowClone' | 'empty';

/**
 * @internal
 */
export interface StackFormatOptions {
    segment?: ShallowObjectStackType;
}

/**
 * @internal
 */
export function stackFormat(
    context: DomToModelContext,
    options: StackFormatOptions,
    callback: () => void
) {
    const { segmentFormat } = context;
    const { segment } = options;

    try {
        context.segmentFormat = stackFormatInternal(segmentFormat, segment);

        callback();
    } finally {
        context.segmentFormat = segmentFormat;
    }
}

function stackFormatInternal<T extends ContentModelFormatBase>(
    format: T,
    processType: ShallowObjectStackType | undefined
): T | {} {
    return processType == 'empty' ? {} : processType == 'shallowClone' ? { ...format } : format;
}
