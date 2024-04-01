import {
    createContentModelDocument,
    createParagraph,
    createSelectionMarker,
    createText,
    deleteSelection,
} from 'roosterjs-content-model-dom';
import {
    backwardDeleteWordSelection,
    forwardDeleteWordSelection,
} from '../../../lib/edit/deleteSteps/deleteWordSelection';

describe('deleteSelection - forward', () => {
    it('Delete word: text+space+text', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const marker = createSelectionMarker();
        const text1 = createText('test1');
        const text2 = createText('   ');
        const text3 = createText('test2');

        para.segments.push(marker, text1, text2, text3);
        model.blocks.push(para);

        const result = deleteSelection(model, [forwardDeleteWordSelection]);

        expect(result.deleteResult).toBe('range');

        expect(result.insertPoint).toEqual({
            marker: marker,
            paragraph: para,
            path: [model],
            tableContext: undefined,
        });

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
                            segmentType: 'Text',
                            text: 'test2',
                            format: {},
                        },
                    ],
                },
            ],
        });
    });

    it('Delete word: space+text+space+text', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const marker = createSelectionMarker();
        const text1 = createText('   test1   test2');

        para.segments.push(marker, text1);
        model.blocks.push(para);

        const result = deleteSelection(model, [forwardDeleteWordSelection]);

        expect(result.deleteResult).toBe('range');

        expect(result.insertPoint).toEqual({
            marker: marker,
            paragraph: para,
            path: [model],
            tableContext: undefined,
        });

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
                            segmentType: 'Text',
                            text: 'test1   test2',
                            format: {},
                        },
                    ],
                },
            ],
        });
    });

    it('Delete word: text+punc+space+text', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const marker = createSelectionMarker();
        const text1 = createText('test1. test2');

        para.segments.push(marker, text1);
        model.blocks.push(para);

        const result = deleteSelection(model, [forwardDeleteWordSelection]);

        expect(result.deleteResult).toBe('range');

        expect(result.insertPoint).toEqual({
            marker: marker,
            paragraph: para,
            path: [model],
            tableContext: undefined,
        });

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
                            segmentType: 'Text',
                            text: '. test2',
                            format: {},
                        },
                    ],
                },
            ],
        });
    });

    it('Delete word: punc+space+text', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const marker = createSelectionMarker();
        const text1 = createText('. test2');

        para.segments.push(marker, text1);
        model.blocks.push(para);

        const result = deleteSelection(model, [forwardDeleteWordSelection]);

        expect(result.deleteResult).toBe('range');

        expect(result.insertPoint).toEqual({
            marker: marker,
            paragraph: para,
            path: [model],
            tableContext: undefined,
        });

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
                            segmentType: 'Text',
                            text: 'test2',
                            format: {},
                        },
                    ],
                },
            ],
        });
    });
});

describe('deleteSelection - backward', () => {
    it('Delete word: text+space+text', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const marker = createSelectionMarker();
        const text1 = createText('test1');
        const text2 = createText('   ');
        const text3 = createText('test2');

        para.segments.push(text1, text2, text3, marker);
        model.blocks.push(para);

        const result = deleteSelection(model, [backwardDeleteWordSelection]);

        expect(result.deleteResult).toBe('range');

        expect(result.insertPoint).toEqual({
            marker: marker,
            paragraph: para,
            path: [model],
            tableContext: undefined,
        });

        expect(model).toEqual({
            blockGroupType: 'Document',
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
                        {
                            segmentType: 'Text',
                            text: '   ',
                            format: {},
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

    it('Delete word: space+text+space+text', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const marker = createSelectionMarker();
        const text1 = createText('\u00A0 \u00A0test1 \u00A0 test2');

        para.segments.push(text1, marker);
        model.blocks.push(para);

        const result = deleteSelection(model, [backwardDeleteWordSelection]);

        expect(result.deleteResult).toBe('range');

        expect(result.insertPoint).toEqual({
            marker: marker,
            paragraph: para,
            path: [model],
            tableContext: undefined,
        });

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            text: '\u00A0 \u00A0test1 \u00A0\u00A0',
                            format: {},
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

    it('Delete word: text+punc+space+text', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const marker = createSelectionMarker();
        const text1 = createText('test1. test2');

        para.segments.push(text1, marker);
        model.blocks.push(para);

        const result = deleteSelection(model, [backwardDeleteWordSelection]);

        expect(result.deleteResult).toBe('range');

        expect(result.insertPoint).toEqual({
            marker: marker,
            paragraph: para,
            path: [model],
            tableContext: undefined,
        });

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test1.\u00A0',
                            format: {},
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

    it('Delete word: punc+space+text', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const marker = createSelectionMarker();
        const text1 = createText('. test2');

        para.segments.push(text1, marker);
        model.blocks.push(para);

        const result = deleteSelection(model, [backwardDeleteWordSelection]);

        expect(result.deleteResult).toBe('range');

        expect(result.insertPoint).toEqual({
            marker: marker,
            paragraph: para,
            path: [model],
            tableContext: undefined,
        });

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            text: '.\u00A0',
                            format: {},
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

    it('Delete all before', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const marker = createSelectionMarker();
        const text1 = createText('test1');
        const text2 = createText('test2');
        const text3 = createText('test3');

        para.segments.push(text1, text2, marker, text3);
        model.blocks.push(para);

        const result = deleteSelection(model, [backwardDeleteWordSelection]);

        expect(result.deleteResult).toBe('range');

        expect(result.insertPoint).toEqual({
            marker: marker,
            paragraph: para,
            path: [model],
            tableContext: undefined,
        });

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
                            segmentType: 'Text',
                            text: 'test3',
                            format: {},
                        },
                    ],
                },
            ],
        });
    });
});
