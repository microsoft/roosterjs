import createEditorCore from './createMockEditorCore';
import { EditorCore, TableSelection } from 'roosterjs-editor-types';
import { selectTable } from '../../lib/coreApi/selectTable';

describe('selectTable |', () => {
    let div: HTMLDivElement | null;
    let table: HTMLTableElement | null;
    let core: EditorCore | null;

    let cssSheet: CSSStyleSheet;
    let styleSheet: HTMLStyleElement;

    beforeEach(() => {
        document.body.innerHTML = '';
        div = document.createElement('div');
        div!.innerHTML = buildTableHTML(true /* tbody */);

        table = div!.querySelector('table');
        document.body.appendChild(div!);

        core = createEditorCore(div, {});

        cssSheet = new CSSStyleSheet();
        styleSheet = <HTMLStyleElement>{
            id: '',
            sheet: cssSheet,
        };

        spyOn(cssSheet, 'insertRule');
        spyOn(document.head, 'appendChild');
        spyOn(document, 'createElement').and.returnValue(styleSheet);
    });

    afterEach(() => {
        let styles = document.querySelectorAll('#tableStylecontentDiv_0');
        styles.forEach(s => s.parentElement?.removeChild(s));

        core = null;
        div = null;
        table = null;
        document.body.innerHTML = '';
    });

    function runTest(
        content: string,
        selection: TableSelection | null,
        timesCalled: number,
        cssRule?: string
    ) {
        while (div!.firstChild) {
            div!.removeChild(div!.firstChild);
        }
        div!.innerHTML = content;

        table = div!.querySelector('table');

        selectTable(core, table, selection);

        expect(document.head.appendChild).toHaveBeenCalledTimes(timesCalled);
        expect(document.createElement).toHaveBeenCalledTimes(timesCalled);
        expect(cssSheet.insertRule).toHaveBeenCalledTimes(timesCalled);
        if (cssRule) {
            expect(cssSheet.insertRule).toHaveBeenCalledWith(cssRule);
        }
    }

    it('Select Table Cells TR under Table Tag', () => {
        runTest(
            '<div><table><tr><td><span>Test</span></td><td><span>Test</span></td></tr><tr><td><span>Test</span></td><td><span>Test</span></td></tr></table><br></div>',
            <TableSelection>{
                firstCell: { x: 0, y: 0 },
                lastCell: { x: 1, y: 1 },
            },
            1,
            '#contentDiv_0 #tableSelected0>TBODY> tr:nth-child(1)>TD:nth-child(1),#contentDiv_0 #tableSelected0>TBODY> tr:nth-child(1)>TD:nth-child(2),#contentDiv_0 #tableSelected0>TBODY> tr:nth-child(2)>TD:nth-child(1),#contentDiv_0 #tableSelected0>TBODY> tr:nth-child(2)>TD:nth-child(2){background-color: rgba(198,198,198,0.7) !important;}'
        );
    });

    it('Select Table Cells TBODY', () => {
        runTest(
            buildTableHTML(true /* tbody */),
            <TableSelection>{
                firstCell: { x: 0, y: 0 },
                lastCell: { x: 1, y: 1 },
            },
            1,
            '#contentDiv_0 #tableSelected0>TBODY> tr:nth-child(1)>TD:nth-child(1),#contentDiv_0 #tableSelected0>TBODY> tr:nth-child(1)>TD:nth-child(2),#contentDiv_0 #tableSelected0>TBODY> tr:nth-child(2)>TD:nth-child(1),#contentDiv_0 #tableSelected0>TBODY> tr:nth-child(2)>TD:nth-child(2){background-color: rgba(198,198,198,0.7) !important;}'
        );
    });

    it('Select TH and TR in the same row', () => {
        runTest(
            '<div><table><tr><th>Test</th><td>Test</td></tr><tr><th>Test</th><td>Test</td></tr></table><br></div>',
            <TableSelection>{
                firstCell: { x: 0, y: 0 },
                lastCell: { x: 1, y: 1 },
            },
            1,
            '#contentDiv_0 #tableSelected0>TBODY> tr:nth-child(1)>TH:nth-child(1),#contentDiv_0 #tableSelected0>TBODY> tr:nth-child(1)>TD:nth-child(2),#contentDiv_0 #tableSelected0>TBODY> tr:nth-child(2)>TH:nth-child(1),#contentDiv_0 #tableSelected0>TBODY> tr:nth-child(2)>TD:nth-child(2){background-color: rgba(198,198,198,0.7) !important;}'
        );
    });

    it('Select Table Cells THEAD, TBODY', () => {
        runTest(
            buildTableHTML(true /* tbody */, true /* thead */),
            <TableSelection>{
                firstCell: { x: 1, y: 1 },
                lastCell: { x: 2, y: 2 },
            },
            1,
            '#contentDiv_0 #tableSelected0>THEAD> tr:nth-child(2)>TD:nth-child(2),#contentDiv_0 #tableSelected0>TBODY> tr:nth-child(1)>TD:nth-child(2){background-color: rgba(198,198,198,0.7) !important;}'
        );
    });

    it('Select Table Cells TBODY, TFOOT', () => {
        runTest(
            buildTableHTML(true /* tbody */, false /* thead */, true /* tfoot */),
            <TableSelection>{
                firstCell: { x: 1, y: 1 },
                lastCell: { x: 1, y: 2 },
            },
            1,
            '#contentDiv_0 #tableSelected0>TBODY> tr:nth-child(2)>TD:nth-child(2),#contentDiv_0 #tableSelected0>TFOOT> tr:nth-child(1)>TD:nth-child(2){background-color: rgba(198,198,198,0.7) !important;}'
        );
    });

    it('Select Table Cells THEAD, TBODY, TFOOT', () => {
        runTest(
            buildTableHTML(true /* tbody */, true /* thead */, true /* tfoot */),
            <TableSelection>{
                firstCell: { x: 1, y: 1 },
                lastCell: { x: 1, y: 4 },
            },
            1,
            '#contentDiv_0 #tableSelected0>THEAD> tr:nth-child(2)>TD:nth-child(2),#contentDiv_0 #tableSelected0>TBODY> tr:nth-child(1)>TD:nth-child(2),#contentDiv_0 #tableSelected0>TBODY> tr:nth-child(2)>TD:nth-child(2),#contentDiv_0 #tableSelected0>TFOOT> tr:nth-child(1)>TD:nth-child(2){background-color: rgba(198,198,198,0.7) !important;}'
        );
    });

    it('Select Table Cells THEAD, TFOOT', () => {
        runTest(
            buildTableHTML(false /* tbody */, true /* thead */, true /* tfoot */),
            <TableSelection>{
                firstCell: { x: 1, y: 1 },
                lastCell: { x: 1, y: 2 },
            },
            1,
            '#contentDiv_0 #tableSelected0>THEAD> tr:nth-child(2)>TD:nth-child(2),#contentDiv_0 #tableSelected0>TFOOT> tr:nth-child(1)>TD:nth-child(2){background-color: rgba(198,198,198,0.7) !important;}'
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
            runTest(buildTableHTML(true /* tbody */), null, 0);
        });

        it('Null first cell coordinates', () => {
            runTest(
                buildTableHTML(true /* tbody */),
                <TableSelection>{
                    firstCell: null,
                    lastCell: { x: 1, y: 1 },
                },
                0
            );
        });

        it('Null last cell coordinates', () => {
            runTest(
                buildTableHTML(true /* tbody */),
                <TableSelection>{
                    firstCell: { x: 1, y: 1 },
                    lastCell: null,
                },
                0
            );
        });

        it('Null first cell y coordinate', () => {
            runTest(
                buildTableHTML(true /* tbody */),
                <TableSelection>{
                    firstCell: { x: 0, y: null },
                    lastCell: { x: 1, y: 1 },
                },
                0
            );
        });

        it('Null first cell x coordinate', () => {
            runTest(
                buildTableHTML(true /* tbody */),
                <TableSelection>{
                    firstCell: { x: null, y: 0 },
                    lastCell: { x: 1, y: 1 },
                },
                0
            );
        });

        it('Null last cell y coordinate', () => {
            runTest(
                buildTableHTML(true /* tbody */),
                <TableSelection>{
                    firstCell: { x: 0, y: 0 },
                    lastCell: { x: 1, y: null },
                },
                0
            );
        });

        it('Null last cell x coordinate', () => {
            runTest(
                buildTableHTML(true /* tbody */),
                <TableSelection>{
                    firstCell: { x: 0, y: 0 },
                    lastCell: { x: null, y: 1 },
                },
                0
            );
        });

        it('Null last cell x & y coordinate', () => {
            runTest(
                buildTableHTML(true /* tbody */),
                <TableSelection>{
                    firstCell: { x: 0, y: 0 },
                    lastCell: { x: null, y: null },
                },
                0
            );
        });

        it('Null first cell x & y coordinate', () => {
            runTest(
                buildTableHTML(true /* tbody */),
                <TableSelection>{
                    lastCell: { x: 0, y: 0 },
                    firstCell: { x: null, y: null },
                },
                0
            );
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
