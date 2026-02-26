import { ContentModelTable, TableMetadataFormat } from 'roosterjs-content-model-types';
import { TableBorderFormat } from '../../../lib/constants/TableBorderFormat';
import {
    getTableMetadata,
    updateTableMetadata,
} from '../../../lib/modelApi/metadata/updateTableMetadata';

describe('getTableMetadata', () => {
    it('No value', () => {
        const table: ContentModelTable = {
            blockType: 'Table',
            format: {},
            rows: [],
            widths: [],
            dataset: {},
        };
        const result = getTableMetadata(table);

        expect(result).toBeNull();
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
        const result = getTableMetadata(table);

        expect(result).toBeNull();
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
            tableBorderFormat: TableBorderFormat.Default,
            verticalAlign: 'top',
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
        const result = getTableMetadata(table);

        expect(result).toEqual({
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
            tableBorderFormat: TableBorderFormat.Default,
            verticalAlign: 'top',
        });
    });
});

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
            tableBorderFormat: TableBorderFormat.Default,
            verticalAlign: 'top',
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
            tableBorderFormat: TableBorderFormat.Default,
            verticalAlign: 'top',
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
            tableBorderFormat: TableBorderFormat.Default,
            verticalAlign: 'top',
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
            tableBorderFormat: TableBorderFormat.Default,
            verticalAlign: 'top',
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
            tableBorderFormat: TableBorderFormat.Default,
            verticalAlign: 'top',
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

    it('Full valid value with headerRowCustomStyles', () => {
        const tableFormat: TableMetadataFormat = {
            topBorderColor: 'red',
            bottomBorderColor: 'blue',
            verticalBorderColor: 'green',
            hasHeaderRow: true,
            headerRowColor: 'orange',
            headerRowCustomStyles: {
                fontWeight: 'bold',
                italic: true,
                textAlign: 'center',
                backgroundColor: 'lightblue',
            },
            hasFirstColumn: false,
            hasBandedColumns: false,
            hasBandedRows: true,
            bgColorEven: 'yellow',
            bgColorOdd: 'gray',
            tableBorderFormat: TableBorderFormat.Default,
            verticalAlign: 'top',
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

    it('Full valid value with firstColumnCustomStyles', () => {
        const tableFormat: TableMetadataFormat = {
            topBorderColor: 'red',
            bottomBorderColor: 'blue',
            verticalBorderColor: 'green',
            hasHeaderRow: false,
            headerRowColor: 'orange',
            hasFirstColumn: true,
            firstColumnCustomStyles: {
                fontWeight: 'bold',
                italic: false,
                borderLeftColor: 'black',
                borderRightColor: 'gray',
            },
            hasBandedColumns: false,
            hasBandedRows: true,
            bgColorEven: 'yellow',
            bgColorOdd: 'gray',
            tableBorderFormat: TableBorderFormat.Default,
            verticalAlign: 'top',
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

    it('Full valid value with both headerRowCustomStyles and firstColumnCustomStyles', () => {
        const tableFormat: TableMetadataFormat = {
            topBorderColor: 'red',
            bottomBorderColor: 'blue',
            verticalBorderColor: 'green',
            hasHeaderRow: true,
            headerRowColor: 'orange',
            headerRowCustomStyles: {
                fontWeight: 'bold',
                backgroundColor: 'lightgray',
                borderBottomColor: 'black',
            },
            hasFirstColumn: true,
            firstColumnCustomStyles: {
                fontWeight: 'bold',
                italic: true,
                textAlign: 'end',
            },
            hasBandedColumns: false,
            hasBandedRows: true,
            bgColorEven: 'yellow',
            bgColorOdd: 'gray',
            tableBorderFormat: TableBorderFormat.Default,
            verticalAlign: 'top',
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

    it('Update headerRowCustomStyles value', () => {
        const tableFormat: TableMetadataFormat = {
            topBorderColor: 'red',
            bottomBorderColor: 'blue',
            verticalBorderColor: 'green',
            hasHeaderRow: true,
            headerRowColor: 'orange',
            headerRowCustomStyles: {
                fontWeight: 'bold',
            },
            hasFirstColumn: false,
            hasBandedColumns: false,
            hasBandedRows: true,
            bgColorEven: 'yellow',
            bgColorOdd: 'gray',
            tableBorderFormat: TableBorderFormat.Default,
            verticalAlign: 'top',
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
            return {
                ...format,
                headerRowCustomStyles: {
                    fontWeight: 'normal',
                    italic: true,
                    backgroundColor: 'white',
                },
            };
        });

        updateTableMetadata(table, callback);

        expect(callback).toHaveBeenCalledWith(tableFormat);

        const expectedFormat = {
            ...tableFormat,
            headerRowCustomStyles: {
                fontWeight: 'normal',
                italic: true,
                backgroundColor: 'white',
            },
        };
        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [],
            widths: [],
            dataset: {
                editingInfo: JSON.stringify(expectedFormat),
            },
        });
    });

    it('Update firstColumnCustomStyles value', () => {
        const tableFormat: TableMetadataFormat = {
            topBorderColor: 'red',
            bottomBorderColor: 'blue',
            verticalBorderColor: 'green',
            hasHeaderRow: false,
            headerRowColor: 'orange',
            hasFirstColumn: true,
            firstColumnCustomStyles: {
                fontWeight: 'bold',
            },
            hasBandedColumns: false,
            hasBandedRows: true,
            bgColorEven: 'yellow',
            bgColorOdd: 'gray',
            tableBorderFormat: TableBorderFormat.Default,
            verticalAlign: 'top',
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
            return {
                ...format,
                firstColumnCustomStyles: {
                    fontWeight: 'normal',
                    textAlign: 'right',
                    borderTopColor: 'red',
                    borderBottomColor: 'red',
                },
            };
        });

        updateTableMetadata(table, callback);

        expect(callback).toHaveBeenCalledWith(tableFormat);

        const expectedFormat = {
            ...tableFormat,
            firstColumnCustomStyles: {
                fontWeight: 'normal',
                textAlign: 'right',
                borderTopColor: 'red',
                borderBottomColor: 'red',
            },
        };
        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [],
            widths: [],
            dataset: {
                editingInfo: JSON.stringify(expectedFormat),
            },
        });
    });
});
