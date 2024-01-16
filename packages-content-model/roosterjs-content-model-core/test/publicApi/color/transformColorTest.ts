import { DarkColorHandlerImpl } from '../../../lib/editor/DarkColorHandlerImpl';
import { getDarkColor } from 'roosterjs-color-utils';
import { transformColor } from '../../../lib/publicApi/color/transformColor';

describe('transform to dark mode', () => {
    let div: HTMLDivElement;

    beforeEach(() => {
        div = document.createElement('div');
    });

    function runTest(
        element: HTMLElement,
        expectedHtml: string,
        expectedParseValueCalls: string[],
        expectedRegisterColorCalls: [string, boolean][]
    ) {
        const handler = new DarkColorHandlerImpl(div, getDarkColor);

        const parseColorValue = spyOn(handler, 'parseColorValue').and.callFake((color: string) => ({
            lightModeColor: color == 'red' ? 'blue' : color == 'green' ? 'yellow' : '',
        }));
        const registerColor = spyOn(handler, 'registerColor').and.callFake(
            (color: string) => color
        );

        transformColor(element, true, 'lightToDark', handler);

        expect(element.outerHTML).toBe(expectedHtml);
        expect(parseColorValue).toHaveBeenCalledTimes(expectedParseValueCalls.length);
        expect(registerColor).toHaveBeenCalledTimes(expectedRegisterColorCalls.length);

        expectedParseValueCalls.forEach(v => {
            expect(parseColorValue).toHaveBeenCalledWith(v, false);
        });
        expectedRegisterColorCalls.forEach(v => {
            expect(registerColor).toHaveBeenCalledWith(...v);
        });
    }

    it('no color', () => {
        const element = document.createElement('div');

        runTest(element, '<div></div>', [null!, null!], []);
    });

    it('has style colors', () => {
        const element = document.createElement('div');
        element.style.color = 'red';
        element.style.backgroundColor = 'green';

        runTest(
            element,
            '<div style="color: blue; background-color: yellow;"></div>',
            ['red', 'green'],
            [
                ['blue', true],
                ['yellow', true],
            ]
        );
    });

    it('has attribute colors', () => {
        const element = document.createElement('div');
        element.setAttribute('color', 'red');
        element.setAttribute('bgcolor', 'green');

        runTest(
            element,
            '<div style="color: blue; background-color: yellow;"></div>',
            ['red', 'green'],
            [
                ['blue', true],
                ['yellow', true],
            ]
        );
    });

    it('has both css and attribute colors', () => {
        const element = document.createElement('div');
        element.style.color = 'red';
        element.style.backgroundColor = 'green';
        element.setAttribute('color', 'gray');
        element.setAttribute('bgcolor', 'brown');

        runTest(
            element,
            '<div style="color: blue; background-color: yellow;"></div>',
            ['red', 'green'],
            [
                ['blue', true],
                ['yellow', true],
            ]
        );
    });
});

describe('transform to light mode', () => {
    let div: HTMLDivElement;

    beforeEach(() => {
        div = document.createElement('div');
    });

    function runTest(
        element: HTMLElement,
        expectedHtml: string,
        expectedParseValueCalls: string[],
        expectedRegisterColorCalls: [string, boolean][]
    ) {
        const handler = new DarkColorHandlerImpl(div, getDarkColor);
        const parseColorValue = spyOn(handler, 'parseColorValue').and.callFake((color: string) => ({
            lightModeColor: color == 'red' ? 'blue' : color == 'green' ? 'yellow' : '',
        }));
        const registerColor = spyOn(handler, 'registerColor').and.callFake(
            (color: string) => color
        );

        transformColor(element, true /*includeSelf*/, 'darkToLight', handler);

        expect(element.outerHTML).toBe(expectedHtml);
        expect(parseColorValue).toHaveBeenCalledTimes(expectedParseValueCalls.length);
        expect(registerColor).toHaveBeenCalledTimes(expectedRegisterColorCalls.length);

        expectedParseValueCalls.forEach(v => {
            expect(parseColorValue).toHaveBeenCalledWith(v, true);
        });
        expectedRegisterColorCalls.forEach(v => {
            expect(registerColor).toHaveBeenCalledWith(...v);
        });
    }

    it('no color', () => {
        const element = document.createElement('div');

        runTest(element, '<div></div>', [null!, null!], []);
    });

    it('has style colors', () => {
        const element = document.createElement('div');
        element.style.color = 'red';
        element.style.backgroundColor = 'green';

        runTest(
            element,
            '<div style="color: blue; background-color: yellow;"></div>',
            ['red', 'green'],
            [
                ['blue', false],
                ['yellow', false],
            ]
        );
    });

    it('has attribute colors', () => {
        const element = document.createElement('div');
        element.setAttribute('color', 'red');
        element.setAttribute('bgcolor', 'green');

        runTest(
            element,
            '<div style="color: blue; background-color: yellow;"></div>',
            ['red', 'green'],
            [
                ['blue', false],
                ['yellow', false],
            ]
        );
    });

    it('has both css and attribute colors', () => {
        const element = document.createElement('div');
        element.style.color = 'red';
        element.style.backgroundColor = 'green';
        element.setAttribute('color', 'gray');
        element.setAttribute('bgcolor', 'brown');

        runTest(
            element,
            '<div style="color: blue; background-color: yellow;"></div>',
            ['red', 'green'],
            [
                ['blue', false],
                ['yellow', false],
            ]
        );
    });
});
