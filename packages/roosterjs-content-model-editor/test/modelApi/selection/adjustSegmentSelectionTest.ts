import { adjustSegmentSelection } from '../../../lib/modelApi/selection/adjustSegmentSelection';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';
import { createSelectionMarker } from '../../../lib/modelApi/creators/createSelectionMarker';
import { createText } from '../../../lib/modelApi/creators/createText';

describe('adjustSegmentSelection', () => {
    it('Empty doc', () => {
        const model = createContentModelDocument();

        adjustSegmentSelection(
            model,
            () => true,
            () => true
        );

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [],
        });
    });

    it('Doc without selections', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test2');
        const text3 = createText('test3');

        para.segments.push(text1, text2, text3);
        model.blocks.push(para);

        const result = adjustSegmentSelection(
            model,
            x => !!x.isSelected,
            (x, ref) => x.format.fontSize == ref.format.fontSize
        );

        expect(result).toBe(false);
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'test1',
                        },
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'test2',
                        },
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'test3',
                        },
                    ],
                },
            ],
        });
    });

    it('Doc with selection, no need to expand', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test2', { fontSize: '10px' });
        const text3 = createText('test3');

        text2.isSelected = true;

        para.segments.push(text1, text2, text3);
        model.blocks.push(para);

        const result = adjustSegmentSelection(
            model,
            x => !!x.isSelected,
            (x, ref) => x.format.fontSize == ref.format.fontSize
        );

        expect(result).toBe(false);
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'test1',
                        },
                        {
                            segmentType: 'Text',
                            format: { fontSize: '10px' },
                            text: 'test2',
                            isSelected: true,
                        },
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'test3',
                        },
                    ],
                },
            ],
        });
    });

    it('Doc with selection, expand to left', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const text1 = createText('test1', { fontSize: '10px' });
        const text2 = createText('test2', { fontSize: '10px' });
        const text3 = createText('test3');

        text2.isSelected = true;

        para.segments.push(text1, text2, text3);
        model.blocks.push(para);

        const result = adjustSegmentSelection(
            model,
            x => !!x.isSelected,
            (x, ref) => x.format.fontSize == ref.format.fontSize
        );

        expect(result).toBe(true);
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            format: { fontSize: '10px' },
                            text: 'test1',
                            isSelected: true,
                        },
                        {
                            segmentType: 'Text',
                            format: { fontSize: '10px' },
                            text: 'test2',
                            isSelected: true,
                        },
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'test3',
                        },
                    ],
                },
            ],
        });
    });

    it('Doc with selection, expand to right', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test2', { fontSize: '10px' });
        const text3 = createText('test3', { fontSize: '10px' });

        text2.isSelected = true;

        para.segments.push(text1, text2, text3);
        model.blocks.push(para);

        const result = adjustSegmentSelection(
            model,
            x => !!x.isSelected,
            (x, ref) => x.format.fontSize == ref.format.fontSize
        );

        expect(result).toBe(true);
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'test1',
                        },
                        {
                            segmentType: 'Text',
                            format: { fontSize: '10px' },
                            text: 'test2',
                            isSelected: true,
                        },
                        {
                            segmentType: 'Text',
                            format: { fontSize: '10px' },
                            text: 'test3',
                            isSelected: true,
                        },
                    ],
                },
            ],
        });
    });

    it('Doc with selection, expand to both sides', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const text1 = createText('test1', { fontSize: '10px' });
        const text2 = createText('test2', { fontSize: '10px' });
        const text3 = createText('test3', { fontSize: '10px' });

        text2.isSelected = true;

        para.segments.push(text1, text2, text3);
        model.blocks.push(para);

        const result = adjustSegmentSelection(
            model,
            x => !!x.isSelected,
            (x, ref) => x.format.fontSize == ref.format.fontSize
        );

        expect(result).toBe(true);
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            format: { fontSize: '10px' },
                            text: 'test1',
                            isSelected: true,
                        },
                        {
                            segmentType: 'Text',
                            format: { fontSize: '10px' },
                            text: 'test2',
                            isSelected: true,
                        },
                        {
                            segmentType: 'Text',
                            format: { fontSize: '10px' },
                            text: 'test3',
                            isSelected: true,
                        },
                    ],
                },
            ],
        });
    });

    it('Doc with selection, shrink', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test2', { fontSize: '10px' });
        const text3 = createText('test3');

        text1.isSelected = true;
        text2.isSelected = true;
        text3.isSelected = true;

        para.segments.push(text1, text2, text3);
        model.blocks.push(para);

        const result = adjustSegmentSelection(
            model,
            x => !!x.isSelected && x.format.fontSize == '10px',
            (x, ref) => x.format.fontSize == ref.format.fontSize
        );

        expect(result).toBe(true);
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'test1',
                        },
                        {
                            segmentType: 'Text',
                            format: { fontSize: '10px' },
                            text: 'test2',
                            isSelected: true,
                        },
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'test3',
                        },
                    ],
                },
            ],
        });
    });

    it('Expand and shrink 1', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test2', { fontSize: '10px' });
        const text3 = createText('test3', { fontSize: '10px' });

        text1.isSelected = true;
        text2.isSelected = true;

        para.segments.push(text1, text2, text3);
        model.blocks.push(para);

        const result = adjustSegmentSelection(
            model,
            x => !!x.isSelected && x.format.fontSize == '10px',
            (x, ref) => x.format.fontSize == ref.format.fontSize
        );

        expect(result).toBe(true);
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'test1',
                        },
                        {
                            segmentType: 'Text',
                            format: { fontSize: '10px' },
                            text: 'test2',
                            isSelected: true,
                        },
                        {
                            segmentType: 'Text',
                            format: { fontSize: '10px' },
                            text: 'test3',
                            isSelected: true,
                        },
                    ],
                },
            ],
        });
    });

    it('Expand and shrink 2', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const text1 = createText('test1', { fontSize: '10px' });
        const text2 = createText('test2', { fontSize: '10px' });
        const text3 = createText('test3', {});

        text2.isSelected = true;
        text3.isSelected = true;

        para.segments.push(text1, text2, text3);
        model.blocks.push(para);

        const result = adjustSegmentSelection(
            model,
            x => !!x.isSelected && x.format.fontSize == '10px',
            (x, ref) => x.format.fontSize == ref.format.fontSize
        );

        expect(result).toBe(true);
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            format: { fontSize: '10px' },
                            text: 'test1',
                            isSelected: true,
                        },
                        {
                            segmentType: 'Text',
                            format: { fontSize: '10px' },
                            text: 'test2',
                            isSelected: true,
                        },
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'test3',
                        },
                    ],
                },
            ],
        });
    });

    it('Expand from selection marker', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const text1 = createText('test1');
        const marker = createSelectionMarker();
        const text3 = createText('test3');

        para.segments.push(text1, marker, text3);
        model.blocks.push(para);

        const result = adjustSegmentSelection(
            model,
            x => x.segmentType == 'SelectionMarker',
            () => true
        );

        expect(result).toBe(true);
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'test1',
                            isSelected: true,
                        },
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'test3',
                            isSelected: true,
                        },
                    ],
                },
            ],
        });
    });

    it('Multiple paragraph 1 - no expand', () => {
        const model = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const text1 = createText('test1', { fontSize: '10px' });
        const text2 = createText('test2', { fontSize: '10px' });
        const text3 = createText('test3');

        text1.isSelected = true;

        para1.segments.push(text1);
        para2.segments.push(text2, text3);
        model.blocks.push(para1, para2);

        const result = adjustSegmentSelection(
            model,
            x => !!x.isSelected,
            (x, ref) => x.format.fontSize == ref.format.fontSize
        );

        expect(result).toBe(false);
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            format: { fontSize: '10px' },
                            text: 'test1',
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
                            format: { fontSize: '10px' },
                            text: 'test2',
                        },
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'test3',
                        },
                    ],
                },
            ],
        });
    });

    it('Multiple paragraph 2 - expand in next line', () => {
        const model = createContentModelDocument();
        const para1 = createParagraph();
        const para2 = createParagraph();
        const text1 = createText('test1', { fontSize: '10px' });
        const text2 = createText('test2', { fontSize: '10px' });
        const text3 = createText('test3', { fontSize: '10px' });

        text1.isSelected = true;
        text2.isSelected = true;

        para1.segments.push(text1);
        para2.segments.push(text2, text3);
        model.blocks.push(para1, para2);

        const result = adjustSegmentSelection(
            model,
            x => !!x.isSelected,
            (x, ref) => x.format.fontSize == ref.format.fontSize
        );

        expect(result).toBe(true);
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            format: { fontSize: '10px' },
                            text: 'test1',
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
                            format: { fontSize: '10px' },
                            text: 'test2',
                            isSelected: true,
                        },
                        {
                            segmentType: 'Text',
                            format: { fontSize: '10px' },
                            text: 'test3',
                            isSelected: true,
                        },
                    ],
                },
            ],
        });
    });
});
