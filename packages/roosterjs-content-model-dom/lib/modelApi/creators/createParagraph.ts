import { createParagraphDecorator } from './createParagraphDecorator';
import { internalConvertToMutableType } from './internalConvertToMutableType';
import type {
    ContentModelParagraph,
    ReadonlyContentModelBlockFormat,
    ReadonlyContentModelParagraph,
    ReadonlyContentModelParagraphDecorator,
    ReadonlyContentModelSegmentFormat,
} from 'roosterjs-content-model-types';

/**
 * Create a ContentModelParagraph model
 * @param isImplicit @optional Whether this is an implicit paragraph. An implicit paragraph is a paragraph that will not render with DOM element container
 * @param blockFormat @optional Format of this paragraph
 * @param segmentFormat @optional Segment format applied to this block
 * @param decorator @optional Decorator of this paragraph
 */
export function createParagraph(
    isImplicit?: boolean,
    blockFormat?: ReadonlyContentModelBlockFormat,
    segmentFormat?: ReadonlyContentModelSegmentFormat,
    decorator?: ReadonlyContentModelParagraphDecorator
): ContentModelParagraph {
    const result: ReadonlyContentModelParagraph = Object.assign(
        <ReadonlyContentModelParagraph>{
            blockType: 'Paragraph',
            segments: [],
            format: { ...blockFormat },
        },

        segmentFormat && Object.keys(segmentFormat).length > 0
            ? { segmentFormat: { ...segmentFormat } }
            : undefined,
        isImplicit ? { isImplicit: true } : undefined,
        decorator
            ? { decorator: createParagraphDecorator(decorator.tagName, decorator.format) }
            : undefined
    );

    return internalConvertToMutableType(result);
}
