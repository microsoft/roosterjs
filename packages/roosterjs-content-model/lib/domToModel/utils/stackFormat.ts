import { ContentModelFormatBase } from '../../publicTypes/format/ContentModelFormatBase';
import { DomToModelContext } from '../../publicTypes/context/DomToModelContext';

/**
 * @internal
 */
export type ObjectStackType = 'empty';

/**
 * @internal
 */
export type ShallowObjectStackType = 'shallowClone' | ObjectStackType;

/**
 * @internal
 */
export interface StackFormatOptions {
    segment?: ShallowObjectStackType;
    paragraph?: ShallowObjectStackType;
    link?: ObjectStackType;
}

/**
 * @internal
 */
export function stackFormat(
    context: DomToModelContext,
    options: StackFormatOptions,
    callback: () => void
) {
    const { segmentFormat, blockFormat, link: linkFormat } = context;
    const { segment, paragraph, link } = options;

    try {
        context.segmentFormat = stackFormatInternal(segmentFormat, segment);
        context.blockFormat = stackFormatInternal(blockFormat, paragraph);
        context.link =
            link == 'empty'
                ? {
                      format: {},
                      dataset: {},
                  }
                : linkFormat;

        callback();
    } finally {
        context.segmentFormat = segmentFormat;
        context.blockFormat = blockFormat;
        context.link = linkFormat;
    }
}

function stackFormatInternal<T extends ContentModelFormatBase>(
    format: T,
    processType: ShallowObjectStackType | undefined
): T | {} {
    return processType == 'empty' ? {} : processType == 'shallowClone' ? { ...format } : format;
}
