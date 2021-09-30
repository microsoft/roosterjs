import setStyles from '../../lib/style/setStyles';

describe('setStyles', () => {
    function runTest(styles: Record<string, string>, expected: string) {
        const div = document.createElement('div');
        setStyles(div, styles);
        const result = div.getAttribute('style');
        expect(result).toEqual(expected);
    }

    it('null element', () => {
        setStyles(null, null);
        expect();
    });

    it('empty input', () => {
        runTest(null, null);
    });

    it('empty input 2', () => {
        runTest({}, null);
    });

    it('Single style', () => {
        runTest({ color: 'red' }, 'color:red');
    });

    it('multiple input', () => {
        runTest({ color: 'red', ['font-size']: '10pt' }, 'color:red;font-size:10pt');
    });

    it('invalid input', () => {
        runTest({ ['']: 'red', ['  a ']: ' b ', ['font-size']: '  ' }, 'a:b');
    });

    it('customized input', () => {
        runTest({ a: 'b', color: 'asdf', c: 'd' }, 'a:b;color:asdf;c:d');
    });

    it('contains space', () => {
        runTest({ [' a\nb ']: ' b ', [' \nc\nd\n ']: '  d  ' }, 'a\nb:b;c\nd:d');
    });
});
