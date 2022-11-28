import getBiggestZIndex from '../../lib/style/getBiggestZIndex';

describe('getBiggestZIndex', () => {
    function runTest(element: HTMLElement, expected: number) {
        const result = getBiggestZIndex(element);
        expect(result).toBe(expected);
    }

    it('should return parentNode zIndex', () => {
        const div = document.createElement('div');
        div.style.zIndex = '20';
        const span = document.createElement('span');
        span.style.zIndex = '10';
        div.appendChild(span);
        runTest(div, 20);
    });

    it('should return child zIndex', () => {
        const div = document.createElement('div');
        div.style.zIndex = '10';
        const span = document.createElement('span');
        span.style.zIndex = '30';
        div.appendChild(span);
        runTest(div, 30);
    });

    it('should return middle element zIndex', () => {
        const div = document.createElement('div');
        div.style.zIndex = '10';
        const spanParent = document.createElement('div');
        spanParent.style.zIndex = '30';
        div.appendChild(spanParent);
        const span = document.createElement('span');
        span.style.zIndex = '20';
        spanParent.appendChild(span);
        runTest(div, 30);
    });
});
