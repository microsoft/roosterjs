import { expectHtml } from '../testUtils';
import { textToFragment } from '../../lib/domUtils/textToFragment';

describe('textToFragment', () => {
    function runTest(text: string, expectedHtml: string | string[]) {
        const tempDiv = document.createElement('div');

        const fragment = textToFragment(text, document);
        tempDiv.appendChild(fragment);

        expectHtml(tempDiv.innerHTML, expectedHtml);
    }

    it('empty string', () => {
        runTest('', '');
    });

    it('single line', () => {
        runTest('text', 'text');
    });

    it('two lines', () => {
        runTest('line1\r\nline2', 'line1<br>line2');
    });

    it('three lines', () => {
        runTest('line1\r\nline2\r\nline3', 'line1<div>line2</div>line3');
    });

    it('four lines', () => {
        runTest('line1\r\nline2\r\nline3\r\nline4', 'line1<div>line2</div><div>line3</div>line4');
    });

    it('empty middle line is wrapped with br', () => {
        runTest('line1\r\n\r\nline3', 'line1<div><br></div>line3');
    });

    it('single line with leading and trailing spaces', () => {
        runTest('  line    1   ', '&nbsp; line &nbsp; &nbsp;1 &nbsp;&nbsp;');
    });

    it('two lines with tab characters', () => {
        const ensp = '\u2002';
        runTest(
            '\tline 1\r\n  line\t2',
            ensp.repeat(6) + 'line 1<br>&nbsp; line' + ensp.repeat(6) + '2'
        );
    });

    it('single line with two tabs', () => {
        const ensp = '\u2002';
        runTest('1\t234\t5', '1' + ensp.repeat(5) + '234' + ensp.repeat(3) + '5');
    });
});
