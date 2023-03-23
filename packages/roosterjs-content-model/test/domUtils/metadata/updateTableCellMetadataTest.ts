import { ContentModelTableCell } from '../../../lib/publicTypes/group/ContentModelTableCell';
import { TableCellMetadataFormat } from 'roosterjs-editor-types';
import { updateTableCellMetadata } from '../../../lib/domUtils/metadata/updateTableCellMetadata';

describe('updateTableCellMetadata', () => {
    it('No value', () => {
        const cell: ContentModelTableCell = {
            blockGroupType: 'TableCell',
            format: {},
            blocks: [],
            spanAbove: false,
            spanLeft: false,
            dataset: {},
        };
        const callback = jasmine.createSpy('callback').and.returnValue(null);

        updateTableCellMetadata(cell, callback);

        expect(callback).toHaveBeenCalledWith(null);
        expect(cell).toEqual({
            blockGroupType: 'TableCell',
            format: {},
            blocks: [],
            spanAbove: false,
            spanLeft: false,
            dataset: {},
        });
    });

    it('Empty value', () => {
        const cell: ContentModelTableCell = {
            blockGroupType: 'TableCell',
            format: {},
            blocks: [],
            spanAbove: false,
            spanLeft: false,
            dataset: {
                editingInfo: '',
            },
        };
        const callback = jasmine.createSpy('callback').and.returnValue(null);

        updateTableCellMetadata(cell, callback);

        expect(callback).toHaveBeenCalledWith(null);
        expect(cell).toEqual({
            blockGroupType: 'TableCell',
            format: {},
            blocks: [],
            spanAbove: false,
            spanLeft: false,
            dataset: {},
        });
    });

    it('Full valid value, return original value', () => {
        const cellFormat: TableCellMetadataFormat = {
            bgColorOverride: true,
        };
        const cell: ContentModelTableCell = {
            blockGroupType: 'TableCell',
            format: {},
            blocks: [],
            spanAbove: false,
            spanLeft: false,
            dataset: {
                editingInfo: JSON.stringify(cellFormat),
            },
        };
        const callback = jasmine.createSpy('callback').and.callFake(format => format);

        updateTableCellMetadata(cell, callback);

        expect(callback).toHaveBeenCalledWith(cellFormat);
        expect(cell).toEqual({
            blockGroupType: 'TableCell',
            format: {},
            blocks: [],
            spanAbove: false,
            spanLeft: false,
            dataset: {
                editingInfo: JSON.stringify(cellFormat),
            },
        });
    });

    it('Full valid value, return partial value', () => {
        const cellFormat: TableCellMetadataFormat = {
            bgColorOverride: true,
        };
        const cell: ContentModelTableCell = {
            blockGroupType: 'TableCell',
            format: {},
            blocks: [],
            spanAbove: false,
            spanLeft: false,
            dataset: {
                editingInfo: JSON.stringify(cellFormat),
            },
        };
        const callback = jasmine.createSpy('callback').and.returnValue('test');

        updateTableCellMetadata(cell, callback);

        expect(callback).toHaveBeenCalledWith(cellFormat);
        expect(cell).toEqual({
            blockGroupType: 'TableCell',
            format: {},
            blocks: [],
            spanAbove: false,
            spanLeft: false,
            dataset: {
                editingInfo: JSON.stringify(cellFormat),
            },
        });
    });

    it('Full valid value, change value', () => {
        const cellFormat: TableCellMetadataFormat = {
            bgColorOverride: true,
        };
        const cell: ContentModelTableCell = {
            blockGroupType: 'TableCell',
            format: {},
            blocks: [],
            spanAbove: false,
            spanLeft: false,
            dataset: {
                editingInfo: JSON.stringify(cellFormat),
            },
        };
        const callback = jasmine.createSpy('callback').and.callFake(format => {
            const result = {
                ...format,
                bgColorOverride: false,
            };
            return result;
        });

        updateTableCellMetadata(cell, callback);

        expect(callback).toHaveBeenCalledWith(cellFormat);

        cellFormat.bgColorOverride = false;
        expect(cell).toEqual({
            blockGroupType: 'TableCell',
            format: {},
            blocks: [],
            spanAbove: false,
            spanLeft: false,
            dataset: {
                editingInfo: JSON.stringify(cellFormat),
            },
        });
    });

    it('Full valid value, return null', () => {
        const cellFormat: TableCellMetadataFormat = {
            bgColorOverride: true,
        };
        const cell: ContentModelTableCell = {
            blockGroupType: 'TableCell',
            format: {},
            blocks: [],
            spanAbove: false,
            spanLeft: false,
            dataset: {
                editingInfo: JSON.stringify(cellFormat),
            },
        };
        const callback = jasmine.createSpy('callback').and.returnValue(null);

        updateTableCellMetadata(cell, callback);

        expect(callback).toHaveBeenCalledWith(cellFormat);
        expect(cell).toEqual({
            blockGroupType: 'TableCell',
            format: {},
            blocks: [],
            spanAbove: false,
            spanLeft: false,
            dataset: {},
        });
    });

    it('Partial value, return original value', () => {
        const cellFormat: TableCellMetadataFormat = ({
            a: 'b',
        } as any) as TableCellMetadataFormat;
        const cell: ContentModelTableCell = {
            blockGroupType: 'TableCell',
            format: {},
            blocks: [],
            spanAbove: false,
            spanLeft: false,
            dataset: {
                editingInfo: JSON.stringify(cellFormat),
            },
        };
        const callback = jasmine.createSpy('callback').and.callFake(format => format);

        updateTableCellMetadata(cell, callback);

        expect(callback).toHaveBeenCalledWith({ a: 'b' });
        expect(cell).toEqual({
            blockGroupType: 'TableCell',
            format: {},
            blocks: [],
            spanAbove: false,
            spanLeft: false,
            dataset: {
                editingInfo: '{"a":"b"}',
            },
        });
    });

    it('Partial value, return a valid value', () => {
        const cellFormat: TableCellMetadataFormat = ({
            a: 'b',
        } as any) as TableCellMetadataFormat;
        const validFormat: TableCellMetadataFormat = {
            bgColorOverride: true,
        };
        const cell: ContentModelTableCell = {
            blockGroupType: 'TableCell',
            format: {},
            blocks: [],
            spanAbove: false,
            spanLeft: false,
            dataset: {
                editingInfo: JSON.stringify(cellFormat),
            },
        };
        const callback = jasmine.createSpy('callback').and.returnValue(validFormat);

        updateTableCellMetadata(cell, callback);

        expect(callback).toHaveBeenCalledWith({ a: 'b' });
        expect(cell).toEqual({
            blockGroupType: 'TableCell',
            format: {},
            blocks: [],
            spanAbove: false,
            spanLeft: false,
            dataset: {
                editingInfo: JSON.stringify(validFormat),
            },
        });
    });
});
