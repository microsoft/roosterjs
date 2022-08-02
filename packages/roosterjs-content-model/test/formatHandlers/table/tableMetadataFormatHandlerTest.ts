import { ContentModelContext } from '../../../lib/publicTypes/ContentModelContext';
import { MetadataFormat } from '../../../lib/publicTypes/format/formatParts/MetadataFormat';
import { TableBorderFormat, TableFormat } from 'roosterjs-editor-types';
import { tableMetadataFormatHandler } from '../../../lib/formatHandlers/table/tableMetadataFormatHandler';

describe('tableMetadataFormatHandler.parse', () => {
    let div: HTMLElement;
    let format: MetadataFormat<TableFormat>;
    let context: ContentModelContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = {
            isDarkMode: false,
            zoomScale: 1,
            isRightToLeft: false,
        };
    });

    function runTest(metadata: any, expectedValue: MetadataFormat<TableFormat>) {
        if (metadata) {
            div.dataset.editingInfo = JSON.stringify(metadata);
        }

        tableMetadataFormatHandler.parse(format, div, context);

        expect(format).toEqual(expectedValue);
    }

    it('No value', () => {
        tableMetadataFormatHandler.parse(format, div, context);
        expect(format).toEqual({});
    });

    it('Empty value', () => {
        runTest({}, {});
    });

    it('Full valid value', () => {
        const tableFormat: TableFormat = {
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
            keepCellShade: true,
        };
        runTest(tableFormat, { metadata: tableFormat });
    });

    it('Null value', () => {
        const tableFormat: TableFormat = {
            topBorderColor: null,
            bottomBorderColor: null,
            verticalBorderColor: null,
            hasHeaderRow: undefined,
            headerRowColor: undefined,
            hasFirstColumn: undefined,
            hasBandedColumns: undefined,
            hasBandedRows: undefined,
            bgColorEven: null,
            bgColorOdd: null,
            tableBorderFormat: undefined,
            keepCellShade: undefined,
        };
        runTest(tableFormat, {});
    });

    it('Partial valid value 1', () => {
        const tableFormat: TableFormat = {
            topBorderColor: 'red',
            bottomBorderColor: 'blue',
            verticalBorderColor: 'green',
            hasHeaderRow: true,
            headerRowColor: 'orange',
        };

        runTest(tableFormat, {});
    });
});

describe('tableMetadataFormatHandler.apply', () => {
    let div: HTMLElement;
    let format: MetadataFormat<TableFormat>;
    let context: ContentModelContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = {
            isDarkMode: false,
            zoomScale: 1,
            isRightToLeft: false,
        };
    });

    function runTest(tableFormat: TableFormat | null, expectedValue: any) {
        if (tableFormat) {
            format.metadata = tableFormat;
        }

        tableMetadataFormatHandler.apply(format, div, context);

        if (div.dataset.editingInfo) {
            const result = JSON.parse(div.dataset.editingInfo);
            expect(result).toEqual(expectedValue);
        } else {
            expect(expectedValue).toBeNull();
        }
    }

    it('No value', () => {
        runTest(null, null);
    });

    it('Empty value', () => {
        runTest({}, null);
    });

    it('Full value', () => {
        const tableFormat: TableFormat = {
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
            keepCellShade: true,
        };

        runTest(tableFormat, tableFormat);
    });

    it('Invalid value', () => {
        runTest(
            ({
                topBorderColor: 1,
            } as any) as TableFormat,
            null
        );
    });
});
