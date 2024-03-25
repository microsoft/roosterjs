import { parseTableCells } from '../../../lib/domUtils/table/parseTableCells';

describe('parseTableCells', () => {
    function runTest(html: string, expectedResult: string[][]) {
        const div = document.createElement('div');
        div.innerHTML = html;

        const table = div.firstChild as HTMLTableElement;

        const result = parseTableCells(table);
        const idResult = result.map(row => row.map(td => (typeof td == 'object' ? td.id : td)));

        expect(idResult).toEqual(expectedResult);
    }

    it('empty table', () => {
        runTest('<table></table>', []);
    });

    it('1*1 table', () => {
        runTest('<table><tr><td id="td1"></td></tr></table>', [['td1']]);
    });

    it('2*2 table', () => {
        runTest(
            '<table><tr><td id="td1"></td><td id="td2"></td></tr><tr><td id="td3"></td><td id="td4"></td></tr></table>',
            [
                ['td1', 'td2'],
                ['td3', 'td4'],
            ]
        );
    });

    it('table with merged row', () => {
        runTest(
            '<table><tr><td id="td1" rowspan=2></td><td id="td2"></td></tr><tr><td id="td4"></td></tr></table>',
            [
                ['td1', 'td2'],
                ['spanTop', 'td4'],
            ]
        );
    });

    it('table with merged col', () => {
        runTest(
            '<table><tr><td id="td1" colspan=2></td></tr><tr><td id="td3"></td><td id="td4"></td></tr></table>',
            [
                ['td1', 'spanLeft'],
                ['td3', 'td4'],
            ]
        );
    });

    it('table with all merged cell', () => {
        runTest('<table><tr><td id="td1" colspan=2 rowspan=2></td></tr><tr></tr></table>', [
            ['td1', 'spanLeft'],
            ['spanTop', 'spanBoth'],
        ]);
    });

    it('table with variant lengths columns', () => {
        runTest(
            '<table><tr><td id="td1"></td><td id="td2"></td></tr><tr><td id="td3"></td><td id="td4"></td><td id="td5"></td></tr></table>',
            [
                ['td1', 'td2'],
                ['td3', 'td4', 'td5'],
            ]
        );
    });

    it('table with complex merged cells', () => {
        runTest(
            '<table><tr><td id="td1" colspan=2></td><td id="td3" rowspan=2></td></tr><tr><td id="td4" rowspan=2></td><td id="td5"></td></tr><tr><td id="td8" colspan=2></td></tr></table>',
            [
                ['td1', 'spanLeft', 'td3'],
                ['td4', 'td5', 'spanTop'],
                ['spanTop', 'td8', 'spanLeft'],
            ]
        );
    });
});
