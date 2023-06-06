import createEditorCore from './createMockEditorCore';
import { ColorTransformDirection, DarkColorHandler } from 'roosterjs-editor-types';
import { getDarkColor } from 'roosterjs-color-utils';
import { itChromeOnly } from '../TestHelper';
import { transformColor } from '../../lib/coreApi/transformColor';

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
        expectedParseValueCalls: (string | null)[],
        expectedRegisterColorCalls: [string, boolean, string][],
        excludedElements: HTMLElement[] = []
    ) {
        const core = createEditorCore(div, {
            inDarkMode: false,
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

        const getExcludedElementsFromTransform = jasmine
            .createSpy('getExcludedElementsFromTransform')
            .and.returnValue(excludedElements);

        core.darkColorHandler = ({ parseColorValue, registerColor } as any) as DarkColorHandler;

        transformColor(
            core,
            element,
            true,
            null,
            getExcludedElementsFromTransform,
            ColorTransformDirection.LightToDark,
            true
        );

        expect(element.outerHTML).toBe(expectedHtml);
        expect(parseColorValue).toHaveBeenCalledTimes(expectedParseValueCalls.length);
        expect(registerColor).toHaveBeenCalledTimes(expectedRegisterColorCalls.length);
        expect(getExcludedElementsFromTransform).toHaveBeenCalledTimes(1);

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
            '<div style="color: blue; background-color: yellow;"></div>',
            ['red', 'green'],
            [
                ['blue', true, undefined!],
                ['yellow', true, undefined!],
            ]
        );
    });

    it('should skip excluded elements', () => {
        const element = document.createElement('div');
        const excludedElement = document.createElement('div');
        excludedElement.style.color = 'red';
        excludedElement.style.backgroundColor = 'green';

        element.appendChild(excludedElement);

        runTest(
            element,
            '<div><div style="color: red; background-color: green;"></div></div>',
            [null, null],
            [],
            [excludedElement]
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
            '<div style="color: blue; background-color: yellow;"></div>',
            ['red', 'green'],
            [
                ['blue', true, undefined!],
                ['yellow', true, undefined!],
            ]
        );
    });
});

describe('transform to light mode v2', () => {
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
        expectedParseValueCalls: (string | null)[],
        expectedRegisterColorCalls: [string, boolean, string][],
        excludedElements: HTMLElement[] = []
    ) {
        const core = createEditorCore(div, {
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
        const getExcludedElementsFromTransform = jasmine
            .createSpy('getExcludedElementsFromTransform')
            .and.returnValue(excludedElements);

        core.darkColorHandler = ({ parseColorValue, registerColor } as any) as DarkColorHandler;

        transformColor(
            core,
            element,
            true /*includeSelf*/,
            null /*callback*/,
            getExcludedElementsFromTransform,
            ColorTransformDirection.DarkToLight,
            true /*forceTransform*/,
            true /*fromDark*/
        );

        expect(element.outerHTML).toBe(expectedHtml);
        expect(parseColorValue).toHaveBeenCalledTimes(expectedParseValueCalls.length);
        expect(registerColor).toHaveBeenCalledTimes(expectedRegisterColorCalls.length);
        expect(getExcludedElementsFromTransform).toHaveBeenCalledTimes(1);

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
            '<div style="color: blue; background-color: yellow;"></div>',
            ['red', 'green'],
            [
                ['blue', false, undefined!],
                ['yellow', false, undefined!],
            ]
        );
    });

    it('should skip excluded elements', () => {
        const element = document.createElement('div');
        const excludedElement = document.createElement('div');
        excludedElement.style.color = 'red';
        excludedElement.style.backgroundColor = 'green';

        element.appendChild(excludedElement);

        runTest(
            element,
            '<div><div style="color: red; background-color: green;"></div></div>',
            [null, null],
            [],
            [excludedElement]
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
            '<div style="color: blue; background-color: yellow;"></div>',
            ['red', 'green'],
            [
                ['blue', false, undefined!],
                ['yellow', false, undefined!],
            ]
        );
    });
});
