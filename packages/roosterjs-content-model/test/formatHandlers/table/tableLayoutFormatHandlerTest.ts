import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';
import { TableLayoutFormat } from '../../../lib/publicTypes/format/formatParts/TableLayoutFormat';
import { tableLayoutFormatHandler } from '../../../lib/formatHandlers/table/tableLayoutFormatHandler';

describe('tableLayoutFormatHandler.parse', () => {
    let table: HTMLElement;
    let format: TableLayoutFormat;
    let context: DomToModelContext;

    beforeEach(() => {
        table = document.createElement('table');
        format = {};
        context = createDomToModelContext();
    });

    it('No value', () => {
        tableLayoutFormatHandler.parse(format, table, context, {});
        expect(format).toEqual({});
    });

    it('Fixed Table Layout', () => {
        table.style.tableLayout = 'fixed';
        tableLayoutFormatHandler.parse(format, table, context, {});
        expect(format).toEqual({ tableLayout: 'fixed' });
    });

    it('Auto Table Layout', () => {
        table.style.tableLayout = 'auto';
        tableLayoutFormatHandler.parse(format, table, context, {});
        expect(format).toEqual({ tableLayout: 'auto' });
    });

    it('Auto Table Layout', () => {
        table.style.tableLayout = 'inherit';
        tableLayoutFormatHandler.parse(format, table, context, {});
        expect(format).toEqual({});
    });
});

describe('tableLayoutFormatHandler.apply', () => {
    let table: HTMLElement;
    let format: TableLayoutFormat;
    let context: ModelToDomContext;

    beforeEach(() => {
        table = document.createElement('table');
        format = {};
        context = createModelToDomContext();
    });

    it('No value', () => {
        tableLayoutFormatHandler.apply(format, table, context);
        expect(table.outerHTML).toEqual('<table></table>');
    });

    it('Fixed Table Layout', () => {
        format.tableLayout = 'fixed';
        tableLayoutFormatHandler.apply(format, table, context);
        expect(table.outerHTML).toEqual('<table style="table-layout: fixed;"></table>');
    });
});
