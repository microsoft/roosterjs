import createEditorCore from './createMockEditorCore';
import { ColorTransformDirection, DarkColorHandler } from 'roosterjs-editor-types';
import { getDarkColor } from 'roosterjs-color-utils';
import { itChromeOnly, itFirefoxOnly } from '../TestHelper';
import { transformColor } from '../../lib/coreApi/transformColor';

describe('transformColor Dark to light', () => {
    let div: HTMLDivElement;
    beforeEach(() => {
        div = document.createElement('div');
        document.body.appendChild(div);
    });

    afterEach(() => {
        document.body.removeChild(div);
        div = null;
    });

    it('null input', () => {
        const core = createEditorCore(div, {});
        transformColor(core, null, true, null, ColorTransformDirection.DarkToLight);
        expect();
    });

    it('light mode, no need to transform', () => {
        const core = createEditorCore(div, { inDarkMode: false });
        const element = document.createElement('div');
        element.dataset.ogsc = '#123456';
        transformColor(core, element, true, null, ColorTransformDirection.DarkToLight);
        expect(element.outerHTML).toBe('<div data-ogsc="#123456"></div>');
    });

    it('light mode still need to transform when force transform', () => {
        const core = createEditorCore(div, { inDarkMode: false });
        const element = document.createElement('div');
        element.dataset.ogsc = '#123456';
        transformColor(core, element, true, null, ColorTransformDirection.DarkToLight, true);
        expect(element.outerHTML).toBe('<div style="color: rgb(18, 52, 86);"></div>');
    });

    it('callback must be called', () => {
        const core = createEditorCore(div, { inDarkMode: false });
        const callback = jasmine.createSpy('callback');
        transformColor(core, null, true, callback, ColorTransformDirection.DarkToLight);
        expect(callback).toHaveBeenCalled();
    });

    it('no dataset, no style, no attr', () => {
        const core = createEditorCore(div, { inDarkMode: true });
        const element = document.createElement('div');
        transformColor(core, element, true, null, ColorTransformDirection.DarkToLight);
        expect(element.outerHTML).toBe('<div></div>');
    });

    it('no dataset, no style, has attr', () => {
        const core = createEditorCore(div, { inDarkMode: true });
        const element = document.createElement('div');
        element.setAttribute('color', 'red');
        transformColor(core, element, true, null, ColorTransformDirection.DarkToLight);
        expect(element.outerHTML).toBe('<div></div>');
    });

    it('no dataset, has style, no attr', () => {
        const core = createEditorCore(div, { inDarkMode: true });
        const element = document.createElement('div');
        element.style.color = 'red';
        transformColor(core, element, true, null, ColorTransformDirection.DarkToLight);
        expect(element.outerHTML).toBe('<div style=""></div>');
    });

    it('has dataset, no style, no attr', () => {
        const core = createEditorCore(div, { inDarkMode: true });
        const element = document.createElement('div');
        element.dataset.ogsc = 'red';
        transformColor(core, element, true, null, ColorTransformDirection.DarkToLight);
        expect(element.outerHTML).toBe('<div style="color: red;"></div>');
    });

    it('has dataset, has style, no attr', () => {
        const core = createEditorCore(div, { inDarkMode: true });
        const element = document.createElement('div');
        element.dataset.ogsc = 'red';
        element.style.color = 'black';
        transformColor(core, element, true, null, ColorTransformDirection.DarkToLight);
        expect(element.outerHTML).toBe('<div style="color: red;"></div>');
    });

    it('has dataset, no style, has attr', () => {
        const core = createEditorCore(div, { inDarkMode: true });
        const element = document.createElement('div');
        element.dataset.ogsc = 'red';
        element.setAttribute('color', 'black');
        transformColor(core, element, true, null, ColorTransformDirection.DarkToLight);
        expect(element.outerHTML).toBe('<div style="color: red;"></div>');
    });

    it('has dataset, has style, has attr', () => {
        const core = createEditorCore(div, { inDarkMode: true });
        const element = document.createElement('div');
        element.dataset.ogsc = 'red';
        element.setAttribute('color', 'black');
        element.style.color = 'green';
        transformColor(core, element, true, null, ColorTransformDirection.DarkToLight);
        expect(element.outerHTML).toBe('<div style="color: red;"></div>');
    });

    it('has dataset for ogsc and ogac, has style, has attr', () => {
        const core = createEditorCore(div, { inDarkMode: true });
        const element = document.createElement('div');
        element.dataset.ogsc = 'red';
        element.dataset.ogac = 'yellow';
        element.setAttribute('color', 'black');
        element.style.color = 'green';
        transformColor(core, element, true, null, ColorTransformDirection.DarkToLight);
        expect(element.outerHTML).toBe('<div color="yellow" style="color: red;"></div>');
    });

    it('has dataset for ogsc, ogac, ogsb, ogab, has style, has attr', () => {
        const core = createEditorCore(div, { inDarkMode: true });
        const element = document.createElement('div');
        element.dataset.ogsc = 'red';
        element.dataset.ogac = 'yellow';
        element.dataset.ogsb = 'blue';
        element.dataset.ogab = 'gray';
        element.setAttribute('color', 'black');
        element.setAttribute('bgcolor', '#012345');
        element.style.color = 'green';
        element.style.backgroundColor = '#654321';
        transformColor(core, element, true, null, ColorTransformDirection.DarkToLight);
        expect(element.outerHTML).toBe(
            '<div color="yellow" bgcolor="gray" style="color: red; background-color: blue;"></div>'
        );
    });

    it('do not include self', () => {
        const core = createEditorCore(div, { inDarkMode: true });
        const element = document.createElement('div');
        element.dataset.ogsc = 'red';
        const child = document.createElement('div');
        child.dataset.ogsc = 'green';
        element.appendChild(child);
        transformColor(core, element, false, null, ColorTransformDirection.DarkToLight);
        expect(element.outerHTML).toBe(
            '<div data-ogsc="red"><div style="color: green;"></div></div>'
        );
    });
});

describe('transformColor Light to dark', () => {
    let div: HTMLDivElement;
    beforeEach(() => {
        div = document.createElement('div');
        document.body.appendChild(div);
    });

    afterEach(() => {
        document.body.removeChild(div);
        div = null;
    });

    it('null input', () => {
        const core = createEditorCore(div, { inDarkMode: true });
        transformColor(core, null, true, null, ColorTransformDirection.LightToDark);
        expect();
    });

    it('light mode, no need to transform', () => {
        const core = createEditorCore(div, { inDarkMode: false });
        const element = document.createElement('div');
        element.style.color = 'rgb(18, 52, 86)';
        transformColor(core, element, true, null, ColorTransformDirection.LightToDark);
        expect(element.outerHTML).toBe('<div style="color: rgb(18, 52, 86);"></div>');
    });

    it('light mode still need to transform when force transform', () => {
        const core = createEditorCore(div, { inDarkMode: false });
        const element = document.createElement('div');
        element.style.color = 'rgb(18, 52, 86)';
        transformColor(core, element, true, null, ColorTransformDirection.LightToDark, true);
        expect(element.outerHTML).toBe(
            '<div style="color: rgb(18, 52, 86) !important;" data-ogsc="rgb(18, 52, 86)"></div>'
        );
    });

    it('single element, no transform function', () => {
        const core = createEditorCore(div, { inDarkMode: true });
        const element = document.createElement('div');
        transformColor(core, element, true, null, ColorTransformDirection.LightToDark);
        expect(element.outerHTML).toBe('<div></div>');
    });

    it('single element with color and background color, no transform function', () => {
        const core = createEditorCore(div, { inDarkMode: true, getDarkColor });
        const element = document.createElement('div');
        element.style.color = 'red';
        element.style.backgroundColor = 'green';
        transformColor(core, element, true, null, ColorTransformDirection.LightToDark);
        expect(element.outerHTML).toBe(
            '<div style="color: rgb(255, 39, 17) !important; background-color: rgb(74, 175, 57) !important;" data-ogsc="red" data-ogsb="green"></div>'
        );
    });

    itFirefoxOnly('single element with color and background color, has transform function', () => {
        const core = createEditorCore(div, {
            inDarkMode: true,
            onExternalContentTransform: element => {
                element.dataset.ogsc = element.style.color;
                element.dataset.ogsb = element.style.backgroundColor;
                element.style.color = 'white';
                element.style.backgroundColor = 'black';
            },
        });
        const element = document.createElement('div');
        element.style.color = 'red';
        element.style.backgroundColor = 'green';
        transformColor(core, element, true, null, ColorTransformDirection.LightToDark);
        expect(element.outerHTML).toBe(
            '<div style="color: white; background-color: black;" data-ogsc="red" data-ogsb="green"></div>'
        );
    });

    it('single element with inherit color', () => {
        const core = createEditorCore(div, { inDarkMode: true, getDarkColor });
        const element = document.createElement('div');
        element.style.color = 'inherit';
        element.style.backgroundColor = 'inherit';
        transformColor(core, element, true, null, ColorTransformDirection.LightToDark);
        expect(element.outerHTML).toBe(
            '<div style="color: inherit; background-color: inherit;"></div>'
        );
    });
});

describe('transform to dark mode v2', () => {
    let div: HTMLDivElement;

    beforeEach(() => {
        div = document.createElement('div');
        document.body.appendChild(div);
    });

    afterEach(() => {
        document.body.removeChild(div);
        div = null;
    });

    function runTest(
        element: HTMLElement,
        expectedHtml: string,
        expectedParseValueCalls: string[],
        expectedRegisterColorCalls: [string, boolean, string][]
    ) {
        const core = createEditorCore(div, {
            inDarkMode: true,
            getDarkColor,
        });
        const parseColorValue = jasmine
            .createSpy('parseColorValue')
            .and.callFake((color: string) => ({
                lightModeColor: color == 'red' ? 'blue' : color == 'green' ? 'yellow' : '',
            }));
        const registerColor = jasmine
            .createSpy('registerColor')
            .and.callFake((color: string) => color);

        core.darkColorHandler = ({ parseColorValue, registerColor } as any) as DarkColorHandler;

        transformColor(core, element, true, null, ColorTransformDirection.LightToDark);

        expect(element.outerHTML).toBe(expectedHtml);
        expect(parseColorValue).toHaveBeenCalledTimes(expectedParseValueCalls.length);
        expect(registerColor).toHaveBeenCalledTimes(expectedRegisterColorCalls.length);

        expectedParseValueCalls.forEach(v => {
            expect(parseColorValue).toHaveBeenCalledWith(v);
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
                ['blue', true, undefined!],
                ['yellow', true, undefined!],
            ]
        );
    });

    it('has attribute colors', () => {
        const element = document.createElement('div');
        element.setAttribute('color', 'red');
        element.setAttribute('bgcolor', 'green');

        runTest(
            element,
            '<div color="red" bgcolor="green" style="color: blue; background-color: yellow;"></div>',
            ['red', 'green'],
            [
                ['blue', true, undefined!],
                ['yellow', true, undefined!],
            ]
        );
    });

    itChromeOnly('has both css and attribute colors', () => {
        const element = document.createElement('div');
        element.style.color = 'red';
        element.style.backgroundColor = 'green';
        element.setAttribute('color', 'gray');
        element.setAttribute('bgcolor', 'brown');

        runTest(
            element,
            '<div color="gray" bgcolor="brown" style="color: blue; background-color: yellow;"></div>',
            ['red', 'green'],
            [
                ['blue', true, undefined!],
                ['yellow', true, undefined!],
            ]
        );
    });
});

describe('transform to lgiht mode v2', () => {
    let div: HTMLDivElement;

    beforeEach(() => {
        div = document.createElement('div');
        document.body.appendChild(div);
    });

    afterEach(() => {
        document.body.removeChild(div);
        div = null;
    });

    function runTest(
        element: HTMLElement,
        expectedHtml: string,
        expectedParseValueCalls: string[],
        expectedRegisterColorCalls: [string, boolean, string][]
    ) {
        const core = createEditorCore(div, {
            inDarkMode: true,
            getDarkColor,
        });
        const parseColorValue = jasmine
            .createSpy('parseColorValue')
            .and.callFake((color: string) => ({
                lightModeColor: color == 'red' ? 'blue' : color == 'green' ? 'yellow' : '',
            }));
        const registerColor = jasmine
            .createSpy('registerColor')
            .and.callFake((color: string) => color);

        core.darkColorHandler = ({ parseColorValue, registerColor } as any) as DarkColorHandler;

        transformColor(core, element, true, null, ColorTransformDirection.DarkToLight);

        expect(element.outerHTML).toBe(expectedHtml);
        expect(parseColorValue).toHaveBeenCalledTimes(expectedParseValueCalls.length);
        expect(registerColor).toHaveBeenCalledTimes(expectedRegisterColorCalls.length);

        expectedParseValueCalls.forEach(v => {
            expect(parseColorValue).toHaveBeenCalledWith(v);
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
                ['blue', false, undefined!],
                ['yellow', false, undefined!],
            ]
        );
    });

    it('has attribute colors', () => {
        const element = document.createElement('div');
        element.setAttribute('color', 'red');
        element.setAttribute('bgcolor', 'green');

        runTest(
            element,
            '<div color="red" bgcolor="green" style="color: blue; background-color: yellow;"></div>',
            ['red', 'green'],
            [
                ['blue', false, undefined!],
                ['yellow', false, undefined!],
            ]
        );
    });

    itChromeOnly('has both css and attribute colors', () => {
        const element = document.createElement('div');
        element.style.color = 'red';
        element.style.backgroundColor = 'green';
        element.setAttribute('color', 'gray');
        element.setAttribute('bgcolor', 'brown');

        runTest(
            element,
            '<div color="gray" bgcolor="brown" style="color: blue; background-color: yellow;"></div>',
            ['red', 'green'],
            [
                ['blue', false, undefined!],
                ['yellow', false, undefined!],
            ]
        );
    });
});
