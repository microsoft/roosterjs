import * as splitSelectedParagraphByBrModule from '../../../lib/modelApi/block/splitSelectedParagraphByBr';
import { toggleModelBlockQuote } from '../../../lib/modelApi/block/toggleModelBlockQuote';
import {
    createContentModelDocument,
    createFormatContainer,
    createListItem,
    createParagraph,
    createText,
} from 'roosterjs-content-model-dom';

describe('toggleModelBlockQuote', () => {
    let splitSelectedParagraphByBrSpy: jasmine.Spy;

    beforeEach(() => {
        splitSelectedParagraphByBrSpy = spyOn(
            splitSelectedParagraphByBrModule,
            'splitSelectedParagraphByBr'
        ).and.callThrough();
    });

    it('empty model', () => {
        const doc = createContentModelDocument();

        toggleModelBlockQuote(doc, {}, {});

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [],
        });
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledTimes(1);
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledWith(doc);
    });

    it('no selection', () => {
        const doc = createContentModelDocument();
        const para = createParagraph();
        const text = createText('test');

        para.segments.push(text);
        doc.blocks.push(para);

        toggleModelBlockQuote(doc, {}, {});

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: {},
                        },
                    ],
                },
            ],
        });
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledTimes(1);
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledWith(doc);
    });

    it('Has single selection, wrap', () => {
        const doc = createContentModelDocument();
        const para = createParagraph();
        const text = createText('test');

        para.segments.push(text);
        doc.blocks.push(para);
        text.isSelected = true;

        toggleModelBlockQuote(doc, {}, {});

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'FormatContainer',
                    tagName: 'blockquote',
                    format: {},
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            format: {},
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test',
                                    format: {},
                                    isSelected: true,
                                },
                            ],
                        },
                    ],
                },
            ],
        });
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledTimes(1);
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledWith(doc);
    });

    it('Has multiple selection, wrap together', () => {
        const doc = createContentModelDocument();
        const para1 = createParagraph();
        const text1 = createText('test1');
        const para2 = createParagraph();
        const text2 = createText('test2');

        para1.segments.push(text1);
        para2.segments.push(text2);
        doc.blocks.push(para1);
        doc.blocks.push(para2);
        text1.isSelected = true;
        text2.isSelected = true;

        toggleModelBlockQuote(doc, {}, {});

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'FormatContainer',
                    tagName: 'blockquote',
                    format: {},
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            format: {},
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test1',
                                    format: {},
                                    isSelected: true,
                                },
                            ],
                        },
                        {
                            blockType: 'Paragraph',
                            format: {},
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test2',
                                    format: {},
                                    isSelected: true,
                                },
                            ],
                        },
                    ],
                },
            ],
        });
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledTimes(1);
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledWith(doc);
    });

    it('Has multiple selection, with RTL, do not merge', () => {
        const doc = createContentModelDocument();
        const para1 = createParagraph();
        const text1 = createText('test1');
        const para2 = createParagraph();
        const text2 = createText('test2');
        const para3 = createParagraph();
        const text3 = createText('test3');

        para1.segments.push(text1);
        para2.segments.push(text2);
        para3.segments.push(text3);

        para2.format.direction = 'rtl';

        doc.blocks.push(para1, para2, para3);
        text1.isSelected = true;
        text2.isSelected = true;
        text3.isSelected = true;

        toggleModelBlockQuote(doc, {}, { direction: 'rtl' });

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'FormatContainer',
                    tagName: 'blockquote',
                    format: {},
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            format: {},
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test1',
                                    format: {},
                                    isSelected: true,
                                },
                            ],
                        },
                    ],
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'FormatContainer',
                    tagName: 'blockquote',
                    format: {
                        direction: 'rtl',
                    },
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            format: {
                                direction: 'rtl',
                            },
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test2',
                                    format: {},
                                    isSelected: true,
                                },
                            ],
                        },
                    ],
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'FormatContainer',
                    tagName: 'blockquote',
                    format: {},
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            format: {},
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test3',
                                    format: {},
                                    isSelected: true,
                                },
                            ],
                        },
                    ],
                },
            ],
        });
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledTimes(1);
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledWith(doc);
    });

    it('Has single selection, merge before', () => {
        const doc = createContentModelDocument();
        const para1 = createParagraph();
        const text1 = createText('test1');
        const para2 = createParagraph();
        const text2 = createText('test2');
        const quote = createFormatContainer('blockquote');

        para1.segments.push(text1);
        para2.segments.push(text2);
        quote.blocks.push(para1);
        doc.blocks.push(quote);
        doc.blocks.push(para2);
        text2.isSelected = true;

        toggleModelBlockQuote(doc, {}, {});

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'FormatContainer',
                    tagName: 'blockquote',
                    format: {},
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            format: {},
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test1',
                                    format: {},
                                },
                            ],
                        },
                        {
                            blockType: 'Paragraph',
                            format: {},
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test2',
                                    format: {},
                                    isSelected: true,
                                },
                            ],
                        },
                    ],
                },
            ],
        });
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledTimes(1);
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledWith(doc);
    });

    it('Has single selection, merge after', () => {
        const doc = createContentModelDocument();
        const para1 = createParagraph();
        const text1 = createText('test1');
        const para2 = createParagraph();
        const text2 = createText('test2');
        const quote = createFormatContainer('blockquote');

        para1.segments.push(text1);
        para2.segments.push(text2);
        quote.blocks.push(para2);
        doc.blocks.push(para1);
        doc.blocks.push(quote);
        text1.isSelected = true;

        toggleModelBlockQuote(doc, {}, {});

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'FormatContainer',
                    tagName: 'blockquote',
                    format: {},
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            format: {},
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test1',
                                    format: {},
                                    isSelected: true,
                                },
                            ],
                        },
                        {
                            blockType: 'Paragraph',
                            format: {},
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test2',
                                    format: {},
                                },
                            ],
                        },
                    ],
                },
            ],
        });
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledTimes(1);
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledWith(doc);
    });

    it('Has single selection, merge both', () => {
        const doc = createContentModelDocument();
        const para1 = createParagraph();
        const text1 = createText('test1');
        const para2 = createParagraph();
        const text2 = createText('test2');
        const para3 = createParagraph();
        const text3 = createText('test3');
        const quote1 = createFormatContainer('blockquote');
        const quote3 = createFormatContainer('blockquote');

        para1.segments.push(text1);
        para2.segments.push(text2);
        para3.segments.push(text3);
        quote1.blocks.push(para1);
        quote3.blocks.push(para3);
        doc.blocks.push(quote1);
        doc.blocks.push(para2);
        doc.blocks.push(quote3);
        text2.isSelected = true;

        toggleModelBlockQuote(doc, {}, {});

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'FormatContainer',
                    tagName: 'blockquote',
                    format: {},
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            format: {},
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test1',
                                    format: {},
                                },
                            ],
                        },
                        {
                            blockType: 'Paragraph',
                            format: {},
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test2',
                                    format: {},
                                    isSelected: true,
                                },
                            ],
                        },
                        {
                            blockType: 'Paragraph',
                            format: {},
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test3',
                                    format: {},
                                },
                            ],
                        },
                    ],
                },
            ],
        });
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledTimes(1);
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledWith(doc);
    });

    it('Has single selection, cannot merge', () => {
        const doc = createContentModelDocument();
        const para1 = createParagraph();
        const text1 = createText('test1');
        const para2 = createParagraph();
        const text2 = createText('test2');
        const para3 = createParagraph();
        const text3 = createText('test3');
        const quote1 = createFormatContainer('blockquote', { backgroundColor: 'red' });
        const quote3 = createFormatContainer('blockquote', { backgroundColor: 'red' });

        para1.segments.push(text1);
        para2.segments.push(text2);
        para3.segments.push(text3);
        quote1.blocks.push(para1);
        quote3.blocks.push(para3);
        doc.blocks.push(quote1);
        doc.blocks.push(para2);
        doc.blocks.push(quote3);
        text2.isSelected = true;

        toggleModelBlockQuote(doc, {}, {});

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'FormatContainer',
                    tagName: 'blockquote',
                    format: { backgroundColor: 'red' },
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            format: {},
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test1',
                                    format: {},
                                },
                            ],
                        },
                    ],
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'FormatContainer',
                    tagName: 'blockquote',
                    format: {},
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            format: {},
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test2',
                                    format: {},
                                    isSelected: true,
                                },
                            ],
                        },
                    ],
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'FormatContainer',
                    tagName: 'blockquote',
                    format: { backgroundColor: 'red' },
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            format: {},
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test3',
                                    format: {},
                                },
                            ],
                        },
                    ],
                },
            ],
        });
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledTimes(1);
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledWith(doc);
    });

    it('Has mixed selection', () => {
        const doc = createContentModelDocument();
        const para1 = createParagraph();
        const text1 = createText('test1');
        const para2 = createParagraph();
        const text2 = createText('test2');
        const para3 = createParagraph();
        const text3 = createText('test3');
        const para4 = createParagraph();
        const text4 = createText('test4');
        const quote2 = createFormatContainer('blockquote');

        para1.segments.push(text1);
        para2.segments.push(text2);
        para3.segments.push(text3);
        para4.segments.push(text4);
        quote2.blocks.push(para2);
        doc.blocks.push(para1);
        doc.blocks.push(quote2);
        doc.blocks.push(para3);
        doc.blocks.push(para4);

        text1.isSelected = true;
        text2.isSelected = true;
        text3.isSelected = true;

        toggleModelBlockQuote(doc, {}, {});

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'FormatContainer',
                    tagName: 'blockquote',
                    format: {},
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            format: {},
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test1',
                                    format: {},
                                    isSelected: true,
                                },
                            ],
                        },
                        {
                            blockType: 'Paragraph',
                            format: {},
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test2',
                                    format: {},
                                    isSelected: true,
                                },
                            ],
                        },
                        {
                            blockType: 'Paragraph',
                            format: {},
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test3',
                                    format: {},
                                    isSelected: true,
                                },
                            ],
                        },
                    ],
                },
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test4',
                            format: {},
                        },
                    ],
                },
            ],
        });
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledTimes(1);
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledWith(doc);
    });

    it('Has selection under list', () => {
        const doc = createContentModelDocument();
        const list1 = createListItem([]);
        const para1 = createParagraph();
        const text1 = createText('test1');

        para1.segments.push(text1);
        list1.blocks.push(para1);
        doc.blocks.push(list1);

        text1.isSelected = true;

        toggleModelBlockQuote(doc, {}, {});

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'FormatContainer',
                    tagName: 'blockquote',
                    blocks: [
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [
                                        {
                                            segmentType: 'Text',
                                            text: 'test1',
                                            format: {},
                                            isSelected: true,
                                        },
                                    ],
                                    format: {},
                                },
                            ],
                            levels: [],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: {},
                            },
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
        });
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledTimes(1);
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledWith(doc);
    });

    it('Unwrap', () => {
        const doc = createContentModelDocument();
        const list1 = createListItem([]);
        const para1 = createParagraph();
        const text1 = createText('test1');
        const para2 = createParagraph();
        const text2 = createText('test2');
        const quote1 = createFormatContainer('blockquote');
        const quote2 = createFormatContainer('blockquote');

        para1.segments.push(text1);
        para2.segments.push(text2);
        quote1.blocks.push(para1);
        quote2.blocks.push(para2);
        list1.blocks.push(quote1);
        doc.blocks.push(list1);
        doc.blocks.push(quote2);

        text1.isSelected = true;
        text2.isSelected = true;

        toggleModelBlockQuote(doc, {}, {});

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test1',
                                    format: {},
                                    isSelected: true,
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    format: {},
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test2',
                            format: {},
                            isSelected: true,
                        },
                    ],
                    format: {},
                },
            ],
        });
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledTimes(1);
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledWith(doc);
    });

    it('Unwrap quote with multiple paragraphs', () => {
        const doc = createContentModelDocument();
        const para1 = createParagraph();
        const text1 = createText('test1');
        const para2 = createParagraph();
        const text2 = createText('test2');
        const quote1 = createFormatContainer('blockquote');

        para1.segments.push(text1);
        para2.segments.push(text2);
        quote1.blocks.push(para1);
        quote1.blocks.push(para2);
        doc.blocks.push(quote1);

        text2.isSelected = true;

        toggleModelBlockQuote(doc, {}, {});

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test1',
                            format: {},
                        },
                    ],
                    format: {},
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test2',
                            format: {},
                            isSelected: true,
                        },
                    ],
                    format: {},
                },
            ],
        });
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledTimes(1);
        expect(splitSelectedParagraphByBrSpy).toHaveBeenCalledWith(doc);
    });
});
