import adaptFontColorToBackgroundColor from '../../lib/utils/adaptFontColorToBackgroundColor';

describe('adaptFontColorToBackgroundColor', () => {
    function runTest(background: string, expectedFont: string) {
        const div = document.createElement('div');
        document.body.appendChild(div);
        adaptFontColorToBackgroundColor(div, background);
        expect(div.style.color).toBe(expectedFont);
        document.body.removeChild(div);
    }

    function testDivWithChild(background: string, expectedFont: string) {
        const div = document.createElement('div');
        document.body.appendChild(div);
        const span = document.createElement('span');
        span.style.color = 'red';
        div.appendChild(span);
        adaptFontColorToBackgroundColor(div, background);
        expect(div.style.color).toBe(expectedFont);
        document.body.removeChild(div);
    }

    it('should change font color to white with HEX', () => {
        runTest('#000000', 'rgb(255, 255, 255)');
    });

    it('should change font color to white with rgb', () => {
        runTest('rgb(0, 0, 0)', 'rgb(255, 255, 255)');
    });

    it('should change font color to white with rgba', () => {
        runTest('rgba(0, 0, 0, 0)', 'rgb(255, 255, 255)');
    });

    it('should change font color to black with HEX', () => {
        runTest('#ffffff', 'rgb(0, 0, 0)');
    });

    it('should change font color to black with rgb', () => {
        runTest('rgb(255, 255, 255)', 'rgb(0, 0, 0)');
    });

    it('should change font color to black with rgba', () => {
        runTest('rgba(255, 255, 255, 0)', 'rgb(0, 0, 0)');
    });

    it('should not change font color, if theres a child element with style', () => {
        testDivWithChild('rgba(255, 255, 255, 0)', '');
    });

    it('should not change font color ', () => {
        runTest('transparent', '');
    });

    it('should change font color to white using literal black ', () => {
        runTest('black', 'rgb(255, 255, 255)');
    });

    it('should change font color to black using literal --ms-color-white ', () => {
        runTest('--ms-color-white', 'rgb(0, 0, 0)');
    });
});
