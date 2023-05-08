import { ContentModelTable } from '../../../lib/publicTypes/block/ContentModelTable';
import { TableBorderFormat } from 'roosterjs-editor-types';
import { TableMetadataFormat } from '../../../lib/publicTypes/format/formatParts/TableMetadataFormat';
import { updateTableMetadata } from '../../../lib/domUtils/metadata/updateTableMetadata';

describe('updateTableMetadata', () => {
    it('No value', () => {
        const table: ContentModelTable = {
            blockType: 'Table',
            format: {},
            rows: [],
            widths: [],
            dataset: {},
        };
        const callback = jasmine.createSpy('callback').and.returnValue(null);

        updateTableMetadata(table, callback);

        expect(callback).toHaveBeenCalledWith(null);
        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [],
            widths: [],
            dataset: {},
        });
    });

    it('Empty value', () => {
        const table: ContentModelTable = {
            blockType: 'Table',
            format: {},
            rows: [],
            widths: [],
            dataset: {
                editingInfo: '',
            },
        };
        const callback = jasmine.createSpy('callback').and.returnValue(null);

        updateTableMetadata(table, callback);

        expect(callback).toHaveBeenCalledWith(null);
        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [],
            widths: [],
            dataset: {},
        });
    });

    it('Full valid value, return original value', () => {
        const tableFormat: TableMetadataFormat = {
            topBorderColor: 'red',
            bottomBorderColor: 'blue',
            verticalBorderColor: 'green',
            hasHeaderRow: true,
            headerRowColor: 'orange',
            hasFirstColumn: true,
            hasBandedColumns: false,
            hasBandedRows: true,
            bgColorEven: 'yellow',
            bgColorOdd: 'gray',
            tableBorderFormat: TableBorderFormat.DEFAULT,
        };
        const table: ContentModelTable = {
            blockType: 'Table',
            format: {},
            rows: [],
            widths: [],
            dataset: {
                editingInfo: JSON.stringify(tableFormat),
            },
        };
        const callback = jasmine.createSpy('callback').and.callFake(format => format);

        updateTableMetadata(table, callback);

        expect(callback).toHaveBeenCalledWith(tableFormat);
        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [],
            widths: [],
            dataset: {
                editingInfo: JSON.stringify(tableFormat),
            },
        });
    });

    it('Full valid value, return invalid value', () => {
        const tableFormat: TableMetadataFormat = {
            topBorderColor: 'red',
            bottomBorderColor: 'blue',
            verticalBorderColor: 'green',
            hasHeaderRow: true,
            headerRowColor: 'orange',
            hasFirstColumn: true,
            hasBandedColumns: false,
            hasBandedRows: true,
            bgColorEven: 'yellow',
            bgColorOdd: 'gray',
            tableBorderFormat: TableBorderFormat.DEFAULT,
        };
        const table: ContentModelTable = {
            blockType: 'Table',
            format: {},
            rows: [],
            widths: [],
            dataset: {
                editingInfo: JSON.stringify(tableFormat),
            },
        };
        const callback = jasmine.createSpy('callback').and.returnValue({
            widthPx: 1,
            heightPx: 2,
        });

        updateTableMetadata(table, callback);

        expect(callback).toHaveBeenCalledWith(tableFormat);
        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [],
            widths: [],
            dataset: {
                editingInfo: JSON.stringify(tableFormat),
            },
        });
    });

    it('Full valid value, change value', () => {
        const tableFormat: TableMetadataFormat = {
            topBorderColor: 'red',
            bottomBorderColor: 'blue',
            verticalBorderColor: 'green',
            hasHeaderRow: true,
            headerRowColor: 'orange',
            hasFirstColumn: true,
            hasBandedColumns: false,
            hasBandedRows: true,
            bgColorEven: 'yellow',
            bgColorOdd: 'gray',
            tableBorderFormat: TableBorderFormat.DEFAULT,
        };
        const table: ContentModelTable = {
            blockType: 'Table',
            format: {},
            rows: [],
            widths: [],
            dataset: {
                editingInfo: JSON.stringify(tableFormat),
            },
        };
        const callback = jasmine.createSpy('callback').and.callFake(format => {
            const result = {
                ...format,
                topBorderColor: 'green',
            };
            return result;
        });

        updateTableMetadata(table, callback);

        expect(callback).toHaveBeenCalledWith(tableFormat);

        tableFormat.topBorderColor = 'green';
        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [],
            widths: [],
            dataset: {
                editingInfo: JSON.stringify(tableFormat),
            },
        });
    });

    it('Full valid value, return null', () => {
        const tableFormat: TableMetadataFormat = {
            topBorderColor: 'red',
            bottomBorderColor: 'blue',
            verticalBorderColor: 'green',
            hasHeaderRow: true,
            headerRowColor: 'orange',
            hasFirstColumn: true,
            hasBandedColumns: false,
            hasBandedRows: true,
            bgColorEven: 'yellow',
            bgColorOdd: 'gray',
            tableBorderFormat: TableBorderFormat.DEFAULT,
        };
        const table: ContentModelTable = {
            blockType: 'Table',
            format: {},
            rows: [],
            widths: [],
            dataset: {
                editingInfo: JSON.stringify(tableFormat),
            },
        };
        const callback = jasmine.createSpy('callback').and.returnValue(null);

        updateTableMetadata(table, callback);

        expect(callback).toHaveBeenCalledWith(tableFormat);
        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [],
            widths: [],
            dataset: {},
        });
    });

    it('Partial valid value, return original value', () => {
        const tableFormat: TableMetadataFormat = {
            topBorderColor: 'red',
            bottomBorderColor: 'blue',
            verticalBorderColor: 'green',
        };
        const table: ContentModelTable = {
            blockType: 'Table',
            format: {},
            rows: [],
            widths: [],
            dataset: {
                editingInfo: JSON.stringify(tableFormat),
            },
        };
        const callback = jasmine.createSpy('callback').and.callFake(format => format);

        updateTableMetadata(table, callback);

        expect(callback).toHaveBeenCalledWith(null);
        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [],
            widths: [],
            dataset: {},
        });
    });

    it('Partial valid value, return a valid value', () => {
        const tableFormat: TableMetadataFormat = {
            topBorderColor: 'red',
            bottomBorderColor: 'blue',
            verticalBorderColor: 'green',
        };
        const validFormat = {
            topBorderColor: 'red',
            bottomBorderColor: 'blue',
            verticalBorderColor: 'green',
            hasHeaderRow: true,
            headerRowColor: 'orange',
            hasFirstColumn: true,
            hasBandedColumns: false,
            hasBandedRows: true,
            bgColorEven: 'yellow',
            bgColorOdd: 'gray',
            tableBorderFormat: TableBorderFormat.DEFAULT,
        };
        const table: ContentModelTable = {
            blockType: 'Table',
            format: {},
            rows: [],
            widths: [],
            dataset: {
                editingInfo: JSON.stringify(tableFormat),
            },
        };
        const callback = jasmine.createSpy('callback').and.returnValue(validFormat);

        updateTableMetadata(table, callback);

        expect(callback).toHaveBeenCalledWith(null);
        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [],
            widths: [],
            dataset: {
                editingInfo: JSON.stringify(validFormat),
            },
        });
    });
});
