import * as handleBlock from '../../../lib/modelToDom/handlers/handleBlock';
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
                cells: [],
                format: {},
                widths: [],
                heights: [],
                dataset: {},
            },
            ''
        );
    });

    it('Table with all empty rows', () => {
        runTest(
            {
                blockType: 'Table',
                cells: [[], []],
                format: {},
                widths: [],
                heights: [],
                dataset: {},
            },
            ''
        );
    });

    it('Regular 1 * 1 table', () => {
        runTest(
            {
                blockType: 'Table',
                cells: [[createTableCell(1, 1, false)]],
                format: {},
                widths: [],
                heights: [],
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
                cells: [
                    [tdModel1, tdModel2],
                    [tdModel3, tdModel4],
                ],
                format: {},
                widths: [],
                heights: [],
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
                cells: [[tdModel1], [], [tdModel2]],
                format: {},
                widths: [],
                heights: [],
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
                cells: [
                    [tdModel1, createTableCell(2, 1, false)],
                    [tdModel2, tdModel3],
                ],
                format: {},
                widths: [],
                heights: [],
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
                cells: [
                    [tdModel1, tdModel2],
                    [createTableCell(1, 2, false), tdModel3],
                ],
                format: {},
                widths: [],
                heights: [],
                dataset: {},
            },
            '<table><tbody><tr><td rowspan="2"></td><td></td></tr><tr><td></td></tr></tbody></table>'
        );
    });

    it('Table with spanAbove and spanLeft cell', () => {
        runTest(
            {
                blockType: 'Table',
                cells: [
                    [createTableCell(1, 1, false), createTableCell(2, 1, false)],
                    [createTableCell(1, 2, false), createTableCell(2, 2, false)],
                ],
                format: {},
                widths: [],
                heights: [],
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
                cells: [
                    [
                        createTableCell(1, 1, false),
                        createTableCell(1, 1, false),
                        createTableCell(2, 1, false),
                    ],
                    [
                        createTableCell(1, 2, false),
                        createTableCell(1, 1, false),
                        createTableCell(1, 1, false),
                    ],
                    [
                        createTableCell(1, 1, false),
                        createTableCell(2, 1, false),
                        createTableCell(1, 2, false),
                    ],
                ],
                format: {},
                widths: [],
                heights: [],
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
                cells: [[createTableCell(1, 1, true)], [createTableCell(1, 1, false)]],
                format: {},
                widths: [],
                heights: [],
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
                cells: [[createTableCell(1, 1, false)]],
                format: {},
                widths: [],
                heights: [],
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
                cells: [[createTableCell(1, 1, false)]],
                format: {},
                widths: [],
                heights: [],
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
                cells: [[cell]],
                format: {},
                widths: [],
                heights: [],
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

        table.cells[0].push(tableCell1);
        table.cells[1].push(tableCell2);

        const onNodeCreated = jasmine.createSpy('onNodeCreated');

        context.onNodeCreated = onNodeCreated;

        handleTable(document, parent, table, context, null);

        expect(parent.innerHTML).toBe(
            '<table><tbody><tr><th></th></tr><tr><td></td></tr></tbody></table>'
        );
        expect(onNodeCreated).toHaveBeenCalledTimes(3);
        expect(onNodeCreated.calls.argsFor(0)[0]).toBe(table);
        expect(onNodeCreated.calls.argsFor(0)[1]).toBe(parent.querySelector('table'));
        expect(onNodeCreated.calls.argsFor(1)[0]).toBe(tableCell1);
        expect(onNodeCreated.calls.argsFor(1)[1]).toBe(parent.querySelector('th'));
        expect(onNodeCreated.calls.argsFor(2)[0]).toBe(tableCell2);
        expect(onNodeCreated.calls.argsFor(2)[1]).toBe(parent.querySelector('td'));
    });
});
