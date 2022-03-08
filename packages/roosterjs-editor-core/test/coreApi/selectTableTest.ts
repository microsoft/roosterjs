import createEditorCore from './createMockEditorCore';
import { Browser } from 'roosterjs-editor-dom';
import { EditorCore, TableSelection } from 'roosterjs-editor-types';
import { selectTable } from '../../lib/coreApi/selectTable';

describe('selectTable |', () => {
    let div: HTMLDivElement;
    let table: HTMLTableElement;
    let core: EditorCore;
    beforeEach(() => {
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
        div = null;
    });

    it('Select Table Cells TR under Table Tag', () => {
        div.innerHTML =
            '<div><table><tr><td><span>Test</span></td><td><span>Test</span></td></tr><tr><td><span>Test</span></td><td><span>Test</span></td></tr></table><br></div>';

        selectTable(core, table, <TableSelection>{
            firstCell: { x: 0, y: 0 },
            lastCell: { x: 1, y: 1 },
        });

        expect(div.outerHTML).toBe(
            '<div id="contentDiv_0"><div><table><tbody><tr><td><span>Test</span></td><td><span>Test</span></td></tr><tr><td><span>Test</span></td><td><span>Test</span></td></tr></tbody></table><br></div></div>'
        );
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

        expect(div.outerHTML).toBe(
            '<div id="contentDiv_0"><div><table id="tableSelected0"><tbody><tr><td><span>Test</span></td><td><span>Test</span></td></tr><tr><td><span>Test</span></td><td><span>Test</span></td></tr></tbody></table><br></div></div>'
        );
        const style = document.getElementById('tableStylecontentDiv_0') as HTMLStyleElement;
        expect(style).toBeDefined();
        expect(style.sheet.cssRules[0]).toBeDefined();
        expect(style.sheet.cssRules[0].cssText).toEqual(
            Browser.isFirefox
                ? '#contentDiv_0 #tableSelected0 > TBODY > tr:nth-child(1) > TD:nth-child(1), #contentDiv_0 #tableSelected0 > TBODY > tr:nth-child(1) > TD:nth-child(2), #contentDiv_0 #tableSelected0 > TBODY > tr:nth-child(2) > TD:nth-child(1), #contentDiv_0 #tableSelected0 > TBODY > tr:nth-child(2) > TD:nth-child(2) { background-color: rgba(198, 198, 198, 0.7) !important; }'
                : '#contentDiv_0 #tableSelected0 > tbody > tr:nth-child(1) > td:nth-child(1), #contentDiv_0 #tableSelected0 > tbody > tr:nth-child(1) > td:nth-child(2), #contentDiv_0 #tableSelected0 > tbody > tr:nth-child(2) > td:nth-child(1), #contentDiv_0 #tableSelected0 > tbody > tr:nth-child(2) > td:nth-child(2) { background-color: rgba(198, 198, 198, 0.7) !important; }'
        );
    });

    it('Select Table Cells THEAD, TBODY', () => {
        div.innerHTML = buildTableHTML(true /* tbody */, true /* thead */);

        table = div.querySelector('table');

        selectTable(core, table, <TableSelection>{
            firstCell: { x: 1, y: 1 },
            lastCell: { x: 2, y: 2 },
        });

        expect(div.outerHTML).toBe(
            '<div id="contentDiv_0"><div><table id="tableSelected0"><thead><tr><td><span>Test</span></td><td><span>Test</span></td></tr><tr><td><span>Test</span></td><td><span>Test</span></td></tr></thead><tbody><tr><td><span>Test</span></td><td><span>Test</span></td></tr><tr><td><span>Test</span></td><td><span>Test</span></td></tr></tbody></table><br></div></div>'
        );

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

        expect(div.outerHTML).toBe(
            '<div id="contentDiv_0"><div><table id="tableSelected0"><tbody><tr><td><span>Test</span></td><td><span>Test</span></td></tr><tr><td><span>Test</span></td><td><span>Test</span></td></tr></tbody><tfoot><tr><td><span>Test</span></td><td><span>Test</span></td></tr><tr><td><span>Test</span></td><td><span>Test</span></td></tr></tfoot></table><br></div></div>'
        );

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

        expect(div.outerHTML).toBe(
            '<div id="contentDiv_0"><div><table id="tableSelected0"><thead><tr><td><span>Test</span></td><td><span>Test</span></td></tr><tr><td><span>Test</span></td><td><span>Test</span></td></tr></thead><tbody><tr><td><span>Test</span></td><td><span>Test</span></td></tr><tr><td><span>Test</span></td><td><span>Test</span></td></tr></tbody><tfoot><tr><td><span>Test</span></td><td><span>Test</span></td></tr><tr><td><span>Test</span></td><td><span>Test</span></td></tr></tfoot></table><br></div></div>'
        );

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

        expect(div.outerHTML).toBe(
            '<div id="contentDiv_0"><div><table id="tableSelected0"><thead><tr><td><span>Test</span></td><td><span>Test</span></td></tr><tr><td><span>Test</span></td><td><span>Test</span></td></tr></thead><tfoot><tr><td><span>Test</span></td><td><span>Test</span></td></tr><tr><td><span>Test</span></td><td><span>Test</span></td></tr></tfoot></table><br></div></div>'
        );

        const style = document.getElementById('tableStylecontentDiv_0') as HTMLStyleElement;
        expect(style).toBeDefined();
        expect(style.sheet.cssRules[0]).toBeDefined();
        expect(style.sheet.cssRules[0].cssText).toEqual(
            Browser.isFirefox
                ? '#contentDiv_0 #tableSelected0 > THEAD > tr:nth-child(2) > TD:nth-child(2), #contentDiv_0 #tableSelected0 > TFOOT > tr:nth-child(1) > TD:nth-child(2) { background-color: rgba(198, 198, 198, 0.7) !important; }'
                : '#contentDiv_0 #tableSelected0 > thead > tr:nth-child(2) > td:nth-child(2), #contentDiv_0 #tableSelected0 > tfoot > tr:nth-child(1) > td:nth-child(2) { background-color: rgba(198, 198, 198, 0.7) !important; }'
        );
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
