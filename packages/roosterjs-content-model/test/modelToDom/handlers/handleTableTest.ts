import * as handleBlock from '../../../lib/modelToDom/handlers/handleBlock';
import { ContentModelBlockType } from '../../../lib/publicTypes/enum/BlockType';
import { ContentModelTable } from '../../../lib/publicTypes/block/ContentModelTable';
import { createTableCell } from '../../../lib/domToModel/creators/createTableCell';
import { handleTable } from '../../../lib/modelToDom/handlers/handleTable';

describe('handleTable', () => {
    beforeEach(() => {
        spyOn(handleBlock, 'handleBlock');
    });

    function runTest(model: ContentModelTable, expectedInnerHTML: string) {
        const div = document.createElement('div');
        handleTable(document, div, model);
        expect(div.innerHTML).toBe(expectedInnerHTML);
    }

    it('Empty table', () => {
        runTest(
            {
                blockType: ContentModelBlockType.Table,
                cells: [],
            },
            ''
        );
    });

    it('Table with all empty rows', () => {
        runTest(
            {
                blockType: ContentModelBlockType.Table,
                cells: [[], []],
            },
            ''
        );
    });

    it('Regular 1 * 1 table', () => {
        runTest(
            {
                blockType: ContentModelBlockType.Table,
                cells: [[createTableCell(1, 1, false)]],
            },
            '<table><tbody><tr><td></td></tr></tbody></table>'
        );
    });

    it('Regular 2 * 2 table', () => {
        const tdModel = createTableCell(1, 1, false);
        runTest(
            {
                blockType: ContentModelBlockType.Table,
                cells: [
                    [tdModel, tdModel],
                    [tdModel, tdModel],
                ],
            },
            '<table><tbody><tr><td></td><td></td></tr><tr><td></td><td></td></tr></tbody></table>'
        );
    });

    it('3 * 1 table with empty row', () => {
        const tdModel = createTableCell(1, 1, false);
        runTest(
            {
                blockType: ContentModelBlockType.Table,
                cells: [[tdModel], [], [tdModel]],
            },
            '<table><tbody><tr><td></td></tr><tr><td></td></tr></tbody></table>'
        );
    });

    it('Table with spanLeft cell', () => {
        const tdModel = createTableCell(1, 1, false);
        runTest(
            {
                blockType: ContentModelBlockType.Table,
                cells: [
                    [tdModel, createTableCell(2, 1, false)],
                    [tdModel, tdModel],
                ],
            },
            '<table><tbody><tr><td colspan="2"></td></tr><tr><td></td><td></td></tr></tbody></table>'
        );
    });

    it('Table with spanAbove cell', () => {
        const tdModel = createTableCell(1, 1, false);
        runTest(
            {
                blockType: ContentModelBlockType.Table,
                cells: [
                    [tdModel, tdModel],
                    [createTableCell(1, 2, false), tdModel],
                ],
            },
            '<table><tbody><tr><td rowspan="2"></td><td></td></tr><tr><td></td></tr></tbody></table>'
        );
    });

    it('Table with spanAbove and spanLeft cell', () => {
        runTest(
            {
                blockType: ContentModelBlockType.Table,
                cells: [
                    [createTableCell(1, 1, false), createTableCell(2, 1, false)],
                    [createTableCell(1, 2, false), createTableCell(2, 2, false)],
                ],
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
                blockType: ContentModelBlockType.Table,
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
                blockType: ContentModelBlockType.Table,
                cells: [[createTableCell(1, 1, true)], [createTableCell(1, 1, false)]],
            },
            '<table><tbody><tr><th></th></tr><tr><td></td></tr></tbody></table>'
        );
    });
});
