import { ContentModelContext } from '../../../lib/publicTypes/ContentModelContext';
import { MetadataFormat } from '../../../lib/publicTypes/format/formatParts/MetadataFormat';
import { TableCellFormat } from '../../../lib/publicTypes/format/ContentModelTableCellFormat';
import { tableCellMetadataFormatHandler } from '../../../lib/formatHandlers/table/tableCellMetadataFormatHandler';

describe('tableCellMetadataFormatHandler.parse', () => {
    let div: HTMLElement;
    let format: MetadataFormat<TableCellFormat>;
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

    function runTest(metadata: any, expectedValue: MetadataFormat<TableCellFormat>) {
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
        runTest(
            {},
            {
                metadata: {},
            }
        );
    });

    it('Full valid value', () => {
        const tableCellFormat: TableCellFormat = {
            bgColorOverride: true,
        };
        runTest(tableCellFormat, { metadata: tableCellFormat });
    });
});

describe('tableCellMetadataFormatHandler.apply', () => {
    let div: HTMLElement;
    let format: MetadataFormat<TableCellFormat>;
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

    function runTest(tableCellFormat: TableCellFormat | null, expectedValue: any) {
        if (tableCellFormat) {
            format.metadata = tableCellFormat;
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
        runTest({}, {});
    });

    it('Full value', () => {
        const tableCellFormat: TableCellFormat = {
            bgColorOverride: true,
        };

        runTest(tableCellFormat, tableCellFormat);
    });

    it('Invalid value', () => {
        runTest(
            ({
                bgColorOverride: 'test',
            } as any) as TableCellFormat,
            null
        );
    });
});
