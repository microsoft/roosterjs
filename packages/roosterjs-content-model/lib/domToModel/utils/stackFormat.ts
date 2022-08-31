import { ContentModelFormatBase } from '../../publicTypes/format/ContentModelFormatBase';
import { DomToModelContext } from '../context/DomToModelContext';

/**
 * @internal
 */
export type StackFormatType = 'shallowClone' | 'clear';

/**
 * @internal
 */
export interface StackFormatOptions {
    segment?: StackFormatType;
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

    context.segmentFormat = stackFormatInternal(segmentFormat, segment);

    callback();
    context.segmentFormat = segmentFormat;
}

function stackFormatInternal<T extends ContentModelFormatBase>(
    format: T,
    processType: StackFormatType | undefined
): T | {} {
    return processType == 'clear' ? {} : processType == 'shallowClone' ? { ...format } : format;
}
