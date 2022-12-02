import { ContentModelBlockFormat } from '../../publicTypes/format/ContentModelBlockFormat';
import { ContentModelFormatBase } from '../../publicTypes/format/ContentModelFormatBase';
import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';
import { DomToModelContext } from '../../publicTypes/context/DomToModelContext';

/**
 * @internal
 */
export type ObjectStackType = 'empty';

/**
 * @internal
 */
export type ShallowObjectStackType = 'shallowClone' | 'shallowCloneForBlock' | ObjectStackType;

/**
 * @internal
 */
export interface StackFormatOptions {
    segment?: ShallowObjectStackType;
    paragraph?: ShallowObjectStackType;
    link?: ObjectStackType;
}

// Some styles, such as background color, won't be inherited by block element if it was originally
// declared from an inline element. So we need to skip them.
// e.g.
// <span style="background-color: red">
//   line 1       <---------------------------- in red here
//   <div>line 2</div>  <---------------------- not in red here
// </span>
const SkippedStylesForBlock: (keyof ContentModelSegmentFormat)[] = ['backgroundColor'];

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
    processType?: 'shallowClone' | 'shallowCloneForBlock' | 'shallowCopyInherit' | 'empty'
): T | {} {
    const result =
        processType == 'empty'
            ? {}
            : processType == 'shallowClone' || processType == 'shallowCloneForBlock'
            ? { ...format }
            : format;

    if (processType == 'shallowCloneForBlock') {
        SkippedStylesForBlock.forEach(key => {
            delete (result as ContentModelSegmentFormat)[key];
        });
    }

    return result;
}
