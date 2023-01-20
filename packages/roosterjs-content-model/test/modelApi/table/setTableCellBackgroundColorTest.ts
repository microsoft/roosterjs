import { createTableCell } from '../../../lib/modelApi/creators/createTableCell';
import { setTableCellBackgroundColor } from '../../../lib/modelApi/table/setTableCellBackgroundColor';

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
