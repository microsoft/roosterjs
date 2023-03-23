import { DarkColorHandler } from 'roosterjs-editor-types';
import { getColor, setColor } from '../../../lib/formatHandlers/utils/color';
import { itChromeOnly } from 'roosterjs-editor-dom/test/DomTestHelper';

describe('getColor', () => {
    let div: HTMLElement;

    beforeEach(() => {
        div = document.createElement('div');
    });

    function runTest(
        expectedLightTextColor: string | undefined,
        expectedLightBackColor: string | undefined,
        expectedDarkTextColor: string | undefined,
        expectedDarkBackColor: string | undefined
    ) {
        const lightTextColor = getColor(div, false, null, false);
        const lightBackColor = getColor(div, true, null, false);
        const darkTextColor = getColor(div, false, null, true);
        const darkBackColor = getColor(div, true, null, true);

        expect(lightTextColor).toBe(expectedLightTextColor);
        expect(lightBackColor).toBe(expectedLightBackColor);
        expect(darkTextColor).toBe(expectedDarkTextColor);
        expect(darkBackColor).toBe(expectedDarkBackColor);
    }

    it('no color', () => {
        runTest(undefined, undefined, undefined, undefined);
    });

    it('has CSS color', () => {
        div.style.color = 'red';
        div.style.backgroundColor = 'blue';
        runTest('red', 'blue', 'red', 'blue');
    });

    it('has CSS color', () => {
        div.style.color = 'red';
        div.style.backgroundColor = 'blue';
        runTest('red', 'blue', 'red', 'blue');
    });

    it('has original CSS color', () => {
        div.dataset.ogsc = 'red';
        div.dataset.ogsb = 'blue';
        runTest(undefined, undefined, 'red', 'blue');
    });

    it('has attr color', () => {
        div.setAttribute('color', 'red');
        div.setAttribute('bgcolor', 'blue');
        runTest('red', 'blue', 'red', 'blue');
    });

    it('has original attr color', () => {
        div.dataset.ogac = 'red';
        div.dataset.ogab = 'blue';
        runTest(undefined, undefined, 'red', 'blue');
    });

    it('has both color', () => {
        div.style.color = 'red';
        div.style.backgroundColor = 'blue';
        div.setAttribute('color', 'green');
        div.setAttribute('bgcolor', 'yellow');
        runTest('red', 'blue', 'red', 'blue');
    });

    it('has both color and original color', () => {
        div.style.color = 'red';
        div.style.backgroundColor = 'blue';
        div.setAttribute('color', 'green');
        div.setAttribute('bgcolor', 'yellow');
        div.dataset.ogsc = '#aaa';
        div.dataset.ogsb = '#bbb';
        div.dataset.ogac = '#ccc';
        div.dataset.ogab = '#ddd';
        runTest('red', 'blue', '#aaa', '#bbb');
    });
});

describe('getColor with darkColorHandler', () => {
    it('getColor from no color, light mode', () => {
        const parseColorValue = jasmine.createSpy().and.returnValue({
            lightModeColor: 'green',
        });
        const darkColorHandler = ({ parseColorValue } as any) as DarkColorHandler;
        const div = document.createElement('div');
        const color = getColor(div, false, darkColorHandler, false);

        expect(color).toBe('green');
        expect(parseColorValue).toHaveBeenCalledTimes(1);
        expect(parseColorValue).toHaveBeenCalledWith(undefined);
    });

    it('getColor from no color, dark mode', () => {
        const parseColorValue = jasmine.createSpy().and.returnValue({
            lightModeColor: 'green',
        });
        const darkColorHandler = ({ parseColorValue } as any) as DarkColorHandler;
        const div = document.createElement('div');
        const color = getColor(div, false, darkColorHandler, true);

        expect(color).toBe('green');
        expect(parseColorValue).toHaveBeenCalledTimes(1);
        expect(parseColorValue).toHaveBeenCalledWith(undefined);
    });

    it('getColor from style color, light mode', () => {
        const parseColorValue = jasmine.createSpy().and.returnValue({
            lightModeColor: 'green',
        });
        const darkColorHandler = ({ parseColorValue } as any) as DarkColorHandler;
        const div = document.createElement('div');

        div.style.color = 'red';
        div.setAttribute('color', 'blue');
        const color = getColor(div, false, darkColorHandler, true);

        expect(color).toBe('green');
        expect(parseColorValue).toHaveBeenCalledTimes(1);
        expect(parseColorValue).toHaveBeenCalledWith('red');
    });

    it('getColor from attr color, light mode', () => {
        const parseColorValue = jasmine.createSpy().and.returnValue({
            lightModeColor: 'green',
        });
        const darkColorHandler = ({ parseColorValue } as any) as DarkColorHandler;
        const div = document.createElement('div');

        div.setAttribute('color', 'blue');
        const color = getColor(div, false, darkColorHandler, true);

        expect(color).toBe('green');
        expect(parseColorValue).toHaveBeenCalledTimes(1);
        expect(parseColorValue).toHaveBeenCalledWith('blue');
    });

    it('getColor from attr color with var, light mode', () => {
        const parseColorValue = jasmine.createSpy().and.returnValue({
            lightModeColor: 'green',
        });
        const darkColorHandler = ({ parseColorValue } as any) as DarkColorHandler;
        const div = document.createElement('div');

        div.style.color = 'var(--varName, blue)';
        const color = getColor(div, false, darkColorHandler, true);

        expect(color).toBe('green');
        expect(parseColorValue).toHaveBeenCalledTimes(1);
        expect(parseColorValue).toHaveBeenCalledWith('var(--varName, blue)');
    });

    it('getColor from style color with data-ogsc, light mode', () => {
        const parseColorValue = jasmine.createSpy().and.returnValue({
            lightModeColor: 'green',
        });
        const darkColorHandler = ({ parseColorValue } as any) as DarkColorHandler;
        const div = document.createElement('div');

        div.dataset.ogsc = 'yellow';
        div.style.color = 'red';
        const color = getColor(div, false, darkColorHandler, true);

        expect(color).toBe('green');
        expect(parseColorValue).toHaveBeenCalledTimes(1);
        expect(parseColorValue).toHaveBeenCalledWith('red');
    });

    it('get color from FONT tag in dark mode', () => {
        const parseColorValue = jasmine.createSpy().and.returnValue({
            lightModeColor: 'green',
        });
        const findLightColorFromDarkColor = jasmine.createSpy().and.returnValue('red');
        const darkColorHandler = ({
            parseColorValue,
            findLightColorFromDarkColor,
        } as any) as DarkColorHandler;
        const font = document.createElement('font');

        font.color = '#112233';

        const color = getColor(font, false, darkColorHandler, true);

        expect(color).toBe('green');
        expect(parseColorValue).toHaveBeenCalledTimes(1);
        expect(parseColorValue).toHaveBeenCalledWith('red');
        expect(findLightColorFromDarkColor).toHaveBeenCalledTimes(1);
        expect(findLightColorFromDarkColor).toHaveBeenCalledWith('#112233');
    });
});

describe('setColor', () => {
    function getDarkColor(color: string) {
        // just a fake color
        return `var(--${color})`;
    }

    function runTest(
        textColor: string,
        backColor: string,
        expectedLightHtml: string,
        expectedDarkHtml: string
    ) {
        const lightDiv = document.createElement('div');
        const darkDiv = document.createElement('div');

        setColor(lightDiv, textColor, false, null, false, getDarkColor);
        setColor(lightDiv, backColor, true, null, false, getDarkColor);
        setColor(darkDiv, textColor, false, null, true, getDarkColor);
        setColor(darkDiv, backColor, true, null, true, getDarkColor);

        expect(lightDiv.outerHTML).toBe(expectedLightHtml);
        expect(darkDiv.outerHTML).toBe(expectedDarkHtml);
    }

    it('no color', () => {
        runTest('', '', '<div></div>', '<div></div>');
    });

    itChromeOnly('has color', () => {
        runTest(
            'red',
            'blue',
            '<div style="color: red; background-color: blue;"></div>',
            '<div data-ogsc="red" data-ogsb="blue" style="color: var(--red); background-color: var(--blue);"></div>'
        );
    });
});

describe('setColor with darkColorHandler', () => {
    it('setColor from no color, light mode', () => {
        const registerColor = jasmine.createSpy().and.returnValue('green');
        const darkColorHandler = ({ registerColor } as any) as DarkColorHandler;
        const div = document.createElement('div');
        setColor(div, '', false, darkColorHandler, false);

        expect(div.outerHTML).toBe('<div style="color: green;"></div>');
        expect(registerColor).toHaveBeenCalledTimes(1);
        expect(registerColor).toHaveBeenCalledWith('', false);
    });

    it('setColor from no color, dark mode', () => {
        const registerColor = jasmine.createSpy().and.returnValue('green');
        const darkColorHandler = ({ registerColor } as any) as DarkColorHandler;
        const div = document.createElement('div');
        setColor(div, '', false, darkColorHandler, true);

        expect(div.outerHTML).toBe('<div style="color: green;"></div>');
        expect(registerColor).toHaveBeenCalledTimes(1);
        expect(registerColor).toHaveBeenCalledWith('', true);
    });

    itChromeOnly('setColor from a color with existing color, dark mode', () => {
        const registerColor = jasmine.createSpy().and.returnValue('green');
        const darkColorHandler = ({ registerColor } as any) as DarkColorHandler;
        const div = document.createElement('div');

        div.style.color = 'blue';
        div.setAttribute('color', 'yellow');
        setColor(div, 'red', false, darkColorHandler, true);

        expect(div.outerHTML).toBe('<div color="yellow" style="color: green;"></div>');
        expect(registerColor).toHaveBeenCalledTimes(1);
        expect(registerColor).toHaveBeenCalledWith('red', true);
    });
});
