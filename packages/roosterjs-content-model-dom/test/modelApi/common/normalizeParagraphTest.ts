import { createBr } from '../../../lib/modelApi/creators/createBr';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createImage } from '../../../lib/modelApi/creators/createImage';
import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';
import { createSelectionMarker } from '../../../lib/modelApi/creators/createSelectionMarker';
import { createText } from '../../../lib/modelApi/creators/createText';
import { normalizeContentModel } from '../../../lib/modelApi/common/normalizeContentModel';
import { normalizeParagraph } from '../../../lib/modelApi/common/normalizeParagraph';
import { ReadonlyContentModelParagraph } from 'roosterjs-content-model-types';

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
        runTest(['a\u00A0', 'b'], ['a ', 'b']);
        runTest(['a\u00A0\u00A0', 'b'], ['a\u00A0 ', 'b']);
        runTest(['a \u00A0', 'b'], ['a \u00A0', 'b']);
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
                            text: 'a ',
                            format: {},
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
                    text: 'test1',
                    format: {},
                },
                {
                    segmentType: 'Text',
                    text: 'test2',
                    format: {},
                },
            ],
            format: {},
            cachedElement: mockedCache,
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
});
