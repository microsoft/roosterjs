import { ContentModelTableCell, ContentModelTableCellFormat } from 'roosterjs-content-model-types';
import { createTableCell as originalCreateTableCell } from 'roosterjs-content-model-dom';
import { setTableCellBackgroundColor } from '../../../lib/modelApi/table/setTableCellBackgroundColor';

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
                adjustTextColor: true,
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
                adjustTextColor: true,
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
                adjustTextColor: true,
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
                adjustTextColor: true,
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
                adjustTextColor: true,
            },
            isHeader: false,
            spanAbove: false,
            spanLeft: false,
            dataset: {},
            blocks: [],
        });
    });
});
