import { createBr } from '../../../lib/modelApi/creators/createBr';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createImage } from '../../../lib/modelApi/creators/createImage';
import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';
import { createSelectionMarker } from '../../../lib/modelApi/creators/createSelectionMarker';
import { createText } from '../../../lib/modelApi/creators/createText';
import { normalizeContentModel } from '../../../lib/modelApi/common/normalizeContentModel';

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
});
