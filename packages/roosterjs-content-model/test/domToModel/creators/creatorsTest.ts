import { ContentModelBlockGroupType } from '../../../lib/publicTypes/enum/BlockGroupType';
import { ContentModelBlockType } from '../../../lib/publicTypes/enum/BlockType';
import { ContentModelSegmentType } from '../../../lib/publicTypes/enum/SegmentType';
import { createContentModelDocument } from '../../../lib/domToModel/creators/createContentModelDocument';
import { createGeneralBlock } from '../../../lib/domToModel/creators/createGeneralBlock';
import { createGeneralSegment } from '../../../lib/domToModel/creators/createGeneralSegment';
import { createParagraph } from '../../../lib/domToModel/creators/createParagraph';
import { createText } from '../../../lib/domToModel/creators/createText';

describe('Creators', () => {
    it('createContentModelDocument', () => {
        const result = createContentModelDocument(document);

        expect(result).toEqual({
            blockType: ContentModelBlockType.BlockGroup,
            blockGroupType: ContentModelBlockGroupType.Document,
            blocks: [],
            document: document,
        });
    });

    it('createGeneralBlock', () => {
        const element = document.createElement('div');
        const result = createGeneralBlock(element);

        expect(result).toEqual({
            blockType: ContentModelBlockType.BlockGroup,
            blockGroupType: ContentModelBlockGroupType.General,
            element: element,
            blocks: [],
        });
    });

    it('createGeneralSegment', () => {
        const element = document.createElement('div');
        const result = createGeneralSegment(element);

        expect(result).toEqual({
            segmentType: ContentModelSegmentType.General,
            blocks: [],
            element: element,
            blockType: ContentModelBlockType.BlockGroup,
            blockGroupType: ContentModelBlockGroupType.General,
        });
    });

    it('createParagraph - not dummy block', () => {
        const result = createParagraph(false);

        expect(result).toEqual({
            blockType: ContentModelBlockType.Paragraph,
            segments: [],
        });
    });

    it('createParagraph - dummy block', () => {
        const result = createParagraph(true);

        expect(result).toEqual({
            blockType: ContentModelBlockType.Paragraph,
            segments: [],
            isImplicit: true,
        });
    });

    it('createText', () => {
        const text = 'test';
        const result = createText(text);

        expect(result).toEqual({
            segmentType: ContentModelSegmentType.Text,
            text: text,
        });
    });
});
