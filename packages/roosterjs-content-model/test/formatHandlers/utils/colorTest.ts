import { DarkColorHandler } from 'roosterjs-editor-types';
import { getColor, setColor } from '../../../lib/formatHandlers/utils/color';
import { itChromeOnly } from 'roosterjs-editor-dom/test/DomTestHelper';

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
