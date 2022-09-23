import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';
import { TableBorderFormat } from 'roosterjs-editor-types';
import { TableMetadataFormat } from '../../../lib/publicTypes/format/formatParts/TableMetadataFormat';
import { tableMetadataFormatHandler } from '../../../lib/formatHandlers/table/tableMetadataFormatHandler';

describe('tableMetadataFormatHandler.parse', () => {
    let div: HTMLElement;
    let format: TableMetadataFormat;
    let context: DomToModelContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createDomToModelContext();
    });

    function runTest(metadata: any, expectedValue: TableMetadataFormat) {
        if (metadata) {
            div.dataset.editingInfo = JSON.stringify(metadata);
        }

        tableMetadataFormatHandler.parse(format, div, context, {});

        expect(format).toEqual(expectedValue);
    }

    it('No value', () => {
        tableMetadataFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({});
    });

    it('Empty value', () => {
        runTest({}, {});
    });

    it('Full valid value', () => {
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
        runTest(tableFormat, tableFormat);
    });

    it('Null value', () => {
        const tableFormat: TableMetadataFormat = {
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
        };
        runTest(tableFormat, {});
    });

    it('Partial valid value 1', () => {
        const tableFormat: TableMetadataFormat = {
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
    let format: TableMetadataFormat;
    let context: ModelToDomContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createModelToDomContext();
    });

    function runTest(tableFormat: TableMetadataFormat | null, expectedValue: any) {
        if (tableFormat) {
            format = tableFormat;
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

        runTest(tableFormat, tableFormat);
    });

    it('Invalid value', () => {
        runTest(
            ({
                topBorderColor: 1,
            } as any) as TableMetadataFormat,
            null
        );
    });
});
