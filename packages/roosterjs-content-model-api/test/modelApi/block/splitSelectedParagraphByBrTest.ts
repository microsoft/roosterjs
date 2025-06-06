import { splitSelectedParagraphByBr } from '../../../lib/modelApi/block/splitSelectedParagraphByBr';
import {
    createBr,
    createContentModelDocument,
    createParagraph,
    createText,
} from 'roosterjs-content-model-dom';

describe('splitSelectedParagraphByBr', () => {
    it('empty model', () => {
        const model = createContentModelDocument();
        splitSelectedParagraphByBr(model);
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [],
        });
    });

    it('model without selection', () => {
        const model = createContentModelDocument();
        const paragraph = createParagraph();
        const text = createText('text');

        paragraph.segments.push(text);
        model.blocks.push(paragraph);

        splitSelectedParagraphByBr(model);
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [text],
                    format: {},
                },
            ],
        });
    });

    it('model without br', () => {
        const model = createContentModelDocument();
        const paragraph = createParagraph();
        const text = createText('text');

        text.isSelected = true;

        paragraph.segments.push(text);
        model.blocks.push(paragraph);

        splitSelectedParagraphByBr(model);
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [text],
                    format: {},
                },
            ],
        });
    });

    it('model with br at the end', () => {
        const model = createContentModelDocument();
        const paragraph = createParagraph();
        const text = createText('text');
        const br = createBr();

        text.isSelected = true;

        paragraph.segments.push(text, br);
        model.blocks.push(paragraph);

        splitSelectedParagraphByBr(model);
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [text],
                    format: {},
                },
            ],
        });
    });

    it('model with br in middle', () => {
        const model = createContentModelDocument();
        const paragraph = createParagraph();
        const text1 = createText('text1');
        const text2 = createText('text2');
        const br = createBr();

        text1.isSelected = true;

        paragraph.segments.push(text1, br, text2);
        model.blocks.push(paragraph);

        splitSelectedParagraphByBr(model);
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [text1],
                    format: {},
                },
                {
                    blockType: 'Paragraph',
                    segments: [text2],
                    format: {},
                },
            ],
        });
    });

    it('model with br at beginning', () => {
        const model = createContentModelDocument();
        const paragraph = createParagraph();
        const text1 = createText('text1');
        const br = createBr();

        text1.isSelected = true;

        paragraph.segments.push(br, text1);
        model.blocks.push(paragraph);

        splitSelectedParagraphByBr(model);
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [br],
                    format: {},
                },
                {
                    blockType: 'Paragraph',
                    segments: [text1],
                    format: {},
                },
            ],
        });
    });

    it('model with br only', () => {
        const model = createContentModelDocument();
        const paragraph = createParagraph();
        const br = createBr();

        br.isSelected = true;

        paragraph.segments.push(br);
        model.blocks.push(paragraph);

        splitSelectedParagraphByBr(model);
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [br],
                    format: {},
                },
            ],
        });
    });

    it('model with continuous br', () => {
        const model = createContentModelDocument();
        const paragraph = createParagraph();
        const text1 = createText('text1');
        const br1 = createBr();
        const br2 = createBr();
        const br3 = createBr();
        const text2 = createText('text2');

        text1.isSelected = true;

        paragraph.segments.push(text1, br1, br2, br3, text2);
        model.blocks.push(paragraph);

        splitSelectedParagraphByBr(model);
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [text1],
                    format: {},
                },
                {
                    blockType: 'Paragraph',
                    segments: [br2],
                    format: {},
                },
                {
                    blockType: 'Paragraph',
                    segments: [br3],
                    format: {},
                },
                {
                    blockType: 'Paragraph',
                    segments: [text2],
                    format: {},
                },
            ],
        });
    });

    it('model with separated br', () => {
        const model = createContentModelDocument();
        const paragraph = createParagraph();
        const text1 = createText('text1');
        const text2 = createText('text2');
        const text3 = createText('text3');
        const br1 = createBr();
        const br2 = createBr();

        text1.isSelected = true;

        paragraph.segments.push(text1, br1, text2, br2, text3);
        model.blocks.push(paragraph);

        splitSelectedParagraphByBr(model);
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [text1],
                    format: {},
                },
                {
                    blockType: 'Paragraph',
                    segments: [text2],
                    format: {},
                },
                {
                    blockType: 'Paragraph',
                    segments: [text3],
                    format: {},
                },
            ],
        });
    });

    it('paragraph with format and decorator', () => {
        const model = createContentModelDocument();
        const paragraph = createParagraph(
            false,
            { borderTop: 'test' },
            { textColor: 'red' },
            {
                tagName: 'p',
                format: {},
            }
        );
        const text1 = createText('text1');
        const text2 = createText('text2');
        const br = createBr();

        text1.isSelected = true;

        paragraph.segments.push(text1, br, text2);
        model.blocks.push(paragraph);

        splitSelectedParagraphByBr(model);
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [text1],
                    format: { borderTop: 'test' },
                    segmentFormat: { textColor: 'red' },
                    decorator: {
                        tagName: 'p',
                        format: {},
                    },
                },
                {
                    blockType: 'Paragraph',
                    segments: [text2],
                    format: { borderTop: 'test' },
                    segmentFormat: { textColor: 'red' },
                    decorator: {
                        tagName: 'p',
                        format: {},
                    },
                },
            ],
        });
    });

    it('implicit paragraph', () => {
        const model = createContentModelDocument();
        const paragraph = createParagraph(true);
        const text1 = createText('text1');
        const text2 = createText('text2');
        const br = createBr();

        text1.isSelected = true;

        paragraph.segments.push(text1, br, text2);
        model.blocks.push(paragraph);

        splitSelectedParagraphByBr(model);
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [text1],
                    format: {},
                },
                {
                    blockType: 'Paragraph',
                    segments: [text2],
                    format: {},
                },
            ],
        });
    });

    it('mulitple paragraphs', () => {
        const model = createContentModelDocument();
        const paragraph1 = createParagraph();
        const paragraph2 = createParagraph();
        const text1 = createText('text1');
        const text2 = createText('text2');
        const text3 = createText('text3');
        const text4 = createText('text4');
        const br1 = createBr();
        const br2 = createBr();

        text2.isSelected = true;
        text3.isSelected = true;

        paragraph1.segments.push(text1, br1, text2);
        paragraph2.segments.push(text3, br2, text4);
        model.blocks.push(paragraph1, paragraph2);

        splitSelectedParagraphByBr(model);
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [text1],
                    format: {},
                },
                {
                    blockType: 'Paragraph',
                    segments: [text2],
                    format: {},
                },
                {
                    blockType: 'Paragraph',
                    segments: [text3],
                    format: {},
                },
                {
                    blockType: 'Paragraph',
                    segments: [text4],
                    format: {},
                },
            ],
        });
    });

    it('complex model with cache', () => {
        const mockedCache = 'CACHE' as any;

        const model = createContentModelDocument();
        const paragraph1 = createParagraph();
        const paragraph2 = createParagraph(true);
        const paragraph3 = createParagraph();
        const paragraph4 = createParagraph();
        const paragraph5 = createParagraph(true);
        const paragraph6 = createParagraph();
        const paragraph7 = createParagraph();

        const text1_1 = createText('text1_1');
        const text2_1 = createText('text2_1');
        const text2_2 = createText('text2_2');
        const text2_3 = createText('text2_3');
        const text2_4 = createText('text2_4');
        const text3_1 = createText('text3_1');
        const text4_1 = createText('text4_1');
        const text5_1 = createText('text5_1');
        const text5_2 = createText('text5_2');
        const text5_3 = createText('text5_3');
        const text6_1 = createText('text6_1');

        const br2_1 = createBr();
        const br2_2 = createBr();
        const br2_3 = createBr();
        const br5_1 = createBr();
        const br5_2 = createBr();
        const br7_1 = createBr();

        text2_3.isSelected = true;
        text2_4.isSelected = true;
        text3_1.isSelected = true;
        text4_1.isSelected = true;
        text5_1.isSelected = true;
        text5_2.isSelected = true;

        paragraph1.segments.push(text1_1);
        paragraph2.segments.push(text2_1, br2_1, text2_2, br2_2, text2_3, br2_3, text2_4);
        paragraph3.segments.push(text3_1);
        paragraph4.segments.push(text4_1);
        paragraph5.segments.push(text5_1, br5_1, text5_2, br5_2, text5_3);
        paragraph6.segments.push(text6_1);
        paragraph7.segments.push(br7_1);

        paragraph1.cachedElement = mockedCache;
        paragraph2.cachedElement = mockedCache;
        paragraph3.cachedElement = mockedCache;
        paragraph4.cachedElement = mockedCache;
        paragraph5.cachedElement = mockedCache;
        paragraph6.cachedElement = mockedCache;
        paragraph7.cachedElement = mockedCache;

        model.blocks.push(
            paragraph1,
            paragraph2,
            paragraph3,
            paragraph4,
            paragraph5,
            paragraph6,
            paragraph7
        );

        splitSelectedParagraphByBr(model);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [text1_1],
                    format: {},
                    cachedElement: mockedCache,
                },
                {
                    blockType: 'Paragraph',
                    segments: [text2_1],
                    format: {},
                },
                {
                    blockType: 'Paragraph',
                    segments: [text2_2],
                    format: {},
                },
                {
                    blockType: 'Paragraph',
                    segments: [text2_3],
                    format: {},
                },
                {
                    blockType: 'Paragraph',
                    segments: [text2_4],
                    format: {},
                },
                {
                    blockType: 'Paragraph',
                    segments: [text3_1],
                    format: {},
                },
                {
                    blockType: 'Paragraph',
                    segments: [text4_1],
                    format: {},
                },
                {
                    blockType: 'Paragraph',
                    segments: [text5_1],
                    format: {},
                },
                {
                    blockType: 'Paragraph',
                    segments: [text5_2],
                    format: {},
                },
                {
                    blockType: 'Paragraph',
                    segments: [text5_3],
                    format: {},
                },
                {
                    blockType: 'Paragraph',
                    segments: [text6_1],
                    format: {},
                    cachedElement: mockedCache,
                },
                {
                    blockType: 'Paragraph',
                    segments: [br7_1],
                    format: {},
                    cachedElement: mockedCache,
                },
            ],
        });
    });
});
