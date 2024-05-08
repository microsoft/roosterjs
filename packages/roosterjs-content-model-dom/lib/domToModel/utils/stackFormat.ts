import { createCodeDecorator } from '../../modelApi/creators/createCodeDecorator';
import { createFormatObject } from '../../modelApi/creators/createFormatObject';
import { createLinkDecorator } from '../../modelApi/creators/createLinkDecorator';
import { createParagraphDecorator } from '../../modelApi/creators/createParagraphDecorator';
import { getObjectKeys } from '../../domUtils/getObjectKeys';
import type {
    ContentModelBlockFormat,
    ContentModelBlockFormatCommon,
    ContentModelCode,
    ContentModelLink,
    ContentModelParagraphDecorator,
    ContentModelSegmentFormat,
    ContentModelSegmentFormatCommon,
    DomToModelContext,
    ReadonlyContentModelCode,
    ReadonlyContentModelLink,
    ReadonlyContentModelParagraphDecorator,
} from 'roosterjs-content-model-types';

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
const SkippedStylesForBlockOnSegmentOnSegment: (keyof ContentModelSegmentFormat)[] = [
    'backgroundColor',
];
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
    linkFormat: ReadonlyContentModelLink,
    link?: 'linkDefault' | 'cloneFormat' | 'empty'
): ContentModelLink {
    switch (link) {
        case 'linkDefault':
            return createLinkDecorator({
                underline: true,
            });

        case 'empty':
            return createLinkDecorator();

        case 'cloneFormat':
        default:
            return createLinkDecorator(linkFormat.format, linkFormat.dataset);
    }
}

function stackCodeInternal(
    codeFormat: ReadonlyContentModelCode,
    code?: 'codeDefault' | 'empty'
): ContentModelCode {
    switch (code) {
        case 'codeDefault':
            return createCodeDecorator({
                fontFamily: 'monospace',
            });
        case 'empty':
            return createCodeDecorator();
        default:
            return createCodeDecorator(codeFormat.format);
    }
}

function stackDecoratorInternal(
    format: ReadonlyContentModelParagraphDecorator,
    decorator?: 'decoratorDefault' | 'empty'
): ContentModelParagraphDecorator {
    switch (decorator) {
        case 'empty':
            return createParagraphDecorator('');
        default:
            return createParagraphDecorator(format.tagName, format.format);
    }
}

function stackFormatInternal<
    T extends ContentModelSegmentFormatCommon | ContentModelBlockFormatCommon
>(
    format: T,
    processType?: 'shallowClone' | 'shallowCloneForBlock' | 'shallowCloneForGroup' | 'empty'
): T {
    switch (processType) {
        case 'empty':
            return createFormatObject<T>();

        case undefined:
            return format;

        default:
            const result = { ...format };

            getObjectKeys(format).forEach(formatKey => {
                const key = formatKey as keyof (
                    | ContentModelSegmentFormatCommon
                    | ContentModelBlockFormatCommon
                );
                if (
                    (processType == 'shallowCloneForBlock' &&
                        SkippedStylesForBlockOnSegmentOnSegment.indexOf(key) >= 0) ||
                    (processType == 'shallowCloneForGroup' &&
                        SkippedStylesForTable.indexOf(key as keyof ContentModelBlockFormat) >= 0)
                ) {
                    delete result[key];
                }
            });

            if (processType == 'shallowClone' || processType == 'shallowCloneForGroup') {
                const blockFormat = format as ContentModelBlockFormat;

                // For a new paragraph, if current text indent is already applied to previous block in the same level,
                // we need to ignore it according to browser rendering behavior
                if (blockFormat.textIndent) {
                    delete (result as ContentModelBlockFormat).isTextIndentApplied;
                    blockFormat.isTextIndentApplied = true;
                }
            }

            return result;
    }
}
