import { DarkColorHandler } from 'roosterjs-content-model-types';
import { getColor, setColor } from '../../../lib/formatHandlers/utils/color';
import { itChromeOnly } from 'roosterjs-editor-dom/test/DomTestHelper';

describe('getColor with darkColorHandler', () => {
    it('getColor from no color, light mode', () => {
        const parseColorValue = jasmine.createSpy().and.returnValue({
            lightModeColor: 'green',
        });
        const darkColorHandler = ({ parseColorValue } as any) as DarkColorHandler;
        const div = document.createElement('div');
        const color = getColor(div, false, false, darkColorHandler);

        expect(color).toBe('green');
        expect(parseColorValue).toHaveBeenCalledTimes(1);
        expect(parseColorValue).toHaveBeenCalledWith(undefined, false);
    });

    it('getColor from no color, dark mode', () => {
        const parseColorValue = jasmine.createSpy().and.returnValue({
            lightModeColor: 'green',
        });
        const darkColorHandler = ({ parseColorValue } as any) as DarkColorHandler;
        const div = document.createElement('div');
        const color = getColor(div, false, true, darkColorHandler);

        expect(color).toBe('green');
        expect(parseColorValue).toHaveBeenCalledTimes(1);
        expect(parseColorValue).toHaveBeenCalledWith(undefined, true);
    });

    it('getColor from style color, dark mode', () => {
        const parseColorValue = jasmine.createSpy().and.returnValue({
            lightModeColor: 'green',
        });
        const darkColorHandler = ({ parseColorValue } as any) as DarkColorHandler;
        const div = document.createElement('div');

        div.style.color = 'red';
        div.setAttribute('color', 'blue');
        const color = getColor(div, false, true, darkColorHandler);

        expect(color).toBe('green');
        expect(parseColorValue).toHaveBeenCalledTimes(1);
        expect(parseColorValue).toHaveBeenCalledWith('red', true);
    });

    it('getColor from attr color, dark mode', () => {
        const parseColorValue = jasmine.createSpy().and.returnValue({
            lightModeColor: 'green',
        });
        const darkColorHandler = ({ parseColorValue } as any) as DarkColorHandler;
        const div = document.createElement('div');

        div.setAttribute('color', 'blue');
        const color = getColor(div, false, true, darkColorHandler);

        expect(color).toBe('green');
        expect(parseColorValue).toHaveBeenCalledTimes(1);
        expect(parseColorValue).toHaveBeenCalledWith('blue', true);
    });

    it('getColor from attr color with var, dark mode', () => {
        const parseColorValue = jasmine.createSpy().and.returnValue({
            lightModeColor: 'green',
        });
        const darkColorHandler = ({ parseColorValue } as any) as DarkColorHandler;
        const div = document.createElement('div');

        div.style.color = 'var(--varName, blue)';
        const color = getColor(div, false, true, darkColorHandler);

        expect(color).toBe('green');
        expect(parseColorValue).toHaveBeenCalledTimes(1);
        expect(parseColorValue).toHaveBeenCalledWith('var(--varName, blue)', true);
    });

    it('getColor from style color with data-ogsc, dark mode', () => {
        const parseColorValue = jasmine.createSpy().and.returnValue({
            lightModeColor: 'green',
        });
        const darkColorHandler = ({ parseColorValue } as any) as DarkColorHandler;
        const div = document.createElement('div');

        div.dataset.ogsc = 'yellow';
        div.style.color = 'red';
        const color = getColor(div, false, true, darkColorHandler);

        expect(color).toBe('green');
        expect(parseColorValue).toHaveBeenCalledTimes(1);
        expect(parseColorValue).toHaveBeenCalledWith('red', true);
    });
});

describe('setColor with darkColorHandler', () => {
    it('setColor from no color, light mode', () => {
        const registerColor = jasmine.createSpy().and.returnValue('green');
        const darkColorHandler = ({ registerColor } as any) as DarkColorHandler;
        const div = document.createElement('div');
        setColor(div, '', false, false, darkColorHandler);

        expect(div.outerHTML).toBe('<div style="color: green;"></div>');
        expect(registerColor).toHaveBeenCalledTimes(1);
        expect(registerColor).toHaveBeenCalledWith('', false);
    });

    it('setColor from no color, dark mode', () => {
        const registerColor = jasmine.createSpy().and.returnValue('green');
        const darkColorHandler = ({ registerColor } as any) as DarkColorHandler;
        const div = document.createElement('div');
        setColor(div, '', false, true, darkColorHandler);

        expect(div.outerHTML).toBe('<div style="color: green;"></div>');
        expect(registerColor).toHaveBeenCalledTimes(1);
        expect(registerColor).toHaveBeenCalledWith('', true);
    });

    it('setColor from a valid color, light mode, no darkColorHandler', () => {
        const div = document.createElement('div');
        setColor(div, 'green', false, false);

        expect(div.outerHTML).toBe('<div style="color: green;"></div>');
    });

    itChromeOnly('setColor from a color with existing color, dark mode', () => {
        const registerColor = jasmine.createSpy().and.returnValue('green');
        const darkColorHandler = ({ registerColor } as any) as DarkColorHandler;
        const div = document.createElement('div');

        div.style.color = 'blue';
        div.setAttribute('color', 'yellow');
        setColor(div, 'red', false, true, darkColorHandler);

        expect(div.outerHTML).toBe('<div color="yellow" style="color: green;"></div>');
        expect(registerColor).toHaveBeenCalledTimes(1);
        expect(registerColor).toHaveBeenCalledWith('red', true);
    });
});
