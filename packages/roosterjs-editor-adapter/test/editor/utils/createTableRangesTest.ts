import { createTableRanges } from '../../../lib/editor/utils/createTableRanges';
import { DOMSelection } from 'roosterjs-content-model-types';

describe('createTableRanges', () => {
    function runTest(
        html: string,
        firstRow: number,
        firstColumn: number,
        lastRow: number,
        lastColumn: number,
        expectedIds: (string | null)[]
    ) {
        const div = document.createElement('div');
        div.innerHTML = html;
        const table = div.firstChild as HTMLTableElement;

        const selection: DOMSelection = {
            type: 'table',
            table: table,
            firstColumn,
            firstRow,
            lastColumn,
            lastRow,
        };

        const result = createTableRanges(selection);
        const idResult = result.map(range => {
            const startContainer = range.startContainer.childNodes[range.startOffset];
            const endContainer = range.endContainer.childNodes[range.endOffset - 1];

            return startContainer == endContainer ? (startContainer as HTMLElement).id : null;
        });

        expect(idResult).toEqual(expectedIds);
    }

    it('empty table', () => {
        runTest('<table></table>', 0, 0, 0, 0, []);
    });

    it('1*1 table, no selection', () => {
        runTest('<table><tr><td id="td1"></td></tr></table>', -1, -1, -1, -1, []);
    });

    it('1*1 table, has selection', () => {
        runTest('<table><tr><td id="td1"></td></tr></table>', 0, 0, 0, 0, ['td1']);
    });

    it('2*2 table, has sub selection', () => {
        runTest(
            '<table><tr><td id="td1"></td><td id="td2"></td></tr><tr><td id="td3"></td><td id="td4"></td></tr></table>',
            0,
            1,
            1,
            1,
            ['td2', 'td4']
        );
    });

    it('table with merged row - 1', () => {
        runTest(
            '<table><tr><td id="td1" rowspan=2></td><td id="td2"></td></tr><tr><td id="td4"></td></tr></table>',
            0,
            0,
            1,
            0,
            ['td1']
        );
    });

    it('table with merged row - 2', () => {
        runTest(
            '<table><tr><td id="td1" rowspan=2></td><td id="td2"></td></tr><tr><td id="td4"></td></tr></table>',
            0,
            1,
            1,
            1,
            ['td2', 'td4']
        );
    });

    it('table with merged col - 1', () => {
        runTest(
            '<table><tr><td id="td1" colspan=2></td></tr><tr><td id="td3"></td><td id="td4"></td></tr></table>',
            0,
            0,
            0,
            1,
            ['td1']
        );
    });

    it('table with merged col - 2', () => {
        runTest(
            '<table><tr><td id="td1" colspan=2></td></tr><tr><td id="td3"></td><td id="td4"></td></tr></table>',
            1,
            0,
            1,
            1,
            ['td3', 'td4']
        );
    });

    it('table with all merged cell - 1', () => {
        runTest(
            '<table><tr><td id="td1" colspan=2 rowspan=2></td></tr><tr></tr></table>',
            0,
            0,
            0,
            0,
            ['td1']
        );
    });

    it('table with all merged cell - 2', () => {
        runTest(
            '<table><tr><td id="td1" colspan=2 rowspan=2></td></tr><tr></tr></table>',
            1,
            1,
            1,
            1,
            []
        );
    });

    it('table with variant lengths columns', () => {
        runTest(
            '<table><tr><td id="td1"></td><td id="td2"></td></tr><tr><td id="td3"></td><td id="td4"></td><td id="td5"></td></tr></table>',
            0,
            1,
            1,
            2,
            ['td2', 'td4', 'td5']
        );
    });

    it('table with complex merged cells - 1', () => {
        runTest(
            '<table><tr><td id="td1" colspan=2></td><td id="td3" rowspan=2></td></tr><tr><td id="td4" rowspan=2></td><td id="td5"></td></tr><tr><td id="td8" colspan=2></td></tr></table>',
            0,
            0,
            0,
            2,
            ['td1', 'td3']
        );
    });

    it('table with complex merged cells - 2', () => {
        runTest(
            '<table><tr><td id="td1" colspan=2></td><td id="td3" rowspan=2></td></tr><tr><td id="td4" rowspan=2></td><td id="td5"></td></tr><tr><td id="td8" colspan=2></td></tr></table>',
            1,
            0,
            1,
            2,
            ['td4', 'td5']
        );
    });

    it('table with complex merged cells - 3', () => {
        runTest(
            '<table><tr><td id="td1" colspan=2></td><td id="td3" rowspan=2></td></tr><tr><td id="td4" rowspan=2></td><td id="td5"></td></tr><tr><td id="td8" colspan=2></td></tr></table>',
            1,
            1,
            2,
            2,
            ['td5', 'td8']
        );
    });

    it('table with complex merged cells - 4', () => {
        runTest(
            '<table><tr><td id="td1" colspan=2></td><td id="td3" rowspan=2></td></tr><tr><td id="td4" rowspan=2></td><td id="td5"></td></tr><tr><td id="td8" colspan=2></td></tr></table>',
            0,
            0,
            2,
            2,
            ['td1', 'td3', 'td4', 'td5', 'td8']
        );
    });
});
