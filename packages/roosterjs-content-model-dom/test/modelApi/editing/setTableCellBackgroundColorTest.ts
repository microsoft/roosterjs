import { createParagraph, createTableCell, createText } from 'roosterjs-content-model-dom';
import { setTableCellBackgroundColor } from '../../../lib/modelApi/editing/setTableCellBackgroundColor';

describe('setTableCellBackgroundColor', () => {
    it('Set to null', () => {
        const cell = createTableCell(1, 1, false, {
            backgroundColor: 'red',
        });

        setTableCellBackgroundColor(cell, null);

        expect(cell).toEqual({
            blockGroupType: 'TableCell',
            format: {},
            isHeader: false,
            spanAbove: false,
            spanLeft: false,
            dataset: {},
            blocks: [],
        });
    });

    it('Set to a color', () => {
        const cell = createTableCell(1, 1, false, {
            backgroundColor: 'red',
        });

        setTableCellBackgroundColor(cell, '#ffffff');

        expect(cell).toEqual({
            blockGroupType: 'TableCell',
            format: {
                backgroundColor: '#ffffff',
                textColor: '#000000',
            },
            isHeader: false,
            spanAbove: false,
            spanLeft: false,
            dataset: {},
            blocks: [],
        });
    });

    it('Set to a color with override', () => {
        const cell = createTableCell(1, 1, false, {
            backgroundColor: 'red',
        });

        setTableCellBackgroundColor(cell, '#ffffff', true);

        expect(cell).toEqual({
            blockGroupType: 'TableCell',
            format: {
                backgroundColor: '#ffffff',
                textColor: '#000000',
            },
            isHeader: false,
            spanAbove: false,
            spanLeft: false,
            dataset: { editingInfo: '{"bgColorOverride":true}' },
            blocks: [],
        });
    });

    it('Set to a dark color', () => {
        const cell = createTableCell(1, 1, false, {
            backgroundColor: 'red',
        });

        setTableCellBackgroundColor(cell, '#000000');

        expect(cell).toEqual({
            blockGroupType: 'TableCell',
            format: {
                backgroundColor: '#000000',
                textColor: '#ffffff',
            },
            isHeader: false,
            spanAbove: false,
            spanLeft: false,
            dataset: {},
            blocks: [],
        });
    });

    it('Set to a rgb dark color', () => {
        const cell = createTableCell(1, 1, false, {
            backgroundColor: 'red',
        });

        setTableCellBackgroundColor(cell, 'rgb(0,0,0)');

        expect(cell).toEqual({
            blockGroupType: 'TableCell',
            format: {
                backgroundColor: 'rgb(0,0,0)',
                textColor: '#ffffff',
            },
            isHeader: false,
            spanAbove: false,
            spanLeft: false,
            dataset: {},
            blocks: [],
        });
    });

    it('Set to an unrecognized color', () => {
        const cell = createTableCell(1, 1, false, {
            backgroundColor: 'red',
        });

        setTableCellBackgroundColor(cell, 'wrong');

        expect(cell).toEqual({
            blockGroupType: 'TableCell',
            format: {
                backgroundColor: 'wrong',
                textColor: '#000000',
            },
            isHeader: false,
            spanAbove: false,
            spanLeft: false,
            dataset: {},
            blocks: [],
        });
    });

    it('Set dark background color with applyToSegments - should apply white text to segments', () => {
        const paragraph = createParagraph();
        const text = createText('test');
        paragraph.segments.push(text);

        const cell = createTableCell(1, 1, false);
        cell.blocks.push(paragraph);

        setTableCellBackgroundColor(cell, '#000000', false, true);

        expect(cell.format.backgroundColor).toBe('#000000');
        expect(cell.format.textColor).toBe('#ffffff');
        expect(paragraph.segmentFormat?.textColor).toBe('#ffffff');
        expect(text.format.textColor).toBe('#ffffff');
    });

    it('Set bright background color with applyToSegments - should apply black text to segments', () => {
        const paragraph = createParagraph();
        const text = createText('test');
        paragraph.segments.push(text);

        const cell = createTableCell(1, 1, false);
        cell.blocks.push(paragraph);

        setTableCellBackgroundColor(cell, '#ffffff', false, true);

        expect(cell.format.backgroundColor).toBe('#ffffff');
        expect(cell.format.textColor).toBe('#000000');
        expect(paragraph.segmentFormat?.textColor).toBe('#000000');
        expect(text.format.textColor).toBe('#000000');
    });

    it('Set dark background with applyToSegments - should not override existing text color', () => {
        const paragraph = createParagraph();
        const text = createText('test', { textColor: 'red' });
        paragraph.segments.push(text);

        const cell = createTableCell(1, 1, false);
        cell.blocks.push(paragraph);

        setTableCellBackgroundColor(cell, '#000000', false, true);

        expect(cell.format.backgroundColor).toBe('#000000');
        expect(cell.format.textColor).toBe('#ffffff');
        expect(text.format.textColor).toBe('red');
    });

    it('Set dark background with applyToSegments - should override text color if same as background', () => {
        const paragraph = createParagraph();
        const text = createText('test', { textColor: '#000000' });
        paragraph.segments.push(text);

        const cell = createTableCell(1, 1, false);
        cell.blocks.push(paragraph);

        setTableCellBackgroundColor(cell, '#000000', false, true);

        expect(cell.format.backgroundColor).toBe('#000000');
        expect(cell.format.textColor).toBe('#ffffff');
        expect(text.format.textColor).toBe('#ffffff');
    });

    it('Set bright background with applyToSegments - should override text color if same as background (rgb format)', () => {
        const paragraph = createParagraph();
        const text = createText('test', { textColor: 'rgb(255, 255, 255)' });
        paragraph.segments.push(text);

        const cell = createTableCell(1, 1, false);
        cell.blocks.push(paragraph);

        setTableCellBackgroundColor(cell, '#ffffff', false, true);

        expect(cell.format.backgroundColor).toBe('#ffffff');
        expect(cell.format.textColor).toBe('#000000');
        expect(text.format.textColor).toBe('#000000');
    });

    it('Remove background color with applyToSegments - should remove white text color from segments', () => {
        const paragraph = createParagraph(false, {}, { textColor: '#ffffff' });
        const text = createText('test', { textColor: '#ffffff' });
        paragraph.segments.push(text);

        const cell = createTableCell(1, 1, false, {
            backgroundColor: '#000000',
            textColor: '#ffffff',
        });
        cell.blocks.push(paragraph);

        setTableCellBackgroundColor(cell, null, false, true);

        expect(cell.format.backgroundColor).toBeUndefined();
        expect(cell.format.textColor).toBeUndefined();
        expect(paragraph.segmentFormat?.textColor).toBeUndefined();
        expect(text.format.textColor).toBeUndefined();
    });

    it('Remove background color with applyToSegments - should remove black text color from segments', () => {
        const paragraph = createParagraph(false, {}, { textColor: '#000000' });
        const text = createText('test', { textColor: '#000000' });
        paragraph.segments.push(text);

        const cell = createTableCell(1, 1, false, {
            backgroundColor: '#ffffff',
            textColor: '#000000',
        });
        cell.blocks.push(paragraph);

        setTableCellBackgroundColor(cell, null, false, true);

        expect(cell.format.backgroundColor).toBeUndefined();
        expect(cell.format.textColor).toBeUndefined();
        expect(paragraph.segmentFormat?.textColor).toBeUndefined();
        expect(text.format.textColor).toBeUndefined();
    });

    it('Remove background color with applyToSegments - should remove rgb white text color from segments', () => {
        const paragraph = createParagraph(false, {}, { textColor: 'rgb(255, 255, 255)' });
        const text = createText('test', { textColor: 'rgb(255,255,255)' });
        paragraph.segments.push(text);

        const cell = createTableCell(1, 1, false, {
            backgroundColor: '#000000',
            textColor: '#ffffff',
        });
        cell.blocks.push(paragraph);

        setTableCellBackgroundColor(cell, null, false, true);

        expect(cell.format.backgroundColor).toBeUndefined();
        expect(cell.format.textColor).toBeUndefined();
        expect(paragraph.segmentFormat?.textColor).toBeUndefined();
        expect(text.format.textColor).toBeUndefined();
    });

    it('Remove background color with applyToSegments - should not remove non-adaptive text colors', () => {
        const paragraph = createParagraph(false, {}, { textColor: 'red' });
        const text = createText('test', { textColor: 'blue' });
        paragraph.segments.push(text);

        const cell = createTableCell(1, 1, false, {
            backgroundColor: '#000000',
            textColor: '#ffffff',
        });
        cell.blocks.push(paragraph);

        setTableCellBackgroundColor(cell, null, false, true);

        expect(cell.format.backgroundColor).toBeUndefined();
        expect(cell.format.textColor).toBeUndefined();
        expect(paragraph.segmentFormat?.textColor).toBe('red');
        expect(text.format.textColor).toBe('blue');
    });

    it('Set medium lightness background - should not apply text color to segments', () => {
        const paragraph = createParagraph();
        const text = createText('test');
        paragraph.segments.push(text);

        const cell = createTableCell(1, 1, false);
        cell.blocks.push(paragraph);

        setTableCellBackgroundColor(cell, '#808080', false, true);

        expect(cell.format.backgroundColor).toBe('#808080');
        expect(cell.format.textColor).toBeUndefined();
        expect(paragraph.segmentFormat?.textColor).toBeUndefined();
        expect(text.format.textColor).toBeUndefined();
    });
});
