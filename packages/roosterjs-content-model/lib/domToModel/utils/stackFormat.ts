import { ContentModelBlockFormat } from '../../publicTypes/format/ContentModelBlockFormat';
import { ContentModelCode } from '../../publicTypes/decorator/ContentModelCode';
import { ContentModelFormatBase } from '../../publicTypes/format/ContentModelFormatBase';
import { ContentModelLink } from '../../publicTypes/decorator/ContentModelLink';
import { ContentModelParagraphDecorator } from '../../publicTypes/decorator/ContentModelParagraphDecorator';
import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';
import { DomToModelContext } from '../../publicTypes/context/DomToModelContext';
import { getObjectKeys } from 'roosterjs-editor-dom';

/**
 * @internal
 */
export interface StackFormatOptions {
    segment?: 'shallowClone' | 'shallowCloneForBlock' | 'empty';
    paragraph?: 'shallowClone' | 'shallowCloneForGroup' | 'empty';
    blockDecorator?: 'empty';
    link?: 'linkDefault' | 'cloneFormat' | 'empty';
    code?: 'codeDefault' | 'empty';
}

// Some styles, such as background color, won't be inherited by block element if it was originally
// declared from an inline element. So we need to skip them.
// e.g.
// <span style="background-color: red">
//   line 1       <---------------------------- in red here
//   <div>line 2</div>  <---------------------- not in red here
// </span>
const SkippedStylesForBlock: (keyof ContentModelSegmentFormat)[] = ['backgroundColor'];
const SkippedStylesForTable: (keyof ContentModelBlockFormat)[] = [
    'marginLeft',
    'marginRight',
    'paddingLeft',
    'paddingRight',
];

/**
 * @internal
 */
export function stackFormat(
    context: DomToModelContext,
    options: StackFormatOptions,
    callback: () => void
) {
    const {
        segmentFormat,
        blockFormat,
        link: linkFormat,
        code: codeFormat,
        blockDecorator: decoratorFormat,
    } = context;
    const { segment, paragraph, link, code, blockDecorator } = options;

    try {
        context.segmentFormat = stackFormatInternal(segmentFormat, segment);
        context.blockFormat = stackFormatInternal(blockFormat, paragraph);
        context.link = stackLinkInternal(linkFormat, link);
        context.code = stackCodeInternal(codeFormat, code);
        context.blockDecorator = stackDecoratorInternal(decoratorFormat, blockDecorator);

        callback();
    } finally {
        context.segmentFormat = segmentFormat;
        context.blockFormat = blockFormat;
        context.link = linkFormat;
        context.code = codeFormat;
        context.blockDecorator = decoratorFormat;
    }
}

function stackLinkInternal(
    linkFormat: ContentModelLink,
    link?: 'linkDefault' | 'cloneFormat' | 'empty'
) {
    switch (link) {
        case 'linkDefault':
            return {
                format: {
                    underline: true,
                },
                dataset: {},
            };

        case 'empty':
            return {
                format: {},
                dataset: {},
            };

        case 'cloneFormat':
        default:
            return {
                dataset: linkFormat.dataset,
                format: { ...linkFormat.format },
            };
    }
}

function stackCodeInternal(codeFormat: ContentModelCode, code?: 'codeDefault' | 'empty') {
    switch (code) {
        case 'codeDefault':
            return {
                format: {
                    fontFamily: 'monospace',
                },
            };
        case 'empty':
            return {
                format: {},
            };
        default:
            return codeFormat;
    }
}

function stackDecoratorInternal(
    format: ContentModelParagraphDecorator,
    decorator?: 'decoratorDefault' | 'empty'
) {
    switch (decorator) {
        case 'empty':
            return {
                format: {},
                tagName: '',
            };
        default:
            return format;
    }
}

function stackFormatInternal<T extends ContentModelFormatBase>(
    format: T,
    processType?: 'shallowClone' | 'shallowCloneForBlock' | 'shallowCloneForGroup' | 'empty'
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
                    (processType == 'shallowCloneForGroup' &&
                        SkippedStylesForTable.indexOf(key as keyof ContentModelBlockFormat) >= 0)
                ) {
                    delete result[key];
                }
            });

            return result;
    }
}
