import * as tableProcessor from '../../../lib/domToModel/processors/tableProcessor';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { tablePreProcessor } from '../../../lib/domToModel/processors/tablePreProcessor';

describe('tablePreProcessor', () => {
    it('Table without metadata, use Entity', () => {
        const table = document.createElement('table');
        const group = createContentModelDocument();
        const context = createDomToModelContext();

        tablePreProcessor(group, table, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Entity',
                    segmentType: 'Entity',
                    format: {},
                    id: undefined,
                    type: undefined,
                    isReadonly: true,
                    wrapper: table,
                },
            ],
        });
    });

    it('Table with metadata, do not use Entity', () => {
        const table = document.createElement('table');
        const group = createContentModelDocument();
        const context = createDomToModelContext();
        const tableProcessorSpy = spyOn(tableProcessor, 'tableProcessor');

        table.dataset.editingInfo = '{}';

        tablePreProcessor(group, table, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [],
        });
        expect(tableProcessorSpy).toHaveBeenCalledWith(group, table, context);
    });

    it('Table with regular selection 1, do not use Entity', () => {
        const table = document.createElement('table');
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        const txt = document.createTextNode('test');
        const group = createContentModelDocument();
        const context = createDomToModelContext();
        const tableProcessorSpy = spyOn(tableProcessor, 'tableProcessor');

        table.appendChild(tr);
        tr.appendChild(td);
        td.appendChild(txt);

        context.regularSelection = {
            startContainer: txt,
        } as any;

        tablePreProcessor(group, table, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [],
        });
        expect(tableProcessorSpy).toHaveBeenCalledWith(group, table, context);
    });

    it('Table with regular selection 2, do not use Entity', () => {
        const table = document.createElement('table');
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        const txt = document.createTextNode('test');
        const group = createContentModelDocument();
        const context = createDomToModelContext();
        const tableProcessorSpy = spyOn(tableProcessor, 'tableProcessor');

        table.appendChild(tr);
        tr.appendChild(td);
        td.appendChild(txt);

        context.regularSelection = {
            endContainer: txt,
        } as any;

        tablePreProcessor(group, table, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [],
        });
        expect(tableProcessorSpy).toHaveBeenCalledWith(group, table, context);
    });

    it('Table with regular selection 3, do not use Entity', () => {
        const table = document.createElement('table');
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        const txt = document.createTextNode('test');
        const group = createContentModelDocument();
        const context = createDomToModelContext();
        const tableProcessorSpy = spyOn(tableProcessor, 'tableProcessor');

        table.appendChild(tr);
        tr.appendChild(td);
        td.appendChild(txt);

        context.regularSelection = {
            startContainer: table,
        } as any;

        tablePreProcessor(group, table, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [],
        });
        expect(tableProcessorSpy).toHaveBeenCalledWith(group, table, context);
    });

    it('Table with table selection, do not use Entity', () => {
        const table = document.createElement('table');
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        const txt = document.createTextNode('test');
        const group = createContentModelDocument();
        const context = createDomToModelContext();
        const tableProcessorSpy = spyOn(tableProcessor, 'tableProcessor');

        table.appendChild(tr);
        tr.appendChild(td);
        td.appendChild(txt);

        context.tableSelection = {
            table,
        } as any;

        tablePreProcessor(group, table, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [],
        });
        expect(tableProcessorSpy).toHaveBeenCalledWith(group, table, context);
    });

    it('Table with image selection, do not use Entity', () => {
        const table = document.createElement('table');
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        const txt = document.createTextNode('test');
        const group = createContentModelDocument();
        const context = createDomToModelContext();
        const tableProcessorSpy = spyOn(tableProcessor, 'tableProcessor');

        table.appendChild(tr);
        tr.appendChild(td);
        td.appendChild(txt);

        context.imageSelection = {
            image: txt,
        } as any;

        tablePreProcessor(group, table, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [],
        });
        expect(tableProcessorSpy).toHaveBeenCalledWith(group, table, context);
    });

    it('Table in selection, do not use Entity', () => {
        const table = document.createElement('table');
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        const txt = document.createTextNode('test');
        const group = createContentModelDocument();
        const context = createDomToModelContext();
        const tableProcessorSpy = spyOn(tableProcessor, 'tableProcessor');

        table.appendChild(tr);
        tr.appendChild(td);
        td.appendChild(txt);

        context.isInSelection = true;

        tablePreProcessor(group, table, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [],
        });
        expect(tableProcessorSpy).toHaveBeenCalledWith(group, table, context);
    });
});
