import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { DirectionFormat } from '../../../lib/publicTypes/format/formatParts/DirectionFormat';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { MarginFormat } from '../../../lib/publicTypes/format/formatParts/MarginFormat';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';
import { tableDirAndMarginFormatHandler } from '../../../lib/formatHandlers/table/tableDirAndMarginFormatHandler';

describe('tableDirAndMarginFormatHandler.parse', () => {
    let context: DomToModelContext;
    let format: DirectionFormat & MarginFormat;
    let table: HTMLElement;

    beforeEach(() => {
        context = createDomToModelContext();
        format = {};
        table = document.createElement('table');
    });

    it('no format', () => {
        tableDirAndMarginFormatHandler.parse(format, table, context, {});

        expect(format).toEqual({});
    });

    it('with dir', () => {
        table.dir = 'rtl';

        tableDirAndMarginFormatHandler.parse(format, table, context, {});

        expect(format).toEqual({
            direction: 'rtl',
        });
    });

    it('with text-align', () => {
        table.style.textAlign = 'right';

        tableDirAndMarginFormatHandler.parse(format, table, context, {});

        expect(format).toEqual({
            textAlign: 'end',
        });
    });

    it('with text-align in format', () => {
        format.textAlign = 'end';

        tableDirAndMarginFormatHandler.parse(format, table, context, {});

        expect(format).toEqual({
            textAlign: 'end',
        });
    });

    it('with align=end in format', () => {
        format.htmlAlign = 'end';

        tableDirAndMarginFormatHandler.parse(format, table, context, {});

        expect(format).toEqual({
            marginLeft: 'auto',
            marginRight: '',
        });
    });

    it('with align=center in format', () => {
        format.htmlAlign = 'center';

        tableDirAndMarginFormatHandler.parse(format, table, context, {});

        expect(format).toEqual({
            marginLeft: 'auto',
            marginRight: 'auto',
        });
    });

    it('with align=start in format', () => {
        format.htmlAlign = 'start';

        tableDirAndMarginFormatHandler.parse(format, table, context, {});

        expect(format).toEqual({
            marginLeft: '',
            marginRight: 'auto',
        });
    });

    it('with align=end in format, rtl', () => {
        format.htmlAlign = 'end';
        format.direction = 'rtl';

        tableDirAndMarginFormatHandler.parse(format, table, context, {});

        expect(format).toEqual({
            marginLeft: '',
            marginRight: 'auto',
            direction: 'rtl',
        });
    });

    it('with align=center in format, rtl', () => {
        format.htmlAlign = 'center';
        format.direction = 'rtl';

        tableDirAndMarginFormatHandler.parse(format, table, context, {});

        expect(format).toEqual({
            marginLeft: 'auto',
            marginRight: 'auto',
            direction: 'rtl',
        });
    });

    it('with align=start in format, rtl', () => {
        format.htmlAlign = 'start';
        format.direction = 'rtl';

        tableDirAndMarginFormatHandler.parse(format, table, context, {});

        expect(format).toEqual({
            marginLeft: 'auto',
            marginRight: '',
            direction: 'rtl',
        });
    });

    it('with align=center and text-align=center in format, ignore them', () => {
        format.htmlAlign = 'center';
        format.textAlign = 'center';

        tableDirAndMarginFormatHandler.parse(format, table, context, {});

        // Tested in Chrome and Firefox, when both align and text-align have value, browser will ignore them
        expect(format).toEqual({
            textAlign: 'center',
        });
    });

    it('with align in both format and table', () => {
        format.htmlAlign = 'center';
        table.setAttribute('align', 'right');

        tableDirAndMarginFormatHandler.parse(format, table, context, {});

        // Tested in Chrome and Firefox, when both align and text-align have value, browser will ignore them
        expect(format).toEqual({
            marginLeft: 'auto',
            marginRight: 'auto',
            htmlAlign: 'end',
        });
    });

    it('with align in format and margin in table format and table', () => {
        format.htmlAlign = 'center';
        table.style.marginRight = '40px';

        tableDirAndMarginFormatHandler.parse(format, table, context, {});

        // Tested in Chrome and Firefox, when both align and text-align have value, browser will ignore them
        expect(format).toEqual({
            marginLeft: 'auto',
            marginRight: '40px',
        });
    });
});

describe('tableDirAndMarginFormatHandler.apply', () => {
    let context: ModelToDomContext;
    let table: HTMLElement;
    let format: DirectionFormat & MarginFormat;

    beforeEach(() => {
        context = createModelToDomContext();
        table = document.createElement('table');
        format = {};
    });

    it('no format', () => {
        tableDirAndMarginFormatHandler.apply(format, table, context);

        expect(table.outerHTML).toBe('<table></table>');
    });

    it('with dir', () => {
        format.direction = 'rtl';

        tableDirAndMarginFormatHandler.apply(format, table, context);

        expect(table.outerHTML).toBe('<table style="direction: rtl;"></table>');
    });

    it('with text-align', () => {
        format.textAlign = 'end';

        tableDirAndMarginFormatHandler.apply(format, table, context);

        expect(table.outerHTML).toBe('<table style="text-align: right;"></table>');
    });

    it('with html align', () => {
        format.htmlAlign = 'end';

        tableDirAndMarginFormatHandler.apply(format, table, context);

        expect(table.outerHTML).toBe('<table align="right"></table>');
    });

    it('with dir and text-align', () => {
        format.direction = 'rtl';
        format.textAlign = 'end';

        tableDirAndMarginFormatHandler.apply(format, table, context);

        expect(table.outerHTML).toBe('<table style="direction: rtl; text-align: left;"></table>');
    });

    it('with dir, text-align, html align and margin', () => {
        format.direction = 'rtl';
        format.textAlign = 'center';
        format.htmlAlign = 'end';
        format.marginLeft = '40px';

        tableDirAndMarginFormatHandler.apply(format, table, context);

        expect(table.outerHTML).toBe(
            '<table align="left" style="direction: rtl; text-align: center; margin-left: 40px;"></table>'
        );
    });
});
