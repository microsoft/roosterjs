import cloneCellStyles from '../../lib/table/cloneCellStyles';
import { saveTableCellMetadata } from '../../lib/table/tableCellInfo';

describe('cloneCellStyles', () => {
    function runTest(style: string) {
        const cell = document.createElement('td');
        const styledCell = document.createElement('td');
        styledCell.setAttribute('style', style);
        cloneCellStyles(cell, styledCell);
        console.log(
            'FAILED:',
            cell.getAttribute('data-editing-info'),
            styledCell.getAttribute('data-editing-info')
        );
        expect(cell.getAttribute('style')).toEqual(style);
        expect(cell.getAttribute('data-editing-info')).toBe(
            styledCell.getAttribute('data-editing-info')
        );
    }

    it('cloneCellStyles | should clone style and add metadata', () => {
        runTest('color: red');
    });
});
