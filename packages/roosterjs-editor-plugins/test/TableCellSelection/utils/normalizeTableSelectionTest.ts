import normalizeTableSelection from '../../../lib/plugins/TableCellSelection/utils/normalizeTableSelection';
import { TableSelection } from 'roosterjs-editor-types';
import { VTable } from 'roosterjs-editor-dom';

describe('normalize table selection |', () => {
    function runTest(selection: TableSelection, expectResult: TableSelection) {
        let div = document.createElement('div');
        document.body.appendChild(div);
        div.innerHTML =
            '<table id="testTable"><tr><td></td><td></td></tr><tr><td></td><td></td></tr></table>';
        let node = document.getElementById('testTable') as HTMLTableElement;
        const vTable = new VTable(node);
        vTable.selection = selection;
        expect(normalizeTableSelection(vTable)).toEqual(expectResult);
        document.body.removeChild(div);
    }

    it('Expect same input', () => {
        runTest(
            <TableSelection>{
                firstCell: { x: 0, y: 0 },
                lastCell: { x: 1, y: 1 },
            },
            <TableSelection>{
                firstCell: { x: 0, y: 0 },
                lastCell: { x: 1, y: 1 },
            }
        );
    });

    it('Expect null, firstCell null', () => {
        runTest(
            <TableSelection>{
                firstCell: null,
                lastCell: { x: 1, y: 1 },
            },
            null
        );
    });

    it('Expect null, lastCell null', () => {
        runTest(
            <TableSelection>{
                firstCell: { x: 1, y: 1 },
                lastCell: null,
            },
            null
        );
    });

    it('Expect null, lastCell & firstCell null', () => {
        runTest(
            <TableSelection>{
                firstCell: null,
                lastCell: null,
            },
            null
        );
    });

    it('Expect null, input null', () => {
        runTest(null, null);
    });

    it('Normalize 1', () => {
        runTest(
            <TableSelection>{
                firstCell: { x: 1, y: 1 },
                lastCell: { x: 0, y: 0 },
            },
            <TableSelection>{
                firstCell: { x: 0, y: 0 },
                lastCell: { x: 1, y: 1 },
            }
        );
    });

    it('Normalize 2', () => {
        runTest(
            <TableSelection>{
                firstCell: { x: 1, y: 0 },
                lastCell: { x: 0, y: 0 },
            },
            <TableSelection>{
                firstCell: { x: 0, y: 0 },
                lastCell: { x: 1, y: 0 },
            }
        );
    });

    it('Normalize 2', () => {
        runTest(
            <TableSelection>{
                firstCell: { x: null, y: null },
                lastCell: { x: 0, y: 0 },
            },
            <TableSelection>{
                firstCell: { x: 0, y: 0 },
                lastCell: { x: 0, y: 0 },
            }
        );
    });

    it('VTable is null', () => {
        const vTable = <VTable>null;
        expect(normalizeTableSelection(vTable)).toEqual(null);
    });
});
