import * as handleBlock from '../../../lib/modelToDom/handlers/handleBlock';
import { ContentModelTable } from '../../../lib/publicTypes/block/ContentModelTable';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { createTableCell } from '../../../lib/modelApi/creators/createTableCell';
import { handleTable } from '../../../lib/modelToDom/handlers/handleTable';
import { ModelToDomContext } from '../../../lib/modelToDom/context/ModelToDomContext';

describe('handleTable', () => {
    let context: ModelToDomContext;

    beforeEach(() => {
        spyOn(handleBlock, 'handleBlock');
        context = createModelToDomContext();
    });

    function runTest(model: ContentModelTable, expectedInnerHTML: string) {
        const div = document.createElement('div');
        handleTable(document, div, model, context);
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
            },
            '<table><tbody><tr><th></th></tr><tr><td></td></tr></tbody></table>'
        );
    });
});
