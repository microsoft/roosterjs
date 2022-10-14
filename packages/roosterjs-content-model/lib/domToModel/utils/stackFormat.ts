import { ContentModelBlockFormat } from '../../publicTypes/format/ContentModelBlockFormat';
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

// Some styles, such as background color, won't be inherited by block element if it was originally
// declared from an inline element. So we need to skip them.
// e.g.
// <span style="background-color: red">
//   line 1       <---------------------------- in red here
//   <div>line 2</div>  <---------------------- not in red here
// </span>
const SkippedStylesForBlock: (keyof ContentModelSegmentFormat)[] = ['backgroundColor'];

const CopiedStylesForBlockInherit: (keyof ContentModelBlockFormat)[] = [
    'backgroundColor',
    'direction',
    'textAlign',
    'isTextAlignFromAttr',
    'lineHeight',
    'whiteSpace',
];

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
    processType?: 'shallowClone' | 'shallowCloneForBlock' | 'shallowCopyInherit' | 'empty'
): T | {} {
    switch (processType) {
        case 'empty':
            return {};

        case undefined:
            return format;

        default:
            const result = { ...format };

            getObjectKeys(format).forEach(key => {
                if (
                    (processType == 'shallowCloneForBlock' &&
                        SkippedStylesForBlock.indexOf(key as keyof ContentModelSegmentFormat) >=
                            0) ||
                    (processType == 'shallowCopyInherit' &&
                        CopiedStylesForBlockInherit.indexOf(key as keyof ContentModelBlockFormat) <
                            0)
                ) {
                    delete result[key];
                }
            });

            return result;
    }
}
