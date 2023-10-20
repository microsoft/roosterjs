import { ContentModelTableCell, ContentModelTableCellFormat } from 'roosterjs-content-model-types';
import { createTableCell as originalCreateTableCell } from 'roosterjs-content-model-dom';
import {
    parseColor,
    setTableCellBackgroundColor,
} from '../../../lib/modelApi/table/setTableCellBackgroundColor';

function createTableCell(
    spanLeftOrColSpan?: boolean | number,
    spanAboveOrRowSpan?: boolean | number,
    isHeader?: boolean,
    format?: ContentModelTableCellFormat
): ContentModelTableCell {
    const cell = originalCreateTableCell(spanLeftOrColSpan, spanAboveOrRowSpan, isHeader, format);

    cell.cachedElement = {} as any;

    return cell;
}

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
});

describe('parseColor', () => {
    it('empty string', () => {
        const result = parseColor('');
        expect(result).toBe(null);
    });

    it('unrecognized color', () => {
        const result = parseColor('aaa');
        expect(result).toBe(null);
    });

    it('short hex 1', () => {
        const result = parseColor('#aaa');
        expect(result).toEqual([170, 170, 170]);
    });

    it('short hex 2', () => {
        const result = parseColor('#aaab');
        expect(result).toEqual(null);
    });

    it('short hex 3', () => {
        const result = parseColor('   #aaa   ');
        expect(result).toEqual([170, 170, 170]);
    });

    it('long hex 1', () => {
        const result = parseColor('#ababab');
        expect(result).toEqual([171, 171, 171]);
    });

    it('long hex 2', () => {
        const result = parseColor('#abababc');
        expect(result).toEqual(null);
    });

    it('long hex 3', () => {
        const result = parseColor('  #ababab  ');
        expect(result).toEqual([171, 171, 171]);
    });

    it('rgb 1', () => {
        const result = parseColor('rgb(1,2,3)');
        expect(result).toEqual([1, 2, 3]);
    });

    it('rgb 2', () => {
        const result = parseColor('   rgb(   1   ,   2  ,  3  )  ');
        expect(result).toEqual([1, 2, 3]);
    });

    it('rgb 3', () => {
        const result = parseColor('rgb(1.1, 2.2, 3.3)');
        expect(result).toEqual([1, 2, 3]);
    });

    it('rgba 1', () => {
        const result = parseColor('rgba(1, 2, 3, 4)');
        expect(result).toEqual([1, 2, 3]);
    });

    it('rgba 2', () => {
        const result = parseColor('    rgba(   1.1   ,    2.2   ,  3.3  ,  4.4  )  ');
        expect(result).toEqual([1, 2, 3]);
    });

    it('rgba 3', () => {
        const result = parseColor('rgba(1.1, 2.2, 3.3, 4.4)');
        expect(result).toEqual([1, 2, 3]);
    });
});
