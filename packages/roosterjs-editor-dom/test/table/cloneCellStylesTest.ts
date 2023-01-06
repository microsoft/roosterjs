import cloneCellStyles from '../../lib/table/cloneCellStyles';
import { decode64 } from '../DomTestHelper';

describe('cloneCellStyles', () => {
    function runTest(style: string) {
        const cell = document.createElement('td');
        const styledCell = document.createElement('td');
        styledCell.setAttribute('style', style);
        cloneCellStyles(cell, styledCell);
        expect(cell.getAttribute('style')).toEqual(style);
        const editingInfo = cell.getAttribute('data-editing-info');
        expect(decode64(editingInfo!)).toBe('{"bgColorOverride":true}');
    }

    it('cloneCellStyles | should clone style and add metadata', () => {
        runTest('color: red');
    });
});
