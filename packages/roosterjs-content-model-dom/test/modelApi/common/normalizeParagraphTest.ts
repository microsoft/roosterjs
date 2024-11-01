import { createBr } from '../../../lib/modelApi/creators/createBr';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createImage } from '../../../lib/modelApi/creators/createImage';
import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';
import { createSelectionMarker } from '../../../lib/modelApi/creators/createSelectionMarker';
import { createText } from '../../../lib/modelApi/creators/createText';
import { normalizeContentModel } from '../../../lib/modelApi/common/normalizeContentModel';
import { normalizeParagraph } from '../../../lib/modelApi/common/normalizeParagraph';
import {
    ContentModelParagraph,
    ContentModelSegment,
    ContentModelSegmentFormat,
    ReadonlyContentModelParagraph,
} from 'roosterjs-content-model-types';

describe('Normalize text that contains space', () => {
    function runTest(texts: string[], expected: string[], whiteSpace?: string) {
        const model = createContentModelDocument();
        const para = createParagraph();

        texts.forEach(t => {
            para.segments.push(t ? createText(t) : createSelectionMarker());
        });

        if (whiteSpace) {
            para.format.whiteSpace = whiteSpace;
        }

        model.blocks.push(para);
        normalizeContentModel(model);

        const result = para.segments.map(s => (s.segmentType == 'Text' ? s.text : ''));

        expect(result).toEqual(expected);
    }

    it('Text without space', () => {
        runTest(['a', '', 'b'], ['a', '', 'b']);
    });

    it('Text with space', () => {
        runTest([' a ', '', ' b '], ['a ', '', 'b']);
    });

    it('Text with space in middle', () => {
        runTest([' a   b '], ['a   b']);
    });

    it('Only first text with space', () => {
        runTest([' a ', '', 'b'], ['a ', '', 'b']);
    });

    it('Only second text with space', () => {
        runTest(['a', '', '  b '], ['a', '', '\u00A0b']);
    });

    it('Text with multiple spaces', () => {
        runTest(['   a   ', '', '   b   '], ['a ', '', 'b']);
    });

    it('Text with &nbsp;', () => {
        runTest(['\u00A0a\u00A0', '', '\u00A0b\u00A0'], ['\u00A0a ', '', '\u00A0b\u00A0']);
    });

    it('Text with &nbsp; and space', () => {
        runTest(
            [' \u00A0 a \u00A0 ', '', ' \u00A0 b \u00A0 '],
            ['\u00A0 a \u00A0 ', '', '\u00A0 b \u00A0']
        );
    });

    it('Text with multiple spaces and whitespace=pre', () => {
        runTest(['   a   ', '', '   b   '], ['   a   ', '', '   b   '], 'pre');
    });

    it('Text ends with &nbsp;', () => {
        runTest(['a\u00A0', 'b'], ['a b']);
        runTest(['a\u00A0\u00A0', 'b'], ['a\u00A0 b']);
        runTest(['a \u00A0', 'b'], ['a \u00A0b']);
    });

    it('with other type of segment', () => {
        const model = createContentModelDocument();
        const para = createParagraph();

        para.segments.push(createText('  a  '), createImage('test'), createText('  b  '));
        model.blocks.push(para);

        normalizeContentModel(model);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'a ',
                            format: {},
                        },
                        {
                            segmentType: 'Image',
                            format: {},
                            src: 'test',
                            dataset: {},
                        },
                        {
                            segmentType: 'Text',
                            text: '\u00A0b',
                            format: {},
                        },
                    ],
                },
            ],
        });
    });

    it('with BR', () => {
        const model = createContentModelDocument();
        const para = createParagraph();

        para.segments.push(createText('  a  '), createBr(), createText('  b  '));
        model.blocks.push(para);

        normalizeContentModel(model);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'a',
                            format: {},
                        },
                        {
                            segmentType: 'Br',
                            format: {},
                        },
                        {
                            segmentType: 'Text',
                            text: 'b',
                            format: {},
                        },
                    ],
                },
            ],
        });
    });

    it('Remove empty', () => {
        const model = createContentModelDocument();
        const para = createParagraph();

        para.segments.push(createText('  a  '), createText(''), createText('  b  '));
        model.blocks.push(para);

        normalizeContentModel(model);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'a \u00A0b',
                            format: {},
                        },
                    ],
                },
            ],
        });
    });

    it('Add Br for empty paragraph', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const marker = createSelectionMarker();

        para.segments.push(marker);
        model.blocks.push(para);

        normalizeContentModel(model);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: true,
                        },
                        {
                            segmentType: 'Br',
                            format: {},
                        },
                    ],
                },
            ],
        });
    });

    it('Add Br after Br', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const br = createBr();
        const marker = createSelectionMarker();

        para.segments.push(br, marker);
        model.blocks.push(para);

        normalizeContentModel(model);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Br',
                            format: {},
                        },
                        {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: true,
                        },
                        {
                            segmentType: 'Br',
                            format: {},
                        },
                    ],
                },
            ],
        });
    });

    it('Do not add Br after text', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const br = createBr();
        const text = createText('test');
        const marker = createSelectionMarker();

        para.segments.push(br, text, marker);
        model.blocks.push(para);

        normalizeContentModel(model);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Br',
                            format: {},
                        },
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'test',
                        },
                        {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: true,
                        },
                    ],
                },
            ],
        });
    });

    it('Remove last space after image', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const image = createImage('test');
        const text = createText('  ');

        para.segments.push(image, text);
        model.blocks.push(para);

        normalizeContentModel(model);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Image',
                            src: 'test',
                            dataset: {},
                            format: {},
                        },
                    ],
                },
            ],
        });
    });

    it('Remove empty links', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const marker = createSelectionMarker();
        const text = createText('test');
        marker.link = {
            dataset: {},
            format: {},
        };

        para.segments.push(text, marker);
        model.blocks.push(para);

        normalizeContentModel(model);

        expect(model).toEqual({
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
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                    ],
                },
            ],
        });
    });
});

describe('Normalize paragraph with segmentFormat', () => {
    it('Empty paragraph', () => {
        const paragraph = createParagraph();

        normalizeParagraph(paragraph as ReadonlyContentModelParagraph);

        expect(paragraph).toEqual({
            blockType: 'Paragraph',
            segments: [],
            format: {},
        });
    });

    it('Single text segment', () => {
        const paragraph = createParagraph();
        const text = createText('test', {
            fontFamily: 'Arial',
        });

        paragraph.segments.push(text);

        normalizeParagraph(paragraph as ReadonlyContentModelParagraph);

        expect(paragraph).toEqual({
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'Text',
                    format: { fontFamily: 'Arial' },
                    text: 'test',
                },
            ],
            format: {},
            segmentFormat: { fontFamily: 'Arial' },
        });
    });

    it('text + selection marker + text', () => {
        const paragraph = createParagraph();
        const text1 = createText('test1', {
            fontFamily: 'Arial',
        });
        const text2 = createText('test2', {
            fontFamily: 'Arial',
        });
        const marker = createSelectionMarker();

        paragraph.segments.push(text1, marker, text2);

        normalizeParagraph(paragraph as ReadonlyContentModelParagraph);

        expect(paragraph).toEqual({
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'Text',
                    format: { fontFamily: 'Arial' },
                    text: 'test1',
                },
                {
                    segmentType: 'SelectionMarker',
                    format: {},
                    isSelected: true,
                },
                {
                    segmentType: 'Text',
                    format: { fontFamily: 'Arial' },
                    text: 'test2',
                },
            ],
            format: {},
            segmentFormat: { fontFamily: 'Arial' },
        });
    });

    it('text + selection marker + text, formats are different', () => {
        const paragraph = createParagraph();
        const text1 = createText('test1', {
            fontFamily: 'Arial',
        });
        const text2 = createText('test2', {
            fontFamily: 'Tahoma',
        });
        const marker = createSelectionMarker();

        paragraph.segments.push(text1, marker, text2);

        normalizeParagraph(paragraph as ReadonlyContentModelParagraph);

        expect(paragraph).toEqual({
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'Text',
                    format: { fontFamily: 'Arial' },
                    text: 'test1',
                },
                {
                    segmentType: 'SelectionMarker',
                    format: {},
                    isSelected: true,
                },
                {
                    segmentType: 'Text',
                    format: { fontFamily: 'Tahoma' },
                    text: 'test2',
                },
            ],
            format: {},
        });
    });

    it('text + selection marker + text, formats are partially different', () => {
        const paragraph = createParagraph();
        const text1 = createText('test1', {
            fontFamily: 'Arial',
            fontSize: '10px',
        });
        const text2 = createText('test2', {
            fontFamily: 'Tahoma',
            fontSize: '10px',
        });
        const marker = createSelectionMarker();

        paragraph.segments.push(text1, marker, text2);

        normalizeParagraph(paragraph as ReadonlyContentModelParagraph);

        expect(paragraph).toEqual({
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'Text',
                    format: { fontFamily: 'Arial', fontSize: '10px' },
                    text: 'test1',
                },
                {
                    segmentType: 'SelectionMarker',
                    format: {},
                    isSelected: true,
                },
                {
                    segmentType: 'Text',
                    format: { fontFamily: 'Tahoma', fontSize: '10px' },
                    text: 'test2',
                },
            ],
            format: {},
            segmentFormat: { fontSize: '10px' },
        });
    });
});

describe('Move up format', () => {
    const mockedCache = {} as any;

    it('No format', () => {
        const para = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test2');

        para.segments.push(text1, text2);
        para.cachedElement = mockedCache;

        normalizeParagraph(para);

        expect(para).toEqual({
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'Text',
                    text: 'test1test2',
                    format: {},
                },
            ],
            format: {},
        });
    });

    it('All segments have the same format', () => {
        const para = createParagraph();
        const text1 = createText('test1', {
            fontFamily: 'Calibri',
            fontSize: '10pt',
            textColor: 'red',
            italic: false,
        });
        const text2 = createText('test2', {
            fontFamily: 'Calibri',
            fontSize: '10pt',
            textColor: 'red',
            italic: true,
        });

        para.segments.push(text1, text2);
        para.cachedElement = mockedCache;

        normalizeParagraph(para);

        expect(para).toEqual({
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'Text',
                    text: 'test1',
                    format: {
                        fontFamily: 'Calibri',
                        fontSize: '10pt',
                        textColor: 'red',
                        italic: false,
                    },
                },
                {
                    segmentType: 'Text',
                    text: 'test2',
                    format: {
                        fontFamily: 'Calibri',
                        fontSize: '10pt',
                        textColor: 'red',
                        italic: true,
                    },
                },
            ],
            format: {},
            segmentFormat: {
                fontFamily: 'Calibri',
                fontSize: '10pt',
                textColor: 'red',
            },
        });
    });

    it('All segments have the same format, paragraph has different format', () => {
        const para = createParagraph(false, undefined, {
            fontFamily: 'Arial',
            fontSize: '12pt',
            textColor: 'green',
        });
        const text1 = createText('test1', {
            fontFamily: 'Calibri',
            fontSize: '10pt',
            textColor: 'red',
            italic: false,
        });
        const text2 = createText('test2', {
            fontFamily: 'Calibri',
            fontSize: '10pt',
            textColor: 'red',
            italic: true,
        });

        para.segments.push(text1, text2);
        para.cachedElement = mockedCache;

        normalizeParagraph(para);

        expect(para).toEqual({
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'Text',
                    text: 'test1',
                    format: {
                        fontFamily: 'Calibri',
                        fontSize: '10pt',
                        textColor: 'red',
                        italic: false,
                    },
                },
                {
                    segmentType: 'Text',
                    text: 'test2',
                    format: {
                        fontFamily: 'Calibri',
                        fontSize: '10pt',
                        textColor: 'red',
                        italic: true,
                    },
                },
            ],
            format: {},
            segmentFormat: {
                fontFamily: 'Calibri',
                fontSize: '10pt',
                textColor: 'red',
            },
        });
    });

    it('Some format are different', () => {
        const para = createParagraph();
        const text1 = createText('test1', {
            fontFamily: 'Calibri',
            fontSize: '10pt',
            textColor: 'red',
            italic: false,
        });
        const text2 = createText('test2', {
            fontFamily: 'Calibri',
            fontSize: '12pt',
            textColor: 'red',
            italic: true,
        });

        para.segments.push(text1, text2);
        para.cachedElement = mockedCache;

        normalizeParagraph(para);

        expect(para).toEqual({
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'Text',
                    text: 'test1',
                    format: {
                        fontFamily: 'Calibri',
                        fontSize: '10pt',
                        textColor: 'red',
                        italic: false,
                    },
                },
                {
                    segmentType: 'Text',
                    text: 'test2',
                    format: {
                        fontFamily: 'Calibri',
                        fontSize: '12pt',
                        textColor: 'red',
                        italic: true,
                    },
                },
            ],
            format: {},
            segmentFormat: { fontFamily: 'Calibri', textColor: 'red' },
        });
    });

    it('All formats are different', () => {
        const para = createParagraph();
        const text1 = createText('test1', {
            fontFamily: 'Calibri',
            fontSize: '10pt',
            textColor: 'red',
            italic: false,
        });
        const text2 = createText('test2', {
            fontFamily: 'Arial',
            fontSize: '12pt',
            textColor: 'green',
            italic: true,
        });

        para.segments.push(text1, text2);
        para.cachedElement = mockedCache;

        normalizeParagraph(para);

        expect(para).toEqual({
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'Text',
                    text: 'test1',
                    format: {
                        fontFamily: 'Calibri',
                        fontSize: '10pt',
                        textColor: 'red',
                        italic: false,
                    },
                },
                {
                    segmentType: 'Text',
                    text: 'test2',
                    format: {
                        fontFamily: 'Arial',
                        fontSize: '12pt',
                        textColor: 'green',
                        italic: true,
                    },
                },
            ],
            format: {},
            cachedElement: mockedCache,
        });
    });

    it('Already has same format in paragraph', () => {
        const para = createParagraph(false, undefined, {
            fontFamily: 'Calibri',
            fontSize: '10pt',
            textColor: 'red',
            italic: false,
        });
        const text1 = createText('test1', {
            fontFamily: 'Calibri',
            fontSize: '10pt',
            textColor: 'red',
            italic: false,
        });
        const text2 = createText('test2', {
            fontFamily: 'Calibri',
            fontSize: '10pt',
            textColor: 'red',
            italic: true,
        });

        para.segments.push(text1, text2);
        para.cachedElement = mockedCache;

        normalizeParagraph(para);

        expect(para).toEqual({
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'Text',
                    text: 'test1',
                    format: {
                        fontFamily: 'Calibri',
                        fontSize: '10pt',
                        textColor: 'red',
                        italic: false,
                    },
                },
                {
                    segmentType: 'Text',
                    text: 'test2',
                    format: {
                        fontFamily: 'Calibri',
                        fontSize: '10pt',
                        textColor: 'red',
                        italic: true,
                    },
                },
            ],
            format: {},
            segmentFormat: {
                fontFamily: 'Calibri',
                fontSize: '10pt',
                textColor: 'red',
                italic: false,
            },
            cachedElement: mockedCache,
        });
    });

    it('Empty paragraph has white-space style', () => {
        const para = createParagraph(false, { whiteSpace: 'pre-wrap' });
        const br = createBr();

        para.segments.push(br);

        normalizeParagraph(para);

        expect(para).toEqual({
            blockType: 'Paragraph',
            segments: [br],
            format: {},
        });
    });

    it('Paragraph has content and white-space style', () => {
        const para = createParagraph(false, { whiteSpace: 'pre-wrap' });
        const text = createText('test');

        para.segments.push(text);

        normalizeParagraph(para);

        expect(para).toEqual({
            blockType: 'Paragraph',
            segments: [text],
            format: { whiteSpace: 'pre-wrap' },
        });
    });
});

describe('Merge text segments', () => {
    function runTest(
        input: ContentModelSegment[],
        expectedResult: ContentModelSegment[],
        stillHasCache: boolean,
        expectedParagraphFormat?: ContentModelSegmentFormat
    ) {
        const paragraph = createParagraph();
        const cache = 'CACHE' as any;

        paragraph.cachedElement = cache;

        paragraph.segments = input;

        normalizeParagraph(paragraph);

        const expectedParagraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            format: {},
            segments: expectedResult,
        };

        if (expectedParagraphFormat) {
            expectedParagraph.segmentFormat = expectedParagraphFormat;
        }

        if (stillHasCache) {
            expectedParagraph.cachedElement = cache;
        }

        expect(paragraph).toEqual(expectedParagraph);
    }

    it('Empty paragraph', () => {
        runTest([], [], true);
    });

    it('Single text segment', () => {
        runTest(
            [
                {
                    segmentType: 'Text',
                    text: 'abc',
                    format: {},
                },
            ],
            [
                {
                    segmentType: 'Text',
                    text: 'abc',
                    format: {},
                },
            ],
            true
        );
    });

    it('Two text segments, same format', () => {
        runTest(
            [
                {
                    segmentType: 'Text',
                    text: 'abc',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
                {
                    segmentType: 'Text',
                    text: 'def',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
            ],
            [
                {
                    segmentType: 'Text',
                    text: 'abcdef',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
            ],
            false,
            { fontFamily: 'Aptos', fontSize: '12pt' }
        );
    });

    it('Two text segments, same format, with space - 1', () => {
        runTest(
            [
                {
                    segmentType: 'Text',
                    text: ' abc ',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
                {
                    segmentType: 'Text',
                    text: ' def ',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
            ],
            [
                {
                    segmentType: 'Text',
                    text: 'abc def',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
            ],
            false,
            { fontFamily: 'Aptos', fontSize: '12pt' }
        );
    });

    it('Two text segments, same format, with space - 2', () => {
        runTest(
            [
                {
                    segmentType: 'Text',
                    text: 'abc',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
                {
                    segmentType: 'Text',
                    text: ' def',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
            ],
            [
                {
                    segmentType: 'Text',
                    text: 'abc\u00A0def',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
            ],
            false,
            { fontFamily: 'Aptos', fontSize: '12pt' }
        );
    });

    it('Two text segments, different format - 1', () => {
        runTest(
            [
                {
                    segmentType: 'Text',
                    text: 'abc',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
                {
                    segmentType: 'Text',
                    text: 'def',
                    format: { fontFamily: 'Aptos', fontSize: '12pt', italic: true },
                },
            ],
            [
                {
                    segmentType: 'Text',
                    text: 'abc',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
                {
                    segmentType: 'Text',
                    text: 'def',
                    format: { fontFamily: 'Aptos', fontSize: '12pt', italic: true },
                },
            ],
            false,
            { fontFamily: 'Aptos', fontSize: '12pt' }
        );
    });

    it('Two text segments, different format - 2', () => {
        runTest(
            [
                {
                    segmentType: 'Text',
                    text: 'abc',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
                {
                    segmentType: 'Text',
                    text: 'def',
                    format: { fontFamily: 'Aptos' },
                },
            ],
            [
                {
                    segmentType: 'Text',
                    text: 'abc',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
                {
                    segmentType: 'Text',
                    text: 'def',
                    format: { fontFamily: 'Aptos' },
                },
            ],
            false,
            { fontFamily: 'Aptos' }
        );
    });

    it('Two text segments, different format - 3', () => {
        runTest(
            [
                {
                    segmentType: 'Text',
                    text: 'abc',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
                {
                    segmentType: 'Text',
                    text: 'def',
                    format: { fontFamily: 'Aptos', fontSize: '14pt' },
                },
            ],
            [
                {
                    segmentType: 'Text',
                    text: 'abc',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
                {
                    segmentType: 'Text',
                    text: 'def',
                    format: { fontFamily: 'Aptos', fontSize: '14pt' },
                },
            ],
            false,
            { fontFamily: 'Aptos' }
        );
    });

    it('Two text segments, one has link', () => {
        runTest(
            [
                {
                    segmentType: 'Text',
                    text: 'abc',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                    link: {
                        dataset: {},
                        format: {},
                    },
                },
                {
                    segmentType: 'Text',
                    text: 'def',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
            ],
            [
                {
                    segmentType: 'Text',
                    text: 'abc',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                    link: {
                        dataset: {},
                        format: {},
                    },
                },
                {
                    segmentType: 'Text',
                    text: 'def',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
            ],
            false,
            { fontFamily: 'Aptos', fontSize: '12pt' }
        );
    });

    it('Two text segments, both have same link', () => {
        runTest(
            [
                {
                    segmentType: 'Text',
                    text: 'abc',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                    link: {
                        dataset: {},
                        format: {},
                    },
                },
                {
                    segmentType: 'Text',
                    text: 'def',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                    link: {
                        dataset: {},
                        format: {},
                    },
                },
            ],
            [
                {
                    segmentType: 'Text',
                    text: 'abcdef',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                    link: {
                        dataset: {},
                        format: {},
                    },
                },
            ],
            false,
            { fontFamily: 'Aptos', fontSize: '12pt' }
        );
    });

    it('Two text segments, both have different link', () => {
        runTest(
            [
                {
                    segmentType: 'Text',
                    text: 'abc',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                    link: {
                        dataset: {},
                        format: { href: 'url1' },
                    },
                },
                {
                    segmentType: 'Text',
                    text: 'def',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                    link: {
                        dataset: {},
                        format: { href: 'url2' },
                    },
                },
            ],
            [
                {
                    segmentType: 'Text',
                    text: 'abc',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                    link: {
                        dataset: {},
                        format: { href: 'url1' },
                    },
                },
                {
                    segmentType: 'Text',
                    text: 'def',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                    link: {
                        dataset: {},
                        format: { href: 'url2' },
                    },
                },
            ],
            false,
            { fontFamily: 'Aptos', fontSize: '12pt' }
        );
    });

    it('Two text segments, one has code', () => {
        runTest(
            [
                {
                    segmentType: 'Text',
                    text: 'abc',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                    code: {
                        format: {},
                    },
                },
                {
                    segmentType: 'Text',
                    text: 'def',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
            ],
            [
                {
                    segmentType: 'Text',
                    text: 'abc',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                    code: {
                        format: {},
                    },
                },
                {
                    segmentType: 'Text',
                    text: 'def',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
            ],
            false,
            { fontFamily: 'Aptos', fontSize: '12pt' }
        );
    });

    it('Two text segments, both have same code', () => {
        runTest(
            [
                {
                    segmentType: 'Text',
                    text: 'abc',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                    code: {
                        format: {},
                    },
                },
                {
                    segmentType: 'Text',
                    text: 'def',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                    code: {
                        format: {},
                    },
                },
            ],
            [
                {
                    segmentType: 'Text',
                    text: 'abcdef',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                    code: {
                        format: {},
                    },
                },
            ],
            false,
            { fontFamily: 'Aptos', fontSize: '12pt' }
        );
    });

    it('Two text segments around selection marker', () => {
        runTest(
            [
                {
                    segmentType: 'Text',
                    text: 'abc',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
                {
                    segmentType: 'SelectionMarker',
                    format: {},
                },
                {
                    segmentType: 'Text',
                    text: 'def',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
            ],
            [
                {
                    segmentType: 'Text',
                    text: 'abc',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
                {
                    segmentType: 'SelectionMarker',
                    format: {},
                },
                {
                    segmentType: 'Text',
                    text: 'def',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
            ],
            false,
            { fontFamily: 'Aptos', fontSize: '12pt' }
        );
    });

    it('Two text segments after selection marker', () => {
        runTest(
            [
                {
                    segmentType: 'SelectionMarker',
                    format: {},
                },
                {
                    segmentType: 'Text',
                    text: 'abc',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
                {
                    segmentType: 'Text',
                    text: 'def',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
            ],
            [
                {
                    segmentType: 'SelectionMarker',
                    format: {},
                },
                {
                    segmentType: 'Text',
                    text: 'abcdef',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
            ],
            false,
            { fontFamily: 'Aptos', fontSize: '12pt' }
        );
    });

    it('Two text segments before selection marker', () => {
        runTest(
            [
                {
                    segmentType: 'Text',
                    text: 'abc',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
                {
                    segmentType: 'Text',
                    text: 'def',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
                {
                    segmentType: 'SelectionMarker',
                    format: {},
                },
            ],
            [
                {
                    segmentType: 'Text',
                    text: 'abcdef',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
                {
                    segmentType: 'SelectionMarker',
                    format: {},
                },
            ],
            false,
            { fontFamily: 'Aptos', fontSize: '12pt' }
        );
    });

    it('Three text segments with same format', () => {
        runTest(
            [
                {
                    segmentType: 'Text',
                    text: 'abc',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
                {
                    segmentType: 'Text',
                    text: 'def',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
                {
                    segmentType: 'Text',
                    text: 'ghi',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
            ],
            [
                {
                    segmentType: 'Text',
                    text: 'abcdefghi',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
            ],
            false,
            { fontFamily: 'Aptos', fontSize: '12pt' }
        );
    });

    it('Two pairs - 1', () => {
        runTest(
            [
                {
                    segmentType: 'Text',
                    text: 'abc',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
                {
                    segmentType: 'Text',
                    text: 'def',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
                {
                    segmentType: 'Text',
                    text: 'ghi',
                    format: { fontFamily: 'Aptos', fontSize: '14pt' },
                },
                {
                    segmentType: 'Text',
                    text: 'jkl',
                    format: { fontFamily: 'Aptos', fontSize: '14pt' },
                },
            ],
            [
                {
                    segmentType: 'Text',
                    text: 'abcdef',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
                {
                    segmentType: 'Text',
                    text: 'ghijkl',
                    format: { fontFamily: 'Aptos', fontSize: '14pt' },
                },
            ],
            false,
            { fontFamily: 'Aptos' }
        );
    });

    it('Two pairs - 2', () => {
        runTest(
            [
                {
                    segmentType: 'Text',
                    text: 'abc',
                    format: { fontSize: '12pt' },
                },
                {
                    segmentType: 'Text',
                    text: 'def',
                    format: { fontSize: '14pt' },
                },
                {
                    segmentType: 'Text',
                    text: 'ghi',
                    format: { fontSize: '12pt' },
                },
                {
                    segmentType: 'Text',
                    text: 'jkl',
                    format: { fontSize: '14pt' },
                },
            ],
            [
                {
                    segmentType: 'Text',
                    text: 'abc',
                    format: { fontSize: '12pt' },
                },
                {
                    segmentType: 'Text',
                    text: 'def',
                    format: { fontSize: '14pt' },
                },
                {
                    segmentType: 'Text',
                    text: 'ghi',
                    format: { fontSize: '12pt' },
                },
                {
                    segmentType: 'Text',
                    text: 'jkl',
                    format: { fontSize: '14pt' },
                },
            ],
            true
        );
    });
});
