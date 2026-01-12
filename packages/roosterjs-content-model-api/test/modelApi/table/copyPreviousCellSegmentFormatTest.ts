import { copyPreviousCellSegmentFormat } from '../../../lib/modelApi/table/copyPreviousCellSegmentFormat';
import {
    createBr,
    createParagraph,
    createSelectionMarker,
    createTableCell,
    createText,
} from 'roosterjs-content-model-dom';

describe('copyPreviousCellSegmentFormat', () => {
    it('should not copy format when cell has no blocks', () => {
        const cell = createTableCell();
        const newCell = createTableCell();

        copyPreviousCellSegmentFormat(cell, newCell);

        expect(newCell.blocks).toEqual([]);
    });

    it('should not copy format when first block is not a paragraph', () => {
        const cell = createTableCell();
        cell.blocks.push({
            blockType: 'Divider',
            tagName: 'hr',
            format: {},
        });
        const newCell = createTableCell();

        copyPreviousCellSegmentFormat(cell, newCell);

        expect(newCell.blocks).toEqual([]);
    });

    it('should not copy format when paragraph has no segments', () => {
        const cell = createTableCell();
        const paragraph = createParagraph();
        cell.blocks.push(paragraph);
        const newCell = createTableCell();

        copyPreviousCellSegmentFormat(cell, newCell);

        expect(newCell.blocks).toEqual([]);
    });

    it('should not copy format when first segment is an image', () => {
        const cell = createTableCell();
        const paragraph = createParagraph();
        paragraph.segments.push({
            segmentType: 'Image',
            format: {},
            src: 'test.png',
            dataset: {},
        });
        cell.blocks.push(paragraph);
        const newCell = createTableCell();

        copyPreviousCellSegmentFormat(cell, newCell);

        expect(newCell.blocks).toEqual([]);
    });

    it('should copy format when first segment is Text', () => {
        const cell = createTableCell();
        const paragraph = createParagraph(
            false,
            { lineHeight: '20px' },
            { fontFamily: 'Arial', fontSize: '14px' }
        );
        const textSegment = createText('test', { fontFamily: 'Arial', fontSize: '14px' });
        paragraph.segments.push(textSegment);
        cell.blocks.push(paragraph);
        const newCell = createTableCell();

        copyPreviousCellSegmentFormat(cell, newCell);

        expect(newCell.blocks.length).toBe(1);
        const newParagraph = newCell.blocks[0];
        expect(newParagraph.blockType).toBe('Paragraph');
        if (newParagraph.blockType === 'Paragraph') {
            expect(newParagraph.format).toEqual({ lineHeight: '20px' });
            expect(newParagraph.segmentFormat).toEqual({ fontFamily: 'Arial', fontSize: '14px' });
            expect(newParagraph.segments.length).toBe(1);
            expect(newParagraph.segments[0].segmentType).toBe('Br');
            expect(newParagraph.segments[0].format).toEqual({
                fontFamily: 'Arial',
                fontSize: '14px',
            });
        }
    });

    it('should copy format when first segment is Br', () => {
        const cell = createTableCell();
        const paragraph = createParagraph(false, { textAlign: 'center' }, { fontWeight: 'bold' });
        const brSegment = createBr({ fontWeight: 'bold', textColor: 'red' });
        paragraph.segments.push(brSegment);
        cell.blocks.push(paragraph);
        const newCell = createTableCell();

        copyPreviousCellSegmentFormat(cell, newCell);

        expect(newCell.blocks.length).toBe(1);
        const newParagraph = newCell.blocks[0];
        expect(newParagraph.blockType).toBe('Paragraph');
        if (newParagraph.blockType === 'Paragraph') {
            expect(newParagraph.format).toEqual({ textAlign: 'center' });
            expect(newParagraph.segmentFormat).toEqual({ fontWeight: 'bold' });
            expect(newParagraph.segments.length).toBe(1);
            expect(newParagraph.segments[0].segmentType).toBe('Br');
            expect(newParagraph.segments[0].format).toEqual({
                fontWeight: 'bold',
                textColor: 'red',
            });
        }
    });

    it('should copy format when first segment is SelectionMarker', () => {
        const cell = createTableCell();
        const paragraph = createParagraph(false, {}, { italic: true });
        const marker = createSelectionMarker({ italic: true, underline: true });
        paragraph.segments.push(marker);
        cell.blocks.push(paragraph);
        const newCell = createTableCell();

        copyPreviousCellSegmentFormat(cell, newCell);

        expect(newCell.blocks.length).toBe(1);
        const newParagraph = newCell.blocks[0];
        expect(newParagraph.blockType).toBe('Paragraph');
        if (newParagraph.blockType === 'Paragraph') {
            expect(newParagraph.segmentFormat).toEqual({ italic: true });
            expect(newParagraph.segments.length).toBe(1);
            expect(newParagraph.segments[0].segmentType).toBe('Br');
            expect(newParagraph.segments[0].format).toEqual({ italic: true, underline: true });
        }
    });

    it('should not affect existing blocks in newCell', () => {
        const cell = createTableCell();
        const paragraph = createParagraph(false, {}, { fontFamily: 'Times' });
        const textSegment = createText('test', { fontFamily: 'Times' });
        paragraph.segments.push(textSegment);
        cell.blocks.push(paragraph);

        const newCell = createTableCell();
        const existingParagraph = createParagraph();
        existingParagraph.segments.push(createText('existing'));
        newCell.blocks.push(existingParagraph);

        copyPreviousCellSegmentFormat(cell, newCell);

        expect(newCell.blocks.length).toBe(2);
        expect(newCell.blocks[0]).toBe(existingParagraph);
    });
});
