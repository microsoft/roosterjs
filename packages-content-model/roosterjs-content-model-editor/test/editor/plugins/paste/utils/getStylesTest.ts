import { getStyles } from '../../../../../lib/editor/plugins/PastePlugin/utils/getStyles';

describe('getStyles', () => {
    function runTest(style: string, expected: Record<string, string>) {
        const div = document.createElement('div');
        div.setAttribute('style', style);
        const result = getStyles(div);
        expect(result).toEqual(expected);
    }

    it('empty input', () => {
        runTest('', {});
    });

    it('empty input 2', () => {
        runTest(';;;;', {});
    });

    it('Single style', () => {
        runTest('color: red', { color: 'red' });
    });

    it('multiple input', () => {
        runTest('color: red; font-size: 10pt', { color: 'red', ['font-size']: '10pt' });
    });

    it('invalid input', () => {
        runTest(';color:red;:asdf;font-size: 10pt;asdf:', { color: 'red', ['font-size']: '10pt' });
    });

    it('conflict input', () => {
        runTest('color: red; font-size: 10pt; color: green', {
            color: 'green',
            ['font-size']: '10pt',
        });
    });

    it('customized input', () => {
        runTest('a:b;color:asdf;c:d', { a: 'b', color: 'asdf', c: 'd' });
    });

    it('contains space', () => {
        runTest('  a \n  : \n b \r\n  ;  \n c:  d', { a: 'b', c: 'd' });
    });
});
