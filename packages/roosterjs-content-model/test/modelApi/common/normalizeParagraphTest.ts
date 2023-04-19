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
                            text: 'b',
                            format: {},
                        },
                    ],
                },
            ],
        });
    });
});
