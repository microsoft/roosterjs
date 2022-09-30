import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';
import { TableCellMetadataFormat } from 'roosterjs-editor-types';
import { tableCellMetadataFormatHandler } from '../../../lib/formatHandlers/table/tableCellMetadataFormatHandler';

describe('tableCellMetadataFormatHandler.parse', () => {
    let div: HTMLElement;
    let format: TableCellMetadataFormat;
    let context: DomToModelContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createDomToModelContext();
    });

    function runTest(metadata: any, expectedValue: TableCellMetadataFormat) {
        if (metadata) {
            div.dataset.editingInfo = JSON.stringify(metadata);
        }

        tableCellMetadataFormatHandler.parse(format, div, context, {});

        expect(format).toEqual(expectedValue);
    }

    it('No value', () => {
        tableCellMetadataFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({});
    });

    it('Empty value', () => {
        runTest({}, {});
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
    let context: ModelToDomContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createModelToDomContext();
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
