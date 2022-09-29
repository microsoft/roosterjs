import removeImportantStyleRule from '../../lib/style/removeImportantStyleRule';

describe('removeImportantStyleRule', () => {
    function runTest(styles: string[], expected: string) {
        const div = document.createElement('div');
        div.setAttribute(
            'style',
            'border:1px solid black !important; background-color: green !important;'
        );
        removeImportantStyleRule(div, styles);
        const style = div.getAttribute('style');
        expect(style).toEqual(expected);
    }

    it('should remove important from all', () => {
        runTest(['border', 'background-color'], 'border:1px solid black;background-color:green');
    });

    it('should remove important from border', () => {
        runTest(['border'], 'border:1px solid black;background-color:green !important');
    });

    it('should not remove  important', () => {
        runTest(
            ['margin'],
            'border:1px solid black !important; background-color: green !important;'
        );
    });
});
