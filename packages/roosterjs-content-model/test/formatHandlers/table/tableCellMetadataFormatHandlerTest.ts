import { ContentModelContext } from '../../../lib/publicTypes/ContentModelContext';
import { TableCellMetadataFormat } from '../../../lib/publicTypes/format/formatParts/TableCellMetadataFormat';
import { tableCellMetadataFormatHandler } from '../../../lib/formatHandlers/table/tableCellMetadataFormatHandler';

describe('tableCellMetadataFormatHandler.parse', () => {
    let div: HTMLElement;
    let format: TableCellMetadataFormat;
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

    function runTest(metadata: any, expectedValue: TableCellMetadataFormat) {
        if (metadata) {
            div.dataset.editingInfo = JSON.stringify(metadata);
        }

        tableCellMetadataFormatHandler.parse(format, div, context);

        expect(format).toEqual(expectedValue);
    }

    it('No value', () => {
        tableCellMetadataFormatHandler.parse(format, div, context);
        expect(format).toEqual({});
    });

    it('Empty value', () => {
        runTest({}, { bgColorOverride: undefined });
    });

    it('Full valid value', () => {
        const tableCellFormat: TableCellMetadataFormat = {
            bgColorOverride: true,
        };
        runTest(tableCellFormat, tableCellFormat);
    });
});

describe('tableCellMetadataFormatHandler.apply', () => {
    let div: HTMLElement;
    let format: TableCellMetadataFormat;
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

    function runTest(tableCellFormat: TableCellMetadataFormat | null, expectedValue: any) {
        if (tableCellFormat) {
            format = tableCellFormat;
        }

        tableCellMetadataFormatHandler.apply(format, div, context);

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
        const tableCellFormat: TableCellMetadataFormat = {
            bgColorOverride: true,
        };

        runTest(tableCellFormat, tableCellFormat);
    });

    it('Invalid value', () => {
        runTest(
            ({
                bgColorOverride: 'test',
            } as any) as TableCellMetadataFormat,
            null
        );
    });
});
