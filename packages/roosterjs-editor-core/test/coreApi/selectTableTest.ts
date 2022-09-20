import createEditorCore from './createMockEditorCore';
import { Browser } from 'roosterjs-editor-dom';
import { EditorCore, TableSelection } from 'roosterjs-editor-types';
import { selectTable } from '../../lib/coreApi/selectTable';

xdescribe('selectTable |', () => {
    let div: HTMLDivElement | null;
    let table: HTMLTableElement | null;
    let core: EditorCore | null;

    beforeEach(() => {
        div = document.createElement('div');
        div!.innerHTML = buildTableHTML(true /* tbody */);

        table = div!.querySelector('table');
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
        div!.innerHTML =
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
        div!.innerHTML =
            '<div><table><tr><th>Test</th><td>Test</td></tr><tr><th>Test</th><td>Test</td></tr></table><br></div>';
        table = div!.querySelector('table');

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
        div!.innerHTML = buildTableHTML(true /* tbody */, true /* thead */);

        table = div!.querySelector('table');

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
        div!.innerHTML = buildTableHTML(true /* tbody */, false /* thead */, true /* tfoot */);

        table = div!.querySelector('table');

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
        div!.innerHTML = buildTableHTML(true /* tbody */, true /* thead */, true /* tfoot */);
        table = div!.querySelector('table');

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
        div!.innerHTML = buildTableHTML(false /* tbody */, true /* thead */, true /* tfoot */);
        table = div!.querySelector('table');

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
        div!.innerHTML = tableHTML + '' + tableHTML;

        const tables = div!.querySelectorAll('table');
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
            const core = createEditorCore(div!, {});
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

        xit('Null last cell x coordinate', () => {
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
});

function buildTableHTML(tbody: boolean, thead: boolean = false, tfoot: boolean = false) {
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
