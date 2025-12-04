import { createDarkColorHandler } from 'roosterjs-content-model-core/lib/editor/core/DarkColorHandlerImpl';
import { transformColor } from '../../../lib/domUtils/style/transformColor';

describe('transform to dark mode', () => {
    let div: HTMLDivElement;

    beforeEach(() => {
        div = document.createElement('div');
    });

    function runTest(element: HTMLElement, expectedHtml: string, expectedContainerHtml: string) {
        const colorManager = createDarkColorHandler(div, color => {
            return color == 'red' ? 'blue' : color == 'green' ? 'yellow' : '';
        });

        transformColor(element, true, 'lightToDark', colorManager);

        expect(element.outerHTML).toBe(expectedHtml, 'element html');
        expect(div.outerHTML).toBe(expectedContainerHtml, 'container html');
    }

    it('no color', () => {
        const element = document.createElement('div');

        runTest(element, '<div></div>', '<div></div>');
    });

    it('has style colors', () => {
        const element = document.createElement('div');
        element.style.color = 'red';
        element.style.backgroundColor = 'green';

        runTest(
            element,
            '<div style="color: var(--darkColor_red, red); background-color: var(--darkColor_green, green);"></div>',
            '<div style="--darkColor_red: blue; --darkColor_green: yellow;"></div>'
        );
    });

    it('has attribute colors', () => {
        const element = document.createElement('div');
        element.setAttribute('color', 'red');
        element.setAttribute('bgcolor', 'green');

        runTest(
            element,
            '<div style="color: var(--darkColor_red, red); background-color: var(--darkColor_green, green);"></div>',
            '<div style="--darkColor_red: blue; --darkColor_green: yellow;"></div>'
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
            '<div style="color: var(--darkColor_red, red); background-color: var(--darkColor_green, green);"></div>',
            '<div style="--darkColor_red: blue; --darkColor_green: yellow;"></div>'
        );
    });

    it('has border colors on div (should not transform)', () => {
        const element = document.createElement('div');
        element.style.borderTop = '1px solid red';
        element.style.borderRight = '2px dashed green';

        runTest(
            element,
            '<div style="border-top: 1px solid red; border-right: 2px dashed green;"></div>',
            '<div></div>'
        );
    });

    it('has all border colors on div (should not transform)', () => {
        const element = document.createElement('div');
        element.style.borderTop = '1px solid red';
        element.style.borderRight = '1px solid green';
        element.style.borderBottom = '1px solid red';
        element.style.borderLeft = '1px solid green';

        runTest(
            element,
            '<div style="border-width: 1px; border-style: solid; border-color: red green;"></div>',
            '<div></div>'
        );
    });

    it('has text, background and border colors on div (border should not transform)', () => {
        const element = document.createElement('div');
        element.style.color = 'red';
        element.style.backgroundColor = 'green';
        element.style.borderTop = '1px solid red';
        element.style.borderBottom = '2px dashed green';

        runTest(
            element,
            '<div style="color: var(--darkColor_red, red); background-color: var(--darkColor_green, green); border-top: 1px solid red; border-bottom: 2px dashed green;"></div>',
            '<div style="--darkColor_red: blue; --darkColor_green: yellow;"></div>'
        );
    });

    it('has border colors on td with tableBorders true', () => {
        const element = document.createElement('td');
        element.style.borderTop = '1px solid red';
        element.style.borderRight = '2px dashed green';

        const colorManager = createDarkColorHandler(div, color => {
            return color == 'red' ? 'blue' : color == 'green' ? 'yellow' : '';
        });

        transformColor(element, true, 'lightToDark', colorManager, { tableBorders: true });

        expect(element.outerHTML).toBe(
            '<td style="border-top: 1px solid var(--darkColor_red, red); border-right: 2px dashed var(--darkColor_green, green);"></td>'
        );
        expect(div.outerHTML).toBe(
            '<div style="--darkColor_red: blue; --darkColor_green: yellow;"></div>'
        );
    });

    it('has border colors on th with tableBorders true', () => {
        const element = document.createElement('th');
        element.style.borderTop = '1px solid red';
        element.style.borderRight = '1px solid green';
        element.style.borderBottom = '1px solid red';
        element.style.borderLeft = '1px solid green';

        const colorManager = createDarkColorHandler(div, color => {
            return color == 'red' ? 'blue' : color == 'green' ? 'yellow' : '';
        });

        transformColor(element, true, 'lightToDark', colorManager, { tableBorders: true });

        expect(element.outerHTML).toBe(
            '<th style="border-top: 1px solid var(--darkColor_red, red); border-right: 1px solid var(--darkColor_green, green); border-bottom: 1px solid var(--darkColor_red, red); border-left: 1px solid var(--darkColor_green, green);"></th>'
        );
        expect(div.outerHTML).toBe(
            '<div style="--darkColor_red: blue; --darkColor_green: yellow;"></div>'
        );
    });
});

describe('transform to light mode', () => {
    let div: HTMLDivElement;

    beforeEach(() => {
        div = document.createElement('div');
    });

    function runTest(element: HTMLElement, expectedHtml: string, expectedContainerHtml: string) {
        const colorManager = createDarkColorHandler(div, color => color, {
            red: {
                lightModeColor: '#0000ff',
                darkModeColor: '#ff0000',
            },
            green: {
                lightModeColor: '#ffff00',
                darkModeColor: '#00ff00',
            },
        });

        transformColor(element, true /*includeSelf*/, 'darkToLight', colorManager);

        expect(element.outerHTML).toBe(expectedHtml, 'element html');
        expect(div.outerHTML).toBe(expectedContainerHtml, 'container html');
    }

    it('no color', () => {
        const element = document.createElement('div');

        runTest(element, '<div></div>', '<div></div>');
    });

    it('has style colors', () => {
        const element = document.createElement('div');
        element.style.color = '#ff0000';
        element.style.backgroundColor = '#00ff00';

        runTest(
            element,
            '<div style="color: rgb(0, 0, 255); background-color: rgb(255, 255, 0);"></div>',
            '<div></div>'
        );
    });

    it('has attribute colors', () => {
        const element = document.createElement('div');
        element.setAttribute('color', '#ff0000');
        element.setAttribute('bgcolor', '#00ff00');

        runTest(
            element,
            '<div style="color: rgb(0, 0, 255); background-color: rgb(255, 255, 0);"></div>',
            '<div></div>'
        );
    });

    it('has both css and attribute colors', () => {
        const element = document.createElement('div');
        element.style.color = '#ff0000';
        element.style.backgroundColor = '#00ff00';
        element.setAttribute('color', '#888888');
        element.setAttribute('bgcolor', '#444444');

        runTest(
            element,
            '<div style="color: rgb(0, 0, 255); background-color: rgb(255, 255, 0);"></div>',
            '<div></div>'
        );
    });

    it('has border colors on div (should not transform)', () => {
        const element = document.createElement('div');
        element.style.borderTop = '1px solid #ff0000';
        element.style.borderRight = '2px dashed #00ff00';

        runTest(
            element,
            '<div style="border-top: 1px solid rgb(255, 0, 0); border-right: 2px dashed rgb(0, 255, 0);"></div>',
            '<div></div>'
        );
    });

    it('has all border colors on div (should not transform)', () => {
        const element = document.createElement('div');
        element.style.borderTop = '1px solid #ff0000';
        element.style.borderRight = '1px solid #00ff00';
        element.style.borderBottom = '1px solid #ff0000';
        element.style.borderLeft = '1px solid #00ff00';

        runTest(
            element,
            '<div style="border-width: 1px; border-style: solid; border-color: rgb(255, 0, 0) rgb(0, 255, 0);"></div>',
            '<div></div>'
        );
    });

    it('has text, background and border colors on div (border should not transform)', () => {
        const element = document.createElement('div');
        element.style.color = '#ff0000';
        element.style.backgroundColor = '#00ff00';
        element.style.borderTop = '1px solid #ff0000';
        element.style.borderBottom = '2px dashed #00ff00';

        runTest(
            element,
            '<div style="color: rgb(0, 0, 255); background-color: rgb(255, 255, 0); border-top: 1px solid rgb(255, 0, 0); border-bottom: 2px dashed rgb(0, 255, 0);"></div>',
            '<div></div>'
        );
    });

    it('has border colors on td with tableBorders true', () => {
        const element = document.createElement('td');
        element.style.borderTop = '1px solid #ff0000';
        element.style.borderRight = '2px dashed #00ff00';

        const colorManager = createDarkColorHandler(div, color => color, {
            red: {
                lightModeColor: '#0000ff',
                darkModeColor: '#ff0000',
            },
            green: {
                lightModeColor: '#ffff00',
                darkModeColor: '#00ff00',
            },
        });

        transformColor(element, true /*includeSelf*/, 'darkToLight', colorManager, {
            tableBorders: true,
        });

        expect(element.outerHTML).toBe(
            '<td style="border-top: 1px solid rgb(0, 0, 255); border-right: 2px dashed rgb(255, 255, 0);"></td>'
        );
        expect(div.outerHTML).toBe('<div></div>');
    });

    it('has border colors on th with tableBorders true', () => {
        const element = document.createElement('th');
        element.style.borderTop = '1px solid #ff0000';
        element.style.borderRight = '1px solid #00ff00';
        element.style.borderBottom = '1px solid #ff0000';
        element.style.borderLeft = '1px solid #00ff00';

        const colorManager = createDarkColorHandler(div, color => color, {
            red: {
                lightModeColor: '#0000ff',
                darkModeColor: '#ff0000',
            },
            green: {
                lightModeColor: '#ffff00',
                darkModeColor: '#00ff00',
            },
        });

        transformColor(element, true /*includeSelf*/, 'darkToLight', colorManager, {
            tableBorders: true,
        });

        expect(element.outerHTML).toBe(
            '<th style="border-width: 1px; border-style: solid; border-color: rgb(0, 0, 255) rgb(255, 255, 0);"></th>'
        );
        expect(div.outerHTML).toBe('<div></div>');
    });
});
