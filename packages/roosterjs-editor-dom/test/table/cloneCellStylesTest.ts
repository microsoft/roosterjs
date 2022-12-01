import cloneCellStyles from '../../lib/table/cloneCellStyles';

describe('cloneCellStyles', () => {
    function runTest(style: string) {
        const cell = document.createElement('td');
        const styledCell = document.createElement('td');
        styledCell.setAttribute('style', style);
        cloneCellStyles(cell, styledCell);
        expect(cell.getAttribute('style')).toEqual(style);
        expect(cell.getAttribute('data-editing-info')).toBe('{"bgColorOverride":true}');
    }

    it('cloneCellStyles | should clone style and add metadata', () => {
        runTest('color: red');
    });
});
