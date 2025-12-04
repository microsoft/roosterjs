import { legacyTableBorderFormatHandler } from '../../../lib/formatHandlers/table/legacyTableBorderFormatHandler';
import type {
    DomToModelContext,
    LegacyTableBorderFormat,
    ModelToDomContext,
} from 'roosterjs-content-model-types';

describe('legacyTableBorderFormatHandler.parse', () => {
    let format: LegacyTableBorderFormat;
    let table: HTMLTableElement;
    let context: DomToModelContext;

    beforeEach(() => {
        format = {};
        table = document.createElement('table');
        context = {} as any;
    });

    it('No border attribute', () => {
        legacyTableBorderFormatHandler.parse(format, table, context, {});
        expect(format.legacyTableBorder).toBeUndefined();
    });

    it('With border attribute', () => {
        table.setAttribute('border', '1');
        legacyTableBorderFormatHandler.parse(format, table, context, {});
        expect(format.legacyTableBorder).toBe('1');
    });

    it('With cellspacing attribute', () => {
        table.setAttribute('cellspacing', '2');
        legacyTableBorderFormatHandler.parse(format, table, context, {});
        expect(format.cellSpacing).toBe('2');
    });

    it('With cellpadding attribute', () => {
        table.setAttribute('cellpadding', '3');
        legacyTableBorderFormatHandler.parse(format, table, context, {});
        expect(format.cellpadding).toBe('3');
    });
});

describe('legacyTableBorderFormatHandler.apply', () => {
    let format: LegacyTableBorderFormat;
    let table: HTMLTableElement;
    let context: ModelToDomContext;

    beforeEach(() => {
        format = {};
        table = document.createElement('table');
        context = {} as any;
    });

    it('No border format', () => {
        legacyTableBorderFormatHandler.apply(format, table, context);
        expect(table.getAttribute('border')).toBeNull();
    });

    it('With border format', () => {
        format.legacyTableBorder = '2';
        legacyTableBorderFormatHandler.apply(format, table, context);
        expect(table.getAttribute('border')).toBe('2');
    });

    it('With cellspacing format', () => {
        format.cellSpacing = '4';
        legacyTableBorderFormatHandler.apply(format, table, context);
        expect(table.getAttribute('cellspacing')).toBe('4');
    });

    it('With cellpadding format', () => {
        format.cellpadding = '5';
        legacyTableBorderFormatHandler.apply(format, table, context);
        expect(table.getAttribute('cellpadding')).toBe('5');
    });
});
