import createEditorCore from './createMockEditorCore';
import { Browser, getComputedStyle } from 'roosterjs-editor-dom';
import { EditorCore, TableSelection, TableSelectionRange } from 'roosterjs-editor-types';
import { selectTable } from '../../lib/coreApi/selectTable';

describe('selectTable |', () => {
    let div: HTMLDivElement;
    let table: HTMLTableElement | null;
    let core: EditorCore | null;

    beforeEach(() => {
        document.body.innerHTML = '';
        div = document.createElement('div');
        div.innerHTML = buildTableHTML(true /* tbody */);

        table = div.querySelector('table');
        document.body.appendChild(div);

        core = createEditorCore(div, {});
    });

    afterEach(() => {
        document.body.removeChild(div);
        let style = document.getElementById('tableStylecontentDiv_0');
        if (style) {
            document.head.removeChild(style);
        }

        core = null;
        div.parentElement?.removeChild(div);
    });

    it('Select Table Cells TR under Table Tag', () => {
        div.innerHTML =
            '<div><table><tr><td><span>Test</span></td><td><span>Test</span></td></tr><tr><td><span>Test</span></td><td><span>Test</span></td></tr></table><br></div>';

        selectTable(core, table, <TableSelection>{
            firstCell: { x: 0, y: 0 },
            lastCell: { x: 1, y: 1 },
        });

        const style = document.getElementById('tableStylecontentDiv_0') as HTMLStyleElement;
        expect(style).toBeDefined();
        expect(style.sheet.cssRules[0]).toBeDefined();
        expect(style.sheet.cssRules[0].cssText).toEqual(
            Browser.isFirefox
                ? '#contentDiv_0 #tableSelected0 > TBODY > tr:nth-child(1) > TD:nth-child(1), #contentDiv_0 #tableSelected0 > TBODY > tr:nth-child(1) > TD:nth-child(2), #contentDiv_0 #tableSelected0 > TBODY > tr:nth-child(2) > TD:nth-child(1), #contentDiv_0 #tableSelected0 > TBODY > tr:nth-child(2) > TD:nth-child(2) { background-color: rgba(198, 198, 198, 0.7) !important; }'
                : '#contentDiv_0 #tableSelected0 > tbody > tr:nth-child(1) > td:nth-child(1), #contentDiv_0 #tableSelected0 > tbody > tr:nth-child(1) > td:nth-child(2), #contentDiv_0 #tableSelected0 > tbody > tr:nth-child(2) > td:nth-child(1), #contentDiv_0 #tableSelected0 > tbody > tr:nth-child(2) > td:nth-child(2) { background-color: rgba(198, 198, 198, 0.7) !important; }'
        );
    });

    it('Select Table Cells TBODY', () => {
        selectTable(core, table, <TableSelection>{
            firstCell: { x: 0, y: 0 },
            lastCell: { x: 1, y: 1 },
        });

        const style = document.getElementById('tableStylecontentDiv_0') as HTMLStyleElement;
        expect(style).toBeDefined();
        expect(style.sheet.cssRules[0]).toBeDefined();
        expect(style.sheet.cssRules[0].cssText).toEqual(
            Browser.isFirefox
                ? '#contentDiv_0 #tableSelected0 > TBODY > tr:nth-child(1) > TD:nth-child(1), #contentDiv_0 #tableSelected0 > TBODY > tr:nth-child(1) > TD:nth-child(2), #contentDiv_0 #tableSelected0 > TBODY > tr:nth-child(2) > TD:nth-child(1), #contentDiv_0 #tableSelected0 > TBODY > tr:nth-child(2) > TD:nth-child(2) { background-color: rgba(198, 198, 198, 0.7) !important; }'
                : '#contentDiv_0 #tableSelected0 > tbody > tr:nth-child(1) > td:nth-child(1), #contentDiv_0 #tableSelected0 > tbody > tr:nth-child(1) > td:nth-child(2), #contentDiv_0 #tableSelected0 > tbody > tr:nth-child(2) > td:nth-child(1), #contentDiv_0 #tableSelected0 > tbody > tr:nth-child(2) > td:nth-child(2) { background-color: rgba(198, 198, 198, 0.7) !important; }'
        );
    });

    it('Select TH and TR in the same row', () => {
        div.innerHTML =
            '<div><table><tr><th>Test</th><td>Test</td></tr><tr><th>Test</th><td>Test</td></tr></table><br></div>';
        table = div.querySelector('table');

        selectTable(core, table, <TableSelection>{
            firstCell: { x: 0, y: 0 },
            lastCell: { x: 1, y: 1 },
        });

        const style = document.getElementById('tableStylecontentDiv_0') as HTMLStyleElement;
        expect(style).toBeDefined();
        expect(style.sheet.cssRules[0]).toBeDefined();
        expect(style.sheet.cssRules[0].cssText).toEqual(
            Browser.isFirefox
                ? '#contentDiv_0 #tableSelected0 > TBODY > tr:nth-child(1) > TH:nth-child(1), #contentDiv_0 #tableSelected0 > TBODY > tr:nth-child(1) > TD:nth-child(2), #contentDiv_0 #tableSelected0 > TBODY > tr:nth-child(2) > TH:nth-child(1), #contentDiv_0 #tableSelected0 > TBODY > tr:nth-child(2) > TD:nth-child(2) { background-color: rgba(198, 198, 198, 0.7) !important; }'
                : '#contentDiv_0 #tableSelected0 > tbody > tr:nth-child(1) > th:nth-child(1), #contentDiv_0 #tableSelected0 > tbody > tr:nth-child(1) > td:nth-child(2), #contentDiv_0 #tableSelected0 > tbody > tr:nth-child(2) > th:nth-child(1), #contentDiv_0 #tableSelected0 > tbody > tr:nth-child(2) > td:nth-child(2) { background-color: rgba(198, 198, 198, 0.7) !important; }'
        );
    });

    it('Select Table Cells THEAD, TBODY', () => {
        div.innerHTML = buildTableHTML(true /* tbody */, true /* thead */);

        table = div.querySelector('table');

        selectTable(core, table, <TableSelection>{
            firstCell: { x: 1, y: 1 },
            lastCell: { x: 2, y: 2 },
        });

        const style = document.getElementById('tableStylecontentDiv_0') as HTMLStyleElement;
        expect(style).toBeDefined();
        expect(style.sheet.cssRules[0]).toBeDefined();
        expect(style.sheet.cssRules[0].cssText).toEqual(
            Browser.isFirefox
                ? '#contentDiv_0 #tableSelected0 > THEAD > tr:nth-child(2) > TD:nth-child(2), #contentDiv_0 #tableSelected0 > TBODY > tr:nth-child(1) > TD:nth-child(2) { background-color: rgba(198, 198, 198, 0.7) !important; }'
                : '#contentDiv_0 #tableSelected0 > thead > tr:nth-child(2) > td:nth-child(2), #contentDiv_0 #tableSelected0 > tbody > tr:nth-child(1) > td:nth-child(2) { background-color: rgba(198, 198, 198, 0.7) !important; }'
        );
    });

    it('Select Table Cells TBODY, TFOOT', () => {
        div.innerHTML = buildTableHTML(true /* tbody */, false /* thead */, true /* tfoot */);

        table = div.querySelector('table');

        selectTable(core, table, <TableSelection>{
            firstCell: { x: 1, y: 1 },
            lastCell: { x: 2, y: 2 },
        });

        const style = document.getElementById('tableStylecontentDiv_0') as HTMLStyleElement;
        expect(style).toBeDefined();
        expect(style.sheet.cssRules[0]).toBeDefined();
        expect(style.sheet.cssRules[0].cssText).toEqual(
            Browser.isFirefox
                ? '#contentDiv_0 #tableSelected0 > TBODY > tr:nth-child(2) > TD:nth-child(2), #contentDiv_0 #tableSelected0 > TFOOT > tr:nth-child(1) > TD:nth-child(2) { background-color: rgba(198, 198, 198, 0.7) !important; }'
                : '#contentDiv_0 #tableSelected0 > tbody > tr:nth-child(2) > td:nth-child(2), #contentDiv_0 #tableSelected0 > tfoot > tr:nth-child(1) > td:nth-child(2) { background-color: rgba(198, 198, 198, 0.7) !important; }'
        );
    });

    it('Select Table Cells THEAD, TBODY, TFOOT', () => {
        div.innerHTML = buildTableHTML(true /* tbody */, true /* thead */, true /* tfoot */);
        table = div.querySelector('table');

        selectTable(core, table, <TableSelection>{
            firstCell: { x: 1, y: 1 },
            lastCell: { x: 1, y: 4 },
        });

        const style = document.getElementById('tableStylecontentDiv_0') as HTMLStyleElement;
        expect(style).toBeDefined();
        expect(style.sheet.cssRules[0]).toBeDefined();
        expect(style.sheet.cssRules[0].cssText).toEqual(
            Browser.isFirefox
                ? '#contentDiv_0 #tableSelected0 > THEAD > tr:nth-child(2) > TD:nth-child(2), #contentDiv_0 #tableSelected0 > TBODY > tr:nth-child(1) > TD:nth-child(2), #contentDiv_0 #tableSelected0 > TBODY > tr:nth-child(2) > TD:nth-child(2), #contentDiv_0 #tableSelected0 > TFOOT > tr:nth-child(1) > TD:nth-child(2) { background-color: rgba(198, 198, 198, 0.7) !important; }'
                : '#contentDiv_0 #tableSelected0 > thead > tr:nth-child(2) > td:nth-child(2), #contentDiv_0 #tableSelected0 > tbody > tr:nth-child(1) > td:nth-child(2), #contentDiv_0 #tableSelected0 > tbody > tr:nth-child(2) > td:nth-child(2), #contentDiv_0 #tableSelected0 > tfoot > tr:nth-child(1) > td:nth-child(2) { background-color: rgba(198, 198, 198, 0.7) !important; }'
        );
    });

    it('Select Table Cells THEAD, TFOOT', () => {
        div.innerHTML = buildTableHTML(false /* tbody */, true /* thead */, true /* tfoot */);
        table = div.querySelector('table');

        selectTable(core, table, <TableSelection>{
            firstCell: { x: 1, y: 1 },
            lastCell: { x: 1, y: 2 },
        });

        const style = document.getElementById('tableStylecontentDiv_0') as HTMLStyleElement;
        expect(style).toBeDefined();
        expect(style.sheet.cssRules[0]).toBeDefined();
        expect(style.sheet.cssRules[0].cssText).toEqual(
            Browser.isFirefox
                ? '#contentDiv_0 #tableSelected0 > THEAD > tr:nth-child(2) > TD:nth-child(2), #contentDiv_0 #tableSelected0 > TFOOT > tr:nth-child(1) > TD:nth-child(2) { background-color: rgba(198, 198, 198, 0.7) !important; }'
                : '#contentDiv_0 #tableSelected0 > thead > tr:nth-child(2) > td:nth-child(2), #contentDiv_0 #tableSelected0 > tfoot > tr:nth-child(1) > td:nth-child(2) { background-color: rgba(198, 198, 198, 0.7) !important; }'
        );
    });

    it('remove duplicated ID', () => {
        const tableHTML = buildTableHTML(true);
        div.innerHTML = tableHTML + '' + tableHTML;

        const tables = div.querySelectorAll('table');
        table = tables[0];
        tables.forEach(table => (table.id = 'DuplicatedId'));

        selectTable(core, table, <TableSelection>{
            firstCell: { x: 0, y: 0 },
            lastCell: { x: 0, y: 0 },
        });

        expect(table.id).not.toEqual(tables[1].id);
    });

    describe('Null scenarios |', () => {
        it('Null table selection', () => {
            const core = createEditorCore(div, {});
            selectTable(core, table, null);

            expect(document.getElementById('tableStylecontentDiv_0')).toBeNull();
        });

        it('Null first cell coordinates', () => {
            selectTable(core, table, <TableSelection>{
                firstCell: null,
                lastCell: { x: 1, y: 1 },
            });

            expect(document.getElementById('tableStylecontentDiv_0')).toBeNull();
        });

        it('Null last cell coordinates', () => {
            selectTable(core, table, <TableSelection>{
                firstCell: { x: 1, y: 1 },
                lastCell: null,
            });

            expect(document.getElementById('tableStylecontentDiv_0')).toBeNull();
        });

        it('Null first cell y coordinate', () => {
            selectTable(core, table, <TableSelection>{
                firstCell: { x: 0, y: null },
                lastCell: { x: 1, y: 1 },
            });

            expect(document.getElementById('tableStylecontentDiv_0')).toBeNull();
        });

        it('Null first cell x coordinate', () => {
            selectTable(core, table, <TableSelection>{
                firstCell: { x: null, y: 0 },
                lastCell: { x: 1, y: 1 },
            });

            expect(document.getElementById('tableStylecontentDiv_0')).toBeNull();
        });

        it('Null last cell y coordinate', () => {
            selectTable(core, table, <TableSelection>{
                firstCell: { x: 0, y: 0 },
                lastCell: { x: 1, y: null },
            });

            expect(document.getElementById('tableStylecontentDiv_0')).toBeNull();
        });

        it('Null last cell x coordinate', () => {
            selectTable(core, table, <TableSelection>{
                firstCell: { x: 0, y: 0 },
                lastCell: { x: null, y: 1 },
            });

            expect(document.getElementById('tableStylecontentDiv_0')).toBeNull();
        });

        it('Null last cell x & y coordinate', () => {
            selectTable(core, table, <TableSelection>{
                firstCell: { x: 0, y: 0 },
                lastCell: { x: null, y: null },
            });

            expect(document.getElementById('tableStylecontentDiv_0')).toBeNull();
        });

        it('Null first cell x & y coordinate', () => {
            selectTable(core, table, <TableSelection>{
                lastCell: { x: 0, y: 0 },
                firstCell: { x: null, y: null },
            });

            expect(document.getElementById('tableStylecontentDiv_0')).toBeNull();
        });
    });

    describe('Merged Cells scenarios |', () => {
        it('First cell merged', () => {
            div.innerHTML = buildTableHTML();

            const table = div.querySelector('table');
            table!.rows.item(0)!.cells.item(0)!.rowSpan = 2;

            const input = <TableSelection>{
                firstCell: { x: 0, y: 0 },
                lastCell: { x: 1, y: 0 },
            };
            const result = selectTable(core, table, input) as TableSelectionRange;

            expect(result.table).toBe(table);
            expect(result.coordinates).toEqual(input);
        });
        //  _________________
        // |     (0, 0)      |
        // |_________________|
        // | (1, 0) | (1, 1) |
        // |________|________|
        it('0,0 to 1, 0', () => {
            div.innerHTML = buildTableHTML();
            const table = div.querySelector('table');
            table!.rows.item(0)!.cells.item(0)!.colSpan = 2;

            const input = <TableSelection>{
                firstCell: { x: 0, y: 0 },
                lastCell: { x: 0, y: 1 },
            };
            const result = selectTable(core, table, input) as TableSelectionRange;

            const td = table?.querySelector('tr:nth-child(2) > td');
            const td2 = table?.querySelector('tr:nth-child(2) > td:nth-child(2)');

            expect(getComputedStyle(td!, 'background-color')).toEqual('rgba(198, 198, 198, 0.7)');
            expect(getComputedStyle(td2!, 'background-color')).toEqual('rgba(0, 0, 0, 0)');
            expect(result.table).toBe(table);
            expect(result.coordinates).toEqual(input);
        });

        it('Multiple merged cells 1', () => {
            /**
             * Should select All Table
                +------+------+
                |      |      |
                +      +------+
                |      |      |
                +      +------+
                |      |      |
                +------+------+
             */
            div.innerHTML =
                '<table id="tableSelected0"><tbody><tr><td rowspan="3"></td><td></td></tr><tr><td></td></tr><tr><td></td></tr></tbody></table>';

            const table = div.querySelector('table');

            const input = <TableSelection>{
                firstCell: { x: 0, y: 0 },
                lastCell: { x: 1, y: 2 },
            };
            const result = selectTable(core, table, input) as TableSelectionRange;

            table?.querySelectorAll('tr')!.forEach(row =>
                Array.from(row.cells).forEach(cell => {
                    expect(getComputedStyle(cell, 'background-color')).toEqual(
                        'rgba(198, 198, 198, 0.7)'
                    );
                })
            );

            expect(result.table).toBe(table);
            expect(result.coordinates).toEqual(input);
        });

        it('Multiple merged cells 2', () => {
            /**
             * Select all
                +------+------+------+
                |             |      |
                +------+------+------+
                |                    |
                +------+------+------+
             */

            div.innerHTML =
                '<div><table id="tableSelected0"><tbody><tr><td colSpan="2"></td><td></td></tr><tr><td colspan="3"></td></tr></tbody></table>';
            const table = div.querySelector('table');

            const input = <TableSelection>{
                firstCell: { x: 0, y: 0 },
                lastCell: { x: 0, y: 1 },
            };
            const result = selectTable(core, table, input) as TableSelectionRange;

            table?.querySelectorAll('tr')!.forEach(row =>
                Array.from(row.cells).forEach(cell => {
                    expect(getComputedStyle(cell, 'background-color')).toEqual(
                        'rgba(198, 198, 198, 0.7)'
                    );
                })
            );

            expect(result.table).toBe(table);
            expect(result.coordinates).toEqual(input);
        });

        it('Multiple merged cells 1', () => {
            /**
             * Should select All Table
                +------+------+
                |      |      |
                +      +------+
                |      |      |
                +      +      +
                |      |      |
                +------+------+
             */
            div.innerHTML =
                '<table id="tableSelected0"><tbody><tr><td rowspan="3"></td><td></td></tr><tr><td rowspan="2"></td></tr><tr></tr></tbody></table>';

            const table = div.querySelector('table');

            const input = <TableSelection>{
                firstCell: { x: 0, y: 0 },
                lastCell: { x: 1, y: 2 },
            };
            const result = selectTable(core, table, input) as TableSelectionRange;

            table?.querySelectorAll('tr')!.forEach(row =>
                Array.from(row.cells).forEach(cell => {
                    expect(getComputedStyle(cell, 'background-color')).toEqual(
                        'rgba(198, 198, 198, 0.7)'
                    );
                })
            );

            expect(result.table).toBe(table);
            expect(result.coordinates).toEqual(input);
        });
    });
});

function buildTableHTML(tbody: boolean = true, thead: boolean = false, tfoot: boolean = false) {
    let table = '<div><table id="tableSelected0">';

    if (thead) {
        table +=
            '<thead><tr><td><span>Test</span></td><td><span>Test</span></td></tr><tr><td><span>Test</span></td><td><span>Test</span></td></tr></thead>';
    }

    if (tbody) {
        table +=
            '<tbody><tr><td><span>Test</span></td><td><span>Test</span></td></tr><tr><td><span>Test</span></td><td><span>Test</span></td></tr></tbody>';
    }

    if (tfoot) {
        table +=
            '<tfoot><tr><td><span>Test</span></td><td><span>Test</span></td></tr><tr><td><span>Test</span></td><td><span>Test</span></td></tr></tfoot>';
    }

    table += '</table><br></div>';

    return table;
}
