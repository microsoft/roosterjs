import * as handleBlock from '../../../lib/modelToDom/handlers/handleBlock';
import DarkColorHandlerImpl from 'roosterjs-editor-core/lib/editor/DarkColorHandlerImpl';
import { ContentModelTable } from '../../../lib/publicTypes/block/ContentModelTable';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { createTable } from '../../../lib/modelApi/creators/createTable';
import { createTableCell } from '../../../lib/modelApi/creators/createTableCell';
import { handleTable } from '../../../lib/modelToDom/handlers/handleTable';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';

describe('handleTable', () => {
    let context: ModelToDomContext;

    beforeEach(() => {
        spyOn(handleBlock, 'handleBlock');
        context = createModelToDomContext();
        context.darkColorHandler = new DarkColorHandlerImpl(null!, s => 'darkMock: ' + s);
    });

    function runTest(model: ContentModelTable, expectedInnerHTML: string) {
        const div = document.createElement('div');
        handleTable(document, div, model, context, null);
        expect(div.innerHTML).toBe(expectedInnerHTML);
    }

    it('Empty table', () => {
        runTest(
            {
                blockType: 'Table',
                rows: [],
                format: {},
                widths: [],
                dataset: {},
            },
            ''
        );
    });

    it('Table with all empty rows', () => {
        runTest(
            {
                blockType: 'Table',
                rows: [
                    { format: {}, height: 0, cells: [] },
                    { format: {}, height: 0, cells: [] },
                ],
                format: {},
                widths: [],
                dataset: {},
            },
            ''
        );
    });

    it('Regular 1 * 1 table', () => {
        runTest(
            {
                blockType: 'Table',
                rows: [{ format: {}, height: 0, cells: [createTableCell(1, 1, false)] }],
                format: {},
                widths: [],
                dataset: {},
            },
            '<table><tbody><tr><td></td></tr></tbody></table>'
        );
    });

    it('Regular 2 * 2 table', () => {
        const tdModel1 = createTableCell(1, 1, false);
        const tdModel2 = createTableCell(1, 1, false);
        const tdModel3 = createTableCell(1, 1, false);
        const tdModel4 = createTableCell(1, 1, false);
        runTest(
            {
                blockType: 'Table',
                rows: [
                    { format: {}, height: 0, cells: [tdModel1, tdModel2] },
                    { format: {}, height: 0, cells: [tdModel3, tdModel4] },
                ],
                format: {},
                widths: [],
                dataset: {},
            },
            '<table><tbody><tr><td></td><td></td></tr><tr><td></td><td></td></tr></tbody></table>'
        );
    });

    it('3 * 1 table with empty row', () => {
        const tdModel1 = createTableCell(1, 1, false);
        const tdModel2 = createTableCell(1, 1, false);
        runTest(
            {
                blockType: 'Table',
                rows: [
                    { format: {}, height: 0, cells: [tdModel1] },
                    { format: {}, height: 0, cells: [] },
                    { format: {}, height: 0, cells: [tdModel2] },
                ],
                format: {},
                widths: [],
                dataset: {},
            },
            '<table><tbody><tr><td></td></tr><tr><td></td></tr></tbody></table>'
        );
    });

    it('Table with spanLeft cell', () => {
        const tdModel1 = createTableCell(1, 1, false);
        const tdModel2 = createTableCell(1, 1, false);
        const tdModel3 = createTableCell(1, 1, false);
        runTest(
            {
                blockType: 'Table',
                rows: [
                    { format: {}, height: 0, cells: [tdModel1, createTableCell(2, 1, false)] },
                    { format: {}, height: 0, cells: [tdModel2, tdModel3] },
                ],
                format: {},
                widths: [],
                dataset: {},
            },
            '<table><tbody><tr><td colspan="2"></td></tr><tr><td></td><td></td></tr></tbody></table>'
        );
    });

    it('Table with spanAbove cell', () => {
        const tdModel1 = createTableCell(1, 1, false);
        const tdModel2 = createTableCell(1, 1, false);
        const tdModel3 = createTableCell(1, 1, false);
        runTest(
            {
                blockType: 'Table',
                rows: [
                    { format: {}, height: 0, cells: [tdModel1, tdModel2] },
                    { format: {}, height: 0, cells: [createTableCell(1, 2, false), tdModel3] },
                ],
                format: {},
                widths: [],
                dataset: {},
            },
            '<table><tbody><tr><td rowspan="2"></td><td></td></tr><tr><td></td></tr></tbody></table>'
        );
    });

    it('Table with spanAbove and spanLeft cell', () => {
        runTest(
            {
                blockType: 'Table',
                rows: [
                    {
                        format: {},
                        height: 0,
                        cells: [createTableCell(1, 1, false), createTableCell(2, 1, false)],
                    },
                    {
                        format: {},
                        height: 0,
                        cells: [createTableCell(1, 2, false), createTableCell(2, 2, false)],
                    },
                ],
                format: {},
                widths: [],
                dataset: {},
            },
            '<table><tbody><tr><td rowspan="2" colspan="2"></td></tr><tr></tr></tbody></table>'
        );
    });

    it('Complex table', () => {
        // +--+-----+
        // |  |     |
        // |  +--+--+
        // |  |  |  |
        // +--+--+  |
        // |     |  |
        // +-----+--+
        runTest(
            {
                blockType: 'Table',
                rows: [
                    {
                        format: {},
                        height: 0,
                        cells: [
                            createTableCell(1, 1, false),
                            createTableCell(1, 1, false),
                            createTableCell(2, 1, false),
                        ],
                    },
                    {
                        format: {},
                        height: 0,
                        cells: [
                            createTableCell(1, 2, false),
                            createTableCell(1, 1, false),
                            createTableCell(1, 1, false),
                        ],
                    },
                    {
                        format: {},
                        height: 0,
                        cells: [
                            createTableCell(1, 1, false),
                            createTableCell(2, 1, false),
                            createTableCell(1, 2, false),
                        ],
                    },
                ],
                format: {},
                widths: [],
                dataset: {},
            },
            '<table><tbody>' +
                '<tr><td rowspan="2"></td><td colspan="2"></td></tr>' +
                '<tr><td></td><td rowspan="2"></td></tr>' +
                '<tr><td colspan="2"></td></tr>' +
                '</tbody></table>'
        );
    });

    it('Table with header', () => {
        runTest(
            {
                blockType: 'Table',
                rows: [
                    { format: {}, height: 0, cells: [createTableCell(1, 1, true)] },
                    { format: {}, height: 0, cells: [createTableCell(1, 1, false)] },
                ],
                format: {},
                widths: [],
                dataset: {},
            },
            '<table><tbody><tr><th></th></tr><tr><td></td></tr></tbody></table>'
        );
    });

    it('Regular 1 * 1 table, handle dataset', () => {
        const datasetApplier = jasmine.createSpy('datasetApplier');
        context.formatAppliers.dataset = [datasetApplier];

        const div = document.createElement('div');
        handleTable(
            document,
            div,
            {
                blockType: 'Table',
                rows: [{ format: {}, height: 0, cells: [createTableCell(1, 1, false)] }],
                format: {},
                widths: [],
                dataset: {},
            },
            context,
            null
        );

        expect(div.innerHTML).toBe('<table><tbody><tr><td></td></tr></tbody></table>');

        const table = div.firstChild as HTMLTableElement;
        expect(datasetApplier).toHaveBeenCalledWith({}, table, context);
        expect(datasetApplier).toHaveBeenCalledWith({}, table.rows[0].cells[0], context);
    });

    it('Regular 1 * 1 table with refNode', () => {
        const div = document.createElement('div');
        const br = document.createElement('br');

        div.appendChild(br);

        const result = handleTable(
            document,
            div,
            {
                blockType: 'Table',
                rows: [{ format: {}, height: 0, cells: [createTableCell(1, 1, false)] }],
                format: {},
                widths: [],
                dataset: {},
            },
            context,
            br
        );

        expect(div.innerHTML).toBe('<table><tbody><tr><td></td></tr></tbody></table><br>');
        expect(result).toBe(br);
    });

    it('Regular 1 * 1 table with refNode and cached element', () => {
        const div = document.createElement('div');
        const table = document.createElement('table');
        const br = document.createElement('br');
        const td = document.createElement('td');

        table.id = 't1';
        td.id = 'd1';

        div.appendChild(table);
        div.appendChild(br);

        const cell = createTableCell(1, 1, false);
        cell.cachedElement = td;

        const result = handleTable(
            document,
            div,
            {
                blockType: 'Table',
                rows: [{ format: {}, height: 0, cells: [cell] }],
                format: {},
                widths: [],
                dataset: {},
                cachedElement: table,
            },
            context,
            table
        );

        expect(div.innerHTML).toBe(
            '<table id="t1"><tbody><tr><td id="d1"></td></tr></tbody></table><br>'
        );
        expect(result).toBe(br);
    });

    it('With onNodeCreated', () => {
        const parent = document.createElement('div');
        const tableCell1 = createTableCell(false, false, true);
        const tableCell2 = createTableCell();
        const table = createTable(2);

        table.rows[0].cells.push(tableCell1);
        table.rows[1].cells.push(tableCell2);

        const onNodeCreated = jasmine.createSpy('onNodeCreated');

        context.onNodeCreated = onNodeCreated;

        handleTable(document, parent, table, context, null);

        expect(parent.innerHTML).toBe(
            '<table><tbody><tr><th></th></tr><tr><td></td></tr></tbody></table>'
        );
        const tableNode = parent.querySelector('table') as HTMLTableElement;

        expect(onNodeCreated).toHaveBeenCalledTimes(5);
        expect(onNodeCreated.calls.argsFor(0)[0]).toBe(table);
        expect(onNodeCreated.calls.argsFor(0)[1]).toBe(tableNode);
        expect(onNodeCreated.calls.argsFor(1)[0]).toBe(table.rows[0]);
        expect(onNodeCreated.calls.argsFor(1)[1]).toBe(tableNode.rows[0]);
        expect(onNodeCreated.calls.argsFor(2)[0]).toBe(tableCell1);
        expect(onNodeCreated.calls.argsFor(2)[1]).toBe(parent.querySelector('th'));
        expect(onNodeCreated.calls.argsFor(3)[0]).toBe(table.rows[1]);
        expect(onNodeCreated.calls.argsFor(3)[1]).toBe(tableNode.rows[1]);
        expect(onNodeCreated.calls.argsFor(4)[0]).toBe(tableCell2);
        expect(onNodeCreated.calls.argsFor(4)[1]).toBe(parent.querySelector('td'));
    });

    it('With cached TABLE element, do not apply border styles', () => {
        const parent = document.createElement('div');
        const table = createTable(1);

        table.rows[0].cells.push(createTableCell());
        table.format.useBorderBox = true;
        table.format.borderCollapse = true;
        table.cachedElement = document.createElement('table');

        handleTable(document, parent, table, context, null);

        expect(parent.innerHTML).toBe('<table><tbody><tr><td></td></tr></tbody></table>');
    });

    it('Without cached TABLE element, apply border styles', () => {
        const parent = document.createElement('div');
        const table = createTable(1);

        table.rows[0].cells.push(createTableCell());
        table.format.useBorderBox = true;
        table.format.borderCollapse = true;

        handleTable(document, parent, table, context, null);

        expect(parent.innerHTML).toBe(
            '<table style="box-sizing: border-box; border-collapse: collapse; border-spacing: 0px;"><tbody><tr><td></td></tr></tbody></table>'
        );
    });

    it('Without cached TABLE element, apply margin', () => {
        const parent = document.createElement('div');
        const table = createTable(1);

        table.rows[0].cells.push(createTableCell());
        table.format.marginLeft = 'auto';
        table.format.marginRight = 'auto';

        handleTable(document, parent, table, context, null);

        expect(parent.innerHTML).toBe(
            '<table style="margin-right: auto; margin-left: auto;"><tbody><tr><td></td></tr></tbody></table>'
        );
    });

    it('Without cached TD, apply width and height', () => {
        const parent = document.createElement('div');
        const table = createTable(1);
        const cell = createTableCell();

        table.rows[0].cells.push(cell);
        table.widths.push(100);
        table.rows[0].height = 200;

        handleTable(document, parent, table, context, null);

        expect(parent.innerHTML).toBe(
            '<table><tbody><tr><td style="width: 100px; height: 200px;"></td></tr></tbody></table>'
        );
    });

    it('With cached TD, do not apply width and height', () => {
        const parent = document.createElement('div');
        const table = createTable(1);
        const cell = createTableCell();

        table.rows[0].cells.push(cell);
        table.widths.push(100);
        table.rows[0].height = 200;
        cell.cachedElement = document.createElement('td');

        handleTable(document, parent, table, context, null);

        expect(parent.innerHTML).toBe('<table><tbody><tr><td></td></tr></tbody></table>');
    });

    it('With cached TD and allow useBorderBox and has metadata, still apply width and height', () => {
        const parent = document.createElement('div');
        const table = createTable(1);
        const cell = createTableCell();

        table.rows[0].cells.push(cell);
        table.widths.push(100);
        table.rows[0].height = 200;
        cell.cachedElement = document.createElement('td');
        cell.format.useBorderBox = true;
        table.dataset.editingInfo = '{}';

        handleTable(document, parent, table, context, null);

        expect(parent.innerHTML).toBe(
            '<table data-editing-info="{}"><tbody><tr><td style="width: 100px; height: 200px;"></td></tr></tbody></table>'
        );
    });

    it('Without cached TD, apply table cell related styles', () => {
        const parent = document.createElement('div');
        const table = createTable(1);
        const cell = createTableCell();

        table.rows[0].cells.push(cell);
        table.widths.push(100);
        table.rows[0].height = 200;

        cell.format.backgroundColor = 'red';
        cell.format.textColor = 'blue';
        cell.format.wordBreak = 'break-all';
        cell.format.useBorderBox = true;
        cell.dataset.editingInfo = '{}';

        handleTable(document, parent, table, context, null);

        expect(
            [
                '<table><tbody><tr><td data-editing-info="{}" style="width: 100px; height: 200px; background-color: red; word-break: break-all; color: blue; box-sizing: border-box;"></td></tr></tbody></table>',
                '<table><tbody><tr><td style="width: 100px; height: 200px; background-color: red; word-break: break-all; color: blue; box-sizing: border-box;" data-editing-info="{}"></td></tr></tbody></table>',
            ].indexOf(parent.innerHTML) >= 0
        ).toBeTrue();
    });

    it('With cached TD, do not apply table cell related styles', () => {
        const parent = document.createElement('div');
        const table = createTable(1);
        const cell = createTableCell();

        table.rows[0].cells.push(cell);
        table.widths.push(100);
        table.rows[0].height = 200;

        cell.format.backgroundColor = 'red';
        cell.format.textColor = 'blue';
        cell.format.wordBreak = 'break-all';
        cell.format.useBorderBox = true;
        cell.dataset.editingInfo = '{}';
        cell.cachedElement = document.createElement('td');

        handleTable(document, parent, table, context, null);

        expect(parent.innerHTML).toBe('<table><tbody><tr><td></td></tr></tbody></table>');
    });

    it('Block format on TABLE and TD is respected', () => {
        const parent = document.createElement('div');
        const table = createTable(1, {
            whiteSpace: 'pre',
            lineHeight: '2',
            textAlign: 'center',
            direction: 'rtl',
        });
        const cell = createTableCell(false, false, false, {
            whiteSpace: 'normal',
            lineHeight: '1',
            textAlign: 'start',
            direction: 'ltr',
        });

        table.rows[0].cells.push(cell);
        table.widths.push(100);
        table.rows[0].height = 200;

        handleTable(document, parent, table, context, null);

        expect(parent.innerHTML).toBe(
            '<table style="direction: rtl; text-align: center; line-height: 2; white-space: pre;"><tbody><tr><td style="width: 100px; height: 200px; direction: ltr; text-align: left; line-height: 1; white-space: normal;"></td></tr></tbody></table>'
        );
    });

    it('TR has background color', () => {
        const parent = document.createElement('div');
        const table = createTable(1, {});
        const cell = createTableCell();

        table.rows[0].cells.push(cell);
        table.rows[0].format.backgroundColor = 'red';

        handleTable(document, parent, table, context, null);

        expect(parent.innerHTML).toBe(
            '<table><tbody><tr style="background-color: red;"><td></td></tr></tbody></table>'
        );
    });

    it('TR has cached element', () => {
        const parent = document.createElement('div');
        const table = createTable(1, {});
        const cell = createTableCell();
        const tr = document.createElement('tr');

        tr.id = 'tr1';
        table.rows[0].cells.push(cell);
        table.rows[0].cachedElement = tr;

        handleTable(document, parent, table, context, null);

        expect(parent.innerHTML).toBe('<table><tbody><tr id="tr1"><td></td></tr></tbody></table>');
    });
});
