import { DomToModelContext, ModelToDomContext, RoleFormat } from 'roosterjs-content-model-types';
import { roleFormatHandler } from '../../../lib/formatHandlers/common/roleFormatHandler';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';

describe('roleFormatHandler.parse', () => {
    let div: HTMLElement;
    let format: RoleFormat;
    let context: DomToModelContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createDomToModelContext();
    });

    it('No role', () => {
        roleFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({});
    });

    it('has role', () => {
        div.setAttribute('role', 'button');
        roleFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({
            role: 'button',
        });
    });

    it('has role with different value', () => {
        div.setAttribute('role', 'tabpanel');
        roleFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({
            role: 'tabpanel',
        });
    });

    it('has empty role', () => {
        div.setAttribute('role', '');
        roleFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({});
    });

    it('table with role="table"', () => {
        const table = document.createElement('table');
        table.setAttribute('role', 'table');
        roleFormatHandler.parse(format, table, context, {});
        expect(format).toEqual({
            role: 'table',
        });
    });

    it('table with role="grid"', () => {
        const table = document.createElement('table');
        table.setAttribute('role', 'grid');
        roleFormatHandler.parse(format, table, context, {});
        expect(format).toEqual({
            role: 'grid',
        });
    });

    it('table with role="presentation"', () => {
        const table = document.createElement('table');
        table.setAttribute('role', 'presentation');
        roleFormatHandler.parse(format, table, context, {});
        expect(format).toEqual({
            role: 'presentation',
        });
    });

    it('table with role="treegrid"', () => {
        const table = document.createElement('table');
        table.setAttribute('role', 'treegrid');
        roleFormatHandler.parse(format, table, context, {});
        expect(format).toEqual({
            role: 'treegrid',
        });
    });
});

describe('roleFormatHandler.apply', () => {
    let div: HTMLElement;
    let format: RoleFormat;
    let context: ModelToDomContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createModelToDomContext();
    });

    it('No role', () => {
        roleFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div></div>');
    });

    it('Has role', () => {
        format.role = 'button';
        roleFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div role="button"></div>');
    });

    it('Has role with different value', () => {
        format.role = 'tabpanel';
        roleFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div role="tabpanel"></div>');
    });

    it('Role applied to different element types', () => {
        format.role = 'navigation';
        const nav = document.createElement('nav');
        roleFormatHandler.apply(format, nav, context);
        expect(nav.outerHTML).toBe('<nav role="navigation"></nav>');
    });

    it('Apply role="table" to table element', () => {
        format.role = 'table';
        const table = document.createElement('table');
        roleFormatHandler.apply(format, table, context);
        expect(table.outerHTML).toBe('<table role="table"></table>');
    });

    it('Apply role="grid" to table element', () => {
        format.role = 'grid';
        const table = document.createElement('table');
        roleFormatHandler.apply(format, table, context);
        expect(table.outerHTML).toBe('<table role="grid"></table>');
    });

    it('Apply role="presentation" to table element', () => {
        format.role = 'presentation';
        const table = document.createElement('table');
        roleFormatHandler.apply(format, table, context);
        expect(table.outerHTML).toBe('<table role="presentation"></table>');
    });

    it('Apply role="treegrid" to table element', () => {
        format.role = 'treegrid';
        const table = document.createElement('table');
        roleFormatHandler.apply(format, table, context);
        expect(table.outerHTML).toBe('<table role="treegrid"></table>');
    });

    it('Apply role to table cell elements', () => {
        format.role = 'gridcell';
        const td = document.createElement('td');
        roleFormatHandler.apply(format, td, context);
        expect(td.outerHTML).toBe('<td role="gridcell"></td>');
    });

    it('Apply role to table header elements', () => {
        format.role = 'columnheader';
        const th = document.createElement('th');
        roleFormatHandler.apply(format, th, context);
        expect(th.outerHTML).toBe('<th role="columnheader"></th>');
    });

    it('Apply role to table row elements', () => {
        format.role = 'row';
        const tr = document.createElement('tr');
        roleFormatHandler.apply(format, tr, context);
        expect(tr.outerHTML).toBe('<tr role="row"></tr>');
    });
});
