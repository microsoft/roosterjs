import * as handleBlock from '../../../lib/modelToDom/handlers/handleBlock';
import { ContentModelTable } from '../../../lib/publicTypes/block/ContentModelTable';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
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
        const tdModel = createTableCell(1, 1, false);
        runTest(
            {
                blockType: 'Table',
                cells: [
                    [tdModel, tdModel],
                    [tdModel, tdModel],
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
        const tdModel = createTableCell(1, 1, false);
        runTest(
            {
                blockType: 'Table',
                cells: [[tdModel], [], [tdModel]],
                format: {},
                widths: [],
                heights: [],
                dataset: {},
            },
            '<table><tbody><tr><td></td></tr><tr><td></td></tr></tbody></table>'
        );
    });

    it('Table with spanLeft cell', () => {
        const tdModel = createTableCell(1, 1, false);
        runTest(
            {
                blockType: 'Table',
                cells: [
                    [tdModel, createTableCell(2, 1, false)],
                    [tdModel, tdModel],
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
        const tdModel = createTableCell(1, 1, false);
        runTest(
            {
                blockType: 'Table',
                cells: [
                    [tdModel, tdModel],
                    [createTableCell(1, 2, false), tdModel],
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
            br
        );

        expect(div.innerHTML).toBe('<table><tbody><tr><td></td></tr></tbody></table><br>');
    });
});
