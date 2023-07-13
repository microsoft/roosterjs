import * as setGlobalCssStyles from 'roosterjs-editor-dom/lib/style/setGlobalCssStyles';
import createEditorCore from './createMockEditorCore';
import { createElement } from 'roosterjs-editor-dom';
import { CreateElementData, EditorCore, TableSelection } from 'roosterjs-editor-types';
import { selectTable } from '../../lib/coreApi/selectTable';

let div: HTMLDivElement | null;
let table: HTMLTableElement | null;
let core: EditorCore | null;

const STYLE_ID = 'tableStyle';

describe('selectTable |', () => {
    beforeEach(() => {
        spyOn(setGlobalCssStyles, 'default').and.callThrough();
        div = document.createElement('div');
        document.body.appendChild(div!);
        core = createEditorCore(div!, {});
    });

    afterEach(() => {
        let styles = document.querySelectorAll('#tableStylecontentDiv_0');
        styles.forEach(s => s.parentElement?.removeChild(s));

        core = null;
        div = null;
        table = null;
        document.body.innerHTML = '';
    });

    it('Select Table Cells TR under Table Tag', () => {
        table = buildTable(true);
        div?.appendChild(table);
        selectTable(core, table, <TableSelection>{
            firstCell: { x: 1, y: 0 },
            lastCell: { x: 1, y: 1 },
        });

        expect(setGlobalCssStyles.default).toHaveBeenCalledWith(
            document,
            '#' +
                div!.id +
                ' #' +
                table.id +
                '>TBODY> tr:nth-child(1)>TD:nth-child(2),#' +
                div!.id +
                ' #' +
                table.id +
                '>TBODY> tr:nth-child(1)>TD:nth-child(2) *,#' +
                div!.id +
                ' #' +
                table.id +
                '>TBODY> tr:nth-child(2)>TD:nth-child(2),#' +
                div!.id +
                ' #' +
                table.id +
                '>TBODY> tr:nth-child(2)>TD:nth-child(2) * {background-color: rgb(198,198,198) !important; caret-color: transparent}',
            STYLE_ID + div!.id
        );
    });

    it('Select Table Cells TBODY', () => {
        table = buildTable(false);
        div?.appendChild(table);
        selectTable(core, table, <TableSelection>{
            firstCell: { x: 0, y: 0 },
            lastCell: { x: 0, y: 1 },
        });

        expect(setGlobalCssStyles.default).toHaveBeenCalledWith(
            document,
            '#' +
                div!.id +
                ' #' +
                table.id +
                '> tr:nth-child(1)>TD:nth-child(1),#' +
                div!.id +
                ' #' +
                table.id +
                '> tr:nth-child(1)>TD:nth-child(1) *,#' +
                div!.id +
                ' #' +
                table.id +
                '> tr:nth-child(2)>TD:nth-child(1),#' +
                div!.id +
                ' #' +
                table.id +
                '> tr:nth-child(2)>TD:nth-child(1) * {background-color: rgb(198,198,198) !important; caret-color: transparent}',
            STYLE_ID + div!.id
        );
        expect(setGlobalCssStyles.default).toHaveBeenCalledTimes(1);
    });

    it('Select TH and TR in the same row', () => {
        table = createElement(
            {
                tag: 'table',
                children: [
                    {
                        tag: 'TR',
                        children: [
                            {
                                tag: 'TH',
                                children: ['test'],
                            },
                            {
                                tag: 'TD',
                                children: ['test'],
                            },
                        ],
                    },
                    {
                        tag: 'TR',
                        children: [
                            {
                                tag: 'TH',
                                children: ['test'],
                            },
                            {
                                tag: 'TD',
                                children: ['test'],
                            },
                        ],
                    },
                ],
            },
            document
        ) as HTMLTableElement;

        selectTable(core, table, <TableSelection>{
            firstCell: { x: 0, y: 0 },
            lastCell: { x: 0, y: 1 },
        });

        expect(setGlobalCssStyles.default).toHaveBeenCalledWith(
            document,
            '#' +
                div!.id +
                ' #' +
                table.id +
                '> tr:nth-child(1)>TH:nth-child(1),#' +
                div!.id +
                ' #' +
                table.id +
                '> tr:nth-child(1)>TH:nth-child(1) *,#' +
                div!.id +
                ' #' +
                table.id +
                '> tr:nth-child(2)>TH:nth-child(1),#' +
                div!.id +
                ' #' +
                table.id +
                '> tr:nth-child(2)>TH:nth-child(1) * {background-color: rgb(198,198,198) !important; caret-color: transparent}',
            STYLE_ID + div!.id
        );
        expect(setGlobalCssStyles.default).toHaveBeenCalledTimes(1);
    });

    it('Select Table Cells THEAD, TBODY', () => {
        table = buildTable(true /* tbody */, true /* thead */);
        div?.append(table);

        selectTable(core, table, <TableSelection>{
            firstCell: { x: 1, y: 1 },
            lastCell: { x: 2, y: 2 },
        });

        expect(setGlobalCssStyles.default).toHaveBeenCalledWith(
            document,
            '#' +
                div!.id +
                ' #' +
                table.id +
                '>THEAD> tr:nth-child(2)>TD:nth-child(2),#' +
                div!.id +
                ' #' +
                table.id +
                '>THEAD> tr:nth-child(2)>TD:nth-child(2) *,#' +
                div!.id +
                ' #' +
                table.id +
                '>TBODY> tr:nth-child(1)>TD:nth-child(2),#' +
                div!.id +
                ' #' +
                table.id +
                '>TBODY> tr:nth-child(1)>TD:nth-child(2) * {background-color: rgb(198,198,198) !important; caret-color: transparent}',
            STYLE_ID + div!.id
        );
    });

    it('Select Table Cells TBODY, TFOOT', () => {
        table = buildTable(true /* tbody */, false /* thead */, true /* tfoot */);
        div?.appendChild(table);

        selectTable(core, table, <TableSelection>{
            firstCell: { x: 1, y: 1 },
            lastCell: { x: 2, y: 2 },
        });

        expect(setGlobalCssStyles.default).toHaveBeenCalledWith(
            document,
            '#' +
                div!.id +
                ' #' +
                table.id +
                '>TBODY> tr:nth-child(2)>TD:nth-child(2),#' +
                div!.id +
                ' #' +
                table.id +
                '>TBODY> tr:nth-child(2)>TD:nth-child(2) *,#' +
                div!.id +
                ' #' +
                table.id +
                '>TFOOT> tr:nth-child(1)>TD:nth-child(2),#' +
                div!.id +
                ' #' +
                table.id +
                '>TFOOT> tr:nth-child(1)>TD:nth-child(2) * {background-color: rgb(198,198,198) !important; caret-color: transparent}',
            STYLE_ID + div!.id
        );
        expect(setGlobalCssStyles.default).toHaveBeenCalledTimes(1);
    });

    it('Select Table Cells THEAD, TBODY, TFOOT', () => {
        table = buildTable(true /* tbody */, true /* thead */, true /* tfoot */);
        div?.appendChild(table);

        selectTable(core, table, <TableSelection>{
            firstCell: { x: 1, y: 1 },
            lastCell: { x: 1, y: 4 },
        });

        expect(setGlobalCssStyles.default).toHaveBeenCalledWith(
            document,
            '#' +
                div!.id +
                ' #' +
                table.id +
                '>THEAD> tr:nth-child(2)>TD:nth-child(2),#' +
                div!.id +
                ' #' +
                table.id +
                '>THEAD> tr:nth-child(2)>TD:nth-child(2) *,#' +
                div!.id +
                ' #' +
                table.id +
                '>TBODY> tr:nth-child(1)>TD:nth-child(2),#' +
                div!.id +
                ' #' +
                table.id +
                '>TBODY> tr:nth-child(1)>TD:nth-child(2) *,#' +
                div!.id +
                ' #' +
                table.id +
                '>TBODY> tr:nth-child(2)>TD:nth-child(2),#' +
                div!.id +
                ' #' +
                table.id +
                '>TBODY> tr:nth-child(2)>TD:nth-child(2) *,#' +
                div!.id +
                ' #' +
                table.id +
                '>TFOOT> tr:nth-child(1)>TD:nth-child(2),#' +
                div!.id +
                ' #' +
                table.id +
                '>TFOOT> tr:nth-child(1)>TD:nth-child(2) * {background-color: rgb(198,198,198) !important; caret-color: transparent}',
            STYLE_ID + div!.id
        );
        expect(setGlobalCssStyles.default).toHaveBeenCalledTimes(1);
    });

    it('Select Table Cells THEAD, TFOOT', () => {
        table = buildTable(false /* tbody */, true /* thead */, true /* tfoot */);
        div?.appendChild(table);

        selectTable(core, table, <TableSelection>{
            firstCell: { x: 1, y: 1 },
            lastCell: { x: 1, y: 2 },
        });

        expect(setGlobalCssStyles.default).toHaveBeenCalledWith(
            document,
            '#' +
                div!.id +
                ' #' +
                table.id +
                '>THEAD> tr:nth-child(2)>TD:nth-child(2),#' +
                div!.id +
                ' #' +
                table.id +
                '>THEAD> tr:nth-child(2)>TD:nth-child(2) *,#' +
                div!.id +
                ' #' +
                table.id +
                '>TFOOT> tr:nth-child(1)>TD:nth-child(2),#' +
                div!.id +
                ' #' +
                table.id +
                '>TFOOT> tr:nth-child(1)>TD:nth-child(2) * {background-color: rgb(198,198,198) !important; caret-color: transparent}',
            STYLE_ID + div!.id
        );
        expect(setGlobalCssStyles.default).toHaveBeenCalledTimes(1);
    });

    it('Select All', () => {
        table = buildTable(true /* tbody */, false, false);
        div?.appendChild(table);

        selectTable(core, table, <TableSelection>{
            firstCell: { x: 0, y: 0 },
            lastCell: { x: 1, y: 1 },
        });

        expect(setGlobalCssStyles.default).toHaveBeenCalledWith(
            document,
            '#' +
                div!.id +
                ' #' +
                table.id +
                ',#' +
                div!.id +
                ' #' +
                table.id +
                ' * {background-color: rgb(198,198,198) !important; caret-color: transparent}',
            STYLE_ID + div!.id
        );
        expect(setGlobalCssStyles.default).toHaveBeenCalledTimes(1);
    });

    it('remove duplicated ID', () => {
        table = buildTable(true);
        const table1 = buildTable(true);

        table.id = 'DuplicatedId';
        table1.id = 'DuplicatedId';
        div?.appendChild(table);
        div?.appendChild(table1);

        selectTable(core, table, <TableSelection>{
            firstCell: { x: 0, y: 0 },
            lastCell: { x: 0, y: 0 },
        });

        expect(table.id).not.toEqual(table1.id);
        expect(setGlobalCssStyles.default).toHaveBeenCalledTimes(1);
    });

    it('Select massive table', () => {
        // 20x32
        table = createTable(20, 32);
        div?.appendChild(table);

        selectTable(core, table, <TableSelection>{
            firstCell: { x: 0, y: 0 },
            lastCell: { x: 20, y: 31 },
        });

        expect(setGlobalCssStyles.default).toHaveBeenCalledTimes(7);
    });
});

describe('Select Table Null scenarios |', () => {
    beforeEach(() => {
        table = buildTable(true);
        spyOn(setGlobalCssStyles, 'default').and.callThrough();
        div = document.createElement('div');
        document.body.appendChild(div!);
        core = createEditorCore(div!, {});
    });

    it('Null table selection', () => {
        const core = createEditorCore(div!, {});
        selectTable(core, table, null);

        expect(setGlobalCssStyles.default).not.toHaveBeenCalled();
    });

    it('Null first cell coordinates', () => {
        selectTable(core, table, <TableSelection>{
            firstCell: null,
            lastCell: { x: 1, y: 1 },
        });

        expect(setGlobalCssStyles.default).not.toHaveBeenCalled();
    });

    it('Null last cell coordinates', () => {
        selectTable(core, table, <TableSelection>{
            firstCell: { x: 1, y: 1 },
            lastCell: null,
        });

        expect(setGlobalCssStyles.default).not.toHaveBeenCalled();
    });

    it('Null first cell y coordinate', () => {
        selectTable(core, table, <TableSelection>{
            firstCell: { x: 0, y: null },
            lastCell: { x: 1, y: 1 },
        });

        expect(setGlobalCssStyles.default).not.toHaveBeenCalled();
    });

    it('Null first cell x coordinate', () => {
        selectTable(core, table, <TableSelection>{
            firstCell: { x: null, y: 0 },
            lastCell: { x: 1, y: 1 },
        });

        expect(setGlobalCssStyles.default).not.toHaveBeenCalled();
    });

    it('Null last cell y coordinate', () => {
        selectTable(core, table, <TableSelection>{
            firstCell: { x: 0, y: 0 },
            lastCell: { x: 1, y: null },
        });

        expect(setGlobalCssStyles.default).not.toHaveBeenCalled();
    });

    xit('Null last cell x coordinate', () => {
        selectTable(core, table, <TableSelection>{
            firstCell: { x: 0, y: 0 },
            lastCell: { x: null, y: 1 },
        });

        expect(setGlobalCssStyles.default).not.toHaveBeenCalled();
    });

    it('Null last cell x & y coordinate', () => {
        selectTable(core, table, <TableSelection>{
            firstCell: { x: 0, y: 0 },
            lastCell: { x: null, y: null },
        });

        expect(setGlobalCssStyles.default).not.toHaveBeenCalled();
    });

    it('Null first cell x & y coordinate', () => {
        selectTable(core, table, <TableSelection>{
            lastCell: { x: 0, y: 0 },
            firstCell: { x: null, y: null },
        });

        expect(setGlobalCssStyles.default).not.toHaveBeenCalled();
    });
});

function buildTable(tbody: boolean, thead: boolean = false, tfoot: boolean = false) {
    const getElement = (tag: string): CreateElementData => {
        return {
            tag,
            children: [
                {
                    tag: 'TR',
                    children: [
                        {
                            tag: 'TD',
                            children: ['test'],
                        },
                        {
                            tag: 'TD',
                            children: ['test'],
                        },
                    ],
                },
                {
                    tag: 'TR',
                    children: [
                        {
                            tag: 'TD',
                            children: ['test'],
                        },
                        {
                            tag: 'TD',
                            children: ['test'],
                        },
                    ],
                },
            ],
        };
    };

    const children: (string | CreateElementData)[] = [];
    if (thead) {
        children.push(getElement('thead'));
    }
    if (tbody) {
        children.push(getElement('tbody'));
    }
    if (tfoot) {
        children.push(getElement('tfoot'));
    }
    if (children.length === 0) {
        children.push(
            {
                tag: 'TR',
                children: [
                    {
                        tag: 'TD',
                        children: ['test'],
                    },
                    {
                        tag: 'TD',
                        children: ['test'],
                    },
                ],
            },
            {
                tag: 'TR',
                children: [
                    {
                        tag: 'TD',
                        children: ['test'],
                    },
                    {
                        tag: 'TD',
                        children: ['test'],
                    },
                ],
            }
        );
    }

    return createElement(
        {
            tag: 'table',
            children,
        },
        document
    ) as HTMLTableElement;
}

function createTable(row: number, column: number) {
    const children: CreateElementData[] = [];
    for (let index = 0; index < row; index++) {
        const row: CreateElementData = {
            tag: 'TR',
            children: [],
        };

        for (let cIndex = 0; cIndex < column; cIndex++) {
            row.children?.push({
                tag: 'TD',
                children: ['test'],
            });
        }

        children.push(row);
    }

    return createElement(
        {
            tag: 'table',
            children,
        },
        document
    ) as HTMLTableElement;
}
