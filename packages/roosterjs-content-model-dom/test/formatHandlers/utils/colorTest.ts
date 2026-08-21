import { Colors, DarkColorHandler } from 'roosterjs-content-model-types';
import {
    defaultGenerateColorKey,
    getColor,
    getLightModeColor,
    parseColor,
    retrieveElementColor,
    adaptColor,
    setColor,
} from '../../../lib/formatHandlers/utils/color';

describe('getColor without darkColorHandler', () => {
    it('no color', () => {
        const div = document.createElement('div');

        const backLight = getColor(div, true, false);
        const textLight = getColor(div, false, false);
        const backDark = getColor(div, true, true);
        const textDark = getColor(div, false, true);

        expect(backLight).toBeUndefined();
        expect(textLight).toBeUndefined();
        expect(backDark).toBeUndefined();
        expect(textDark).toBeUndefined();
    });

    it('has style color, normal value', () => {
        const div = document.createElement('div');

        div.style.color = 'red';
        div.style.backgroundColor = 'green';

        const backLight = getColor(div, true, false);
        const textLight = getColor(div, false, false);
        const backDark = getColor(div, true, true);
        const textDark = getColor(div, false, true);

        expect(backLight).toBe('green');
        expect(textLight).toBe('red');
        expect(backDark).toBe('green');
        expect(textDark).toBe('red');
    });

    it('has attribute color, normal value', () => {
        const div = document.createElement('div');

        div.setAttribute('color', 'red');
        div.setAttribute('bgcolor', 'green');

        const backLight = getColor(div, true, false);
        const textLight = getColor(div, false, false);
        const backDark = getColor(div, true, true);
        const textDark = getColor(div, false, true);

        expect(backLight).toBe('green');
        expect(textLight).toBe('red');
        expect(backDark).toBe('green');
        expect(textDark).toBe('red');
    });

    it('has both style and attribute color, normal value', () => {
        const div = document.createElement('div');

        div.style.color = 'red';
        div.style.backgroundColor = 'green';
        div.setAttribute('color', 'yellow');
        div.setAttribute('bgcolor', 'gray');

        const backLight = getColor(div, true, false);
        const textLight = getColor(div, false, false);
        const backDark = getColor(div, true, true);
        const textDark = getColor(div, false, true);

        expect(backLight).toBe('green');
        expect(textLight).toBe('red');
        expect(backDark).toBe('green');
        expect(textDark).toBe('red');
    });

    it('has style color, var value', () => {
        const div = document.createElement('div');

        div.style.color = 'var(--test, red)';
        div.style.backgroundColor = 'var(--test, green)';

        const backLight = getColor(div, true, false);
        const textLight = getColor(div, false, false);
        const backDark = getColor(div, true, true);
        const textDark = getColor(div, false, true);

        expect(backLight).toBe('green');
        expect(textLight).toBe('red');
        expect(backDark).toBe('green');
        expect(textDark).toBe('red');
    });

    it('has style color, deprecated value', () => {
        const div = document.createElement('div');

        div.style.color = 'windowtext';
        div.style.backgroundColor = 'window';

        const backLight = getColor(div, true, false);
        const textLight = getColor(div, false, false);
        const backDark = getColor(div, true, true);
        const textDark = getColor(div, false, true);

        expect(backLight).toBeUndefined();
        expect(textLight).toBe('rgb(0, 0, 0)');
        expect(backDark).toBeUndefined();
        expect(textDark).toBe('rgb(0, 0, 0)');
    });
});

describe('getColor with darkColorHandler', () => {
    let knownColors: Record<string, Colors>;
    let getDarkColorSpy: jasmine.Spy;
    let updateKnownColorSpy: jasmine.Spy;
    let darkColorHandler: DarkColorHandler;

    beforeEach(() => {
        knownColors = {};
        getDarkColorSpy = jasmine
            .createSpy('getDarkColor')
            .and.callFake((color: string) => '--dark_' + color);
        updateKnownColorSpy = jasmine.createSpy('updateKnownColor');

        darkColorHandler = {
            knownColors,
            getDarkColor: getDarkColorSpy,
            updateKnownColor: updateKnownColorSpy,
            reset: null!,
            generateColorKey: defaultGenerateColorKey,
        };
    });

    it('no color', () => {
        const div = document.createElement('div');

        const backLight = getColor(div, true, false, darkColorHandler);
        const textLight = getColor(div, false, false, darkColorHandler);
        const backDark = getColor(div, true, true, darkColorHandler);
        const textDark = getColor(div, false, true, darkColorHandler);

        expect(backLight).toBeUndefined();
        expect(textLight).toBeUndefined();
        expect(backDark).toBeUndefined();
        expect(textDark).toBeUndefined();
    });

    it('has style color, normal value, no known dark color', () => {
        const div = document.createElement('div');

        div.style.color = 'rgb(255,0,0)';
        div.style.backgroundColor = 'rgb(0,255,0)';

        const backLight = getColor(div, true, false, darkColorHandler);
        const textLight = getColor(div, false, false, darkColorHandler);
        const backDark = getColor(div, true, true, darkColorHandler);
        const textDark = getColor(div, false, true, darkColorHandler);

        expect(backLight).toBe('rgb(0, 255, 0)');
        expect(textLight).toBe('rgb(255, 0, 0)');
        expect(backDark).toBe('');
        expect(textDark).toBe('');
    });

    it('has style color, normal value, has known dark color', () => {
        const div = document.createElement('div');

        div.style.color = 'rgb(255,0,0)';
        div.style.backgroundColor = 'rgb(0,255,0)';
        knownColors.backColor = {
            lightModeColor: 'rgb(0,0,255)',
            darkModeColor: 'rgb(0,255,0)',
        };
        knownColors.textColor = {
            lightModeColor: 'rgb(255,0,255)',
            darkModeColor: 'rgb(255,0,0)',
        };

        const backLight = getColor(div, true, false, darkColorHandler);
        const textLight = getColor(div, false, false, darkColorHandler);
        const backDark = getColor(div, true, true, darkColorHandler);
        const textDark = getColor(div, false, true, darkColorHandler);

        expect(backLight).toBe('rgb(0, 255, 0)');
        expect(textLight).toBe('rgb(255, 0, 0)');
        expect(backDark).toBe('rgb(0,0,255)');
        expect(textDark).toBe('rgb(255,0,255)');
    });

    it('has attribute color, normal value', () => {
        const div = document.createElement('div');

        div.setAttribute('color', 'rgb(255,0,0)');
        div.setAttribute('bgcolor', 'rgb(0,255,0)');

        knownColors.backColor = {
            lightModeColor: 'rgb(0,0,255)',
            darkModeColor: 'rgb(0,255,0)',
        };
        knownColors.textColor = {
            lightModeColor: 'rgb(255,0,255)',
            darkModeColor: 'rgb(255,0,0)',
        };

        const backLight = getColor(div, true, false, darkColorHandler);
        const textLight = getColor(div, false, false, darkColorHandler);
        const backDark = getColor(div, true, true, darkColorHandler);
        const textDark = getColor(div, false, true, darkColorHandler);

        expect(backLight).toBe('rgb(0,255,0)');
        expect(textLight).toBe('rgb(255,0,0)');
        expect(backDark).toBe('rgb(0,0,255)');
        expect(textDark).toBe('rgb(255,0,255)');
    });

    it('has both style and attribute color, normal value', () => {
        const div = document.createElement('div');

        div.style.color = 'rgb(255,0,0)';
        div.style.backgroundColor = 'rgb(0,255,0)';
        div.setAttribute('color', 'rgb(255,128,0)');
        div.setAttribute('bgcolor', 'rgb(128,255,0)');

        knownColors.backColor = {
            lightModeColor: 'rgb(0,0,255)',
            darkModeColor: 'rgb(0,255,0)',
        };
        knownColors.textColor = {
            lightModeColor: 'rgb(255,0,255)',
            darkModeColor: 'rgb(255,0,0)',
        };

        const backLight = getColor(div, true, false, darkColorHandler);
        const textLight = getColor(div, false, false, darkColorHandler);
        const backDark = getColor(div, true, true, darkColorHandler);
        const textDark = getColor(div, false, true, darkColorHandler);

        expect(backLight).toBe('rgb(0, 255, 0)');
        expect(textLight).toBe('rgb(255, 0, 0)');
        expect(backDark).toBe('rgb(0,0,255)');
        expect(textDark).toBe('rgb(255,0,255)');
    });

    it('has style color, var value', () => {
        const div = document.createElement('div');

        div.style.color = 'var(--test, red)';
        div.style.backgroundColor = 'var(--test, green)';

        const backLight = getColor(div, true, false, darkColorHandler);
        const textLight = getColor(div, false, false, darkColorHandler);
        const backDark = getColor(div, true, true, darkColorHandler);
        const textDark = getColor(div, false, true, darkColorHandler);

        expect(backLight).toBe('green');
        expect(textLight).toBe('red');
        expect(backDark).toBe('green');
        expect(textDark).toBe('red');
    });

    it('has style color, deprecated value', () => {
        const div = document.createElement('div');

        div.style.color = 'windowtext';
        div.style.backgroundColor = 'window';

        const backLight = getColor(div, true, false, darkColorHandler);
        const textLight = getColor(div, false, false, darkColorHandler);
        const backDark = getColor(div, true, true, darkColorHandler);
        const textDark = getColor(div, false, true, darkColorHandler);

        expect(backLight).toBeUndefined();
        expect(textLight).toBe('rgb(0, 0, 0)');
        expect(backDark).toBeUndefined();
        expect(textDark).toBe('rgb(0, 0, 0)');
    });

    it('has fallback color', () => {
        const div = document.createElement('div');

        const backLight = getColor(div, true, false, darkColorHandler, 'fallbackBack');
        const textLight = getColor(div, false, false, darkColorHandler, 'fallbackText');
        const backDark = getColor(div, true, true, darkColorHandler, 'fallbackBack');
        const textDark = getColor(div, false, true, darkColorHandler, 'fallbackText');

        expect(backLight).toBe('fallbackBack');
        expect(textLight).toBe('fallbackText');
        expect(backDark).toBe('');
        expect(textDark).toBe('');
    });
});

describe('setColor without darkColorHandler', () => {
    it('no existing color, set null color', () => {
        const lightDiv = document.createElement('div');
        const darkDiv = document.createElement('div');

        setColor(lightDiv, null, true, false);
        setColor(lightDiv, null, false, false);
        setColor(darkDiv, null, true, true);
        setColor(darkDiv, null, false, true);

        expect(lightDiv.outerHTML).toBe('<div></div>');
        expect(darkDiv.outerHTML).toBe('<div></div>');
    });

    it('no existing color, set valid color', () => {
        const lightDiv = document.createElement('div');
        const darkDiv = document.createElement('div');

        setColor(lightDiv, 'red', true, false);
        setColor(lightDiv, 'green', false, false);
        setColor(darkDiv, 'red', true, true);
        setColor(darkDiv, 'green', false, true);

        expect(lightDiv.outerHTML).toBe('<div style="background-color: red; color: green;"></div>');
        expect(darkDiv.outerHTML).toBe('<div style="background-color: red; color: green;"></div>');
    });

    it('no existing color, set var based color', () => {
        const lightDiv = document.createElement('div');
        const darkDiv = document.createElement('div');

        setColor(lightDiv, 'var(--test, red)', true, false);
        setColor(lightDiv, 'var(--test, green)', false, false);
        setColor(darkDiv, 'var(--test, red)', true, true);
        setColor(darkDiv, 'var(--test, green)', false, true);

        expect(lightDiv.outerHTML).toBe('<div style="background-color: red; color: green;"></div>');
        expect(darkDiv.outerHTML).toBe('<div style="background-color: red; color: green;"></div>');
    });

    it('has existing color, set valid color', () => {
        const lightDiv = document.createElement('div');
        const darkDiv = document.createElement('div');

        lightDiv.setAttribute('color', '#000000');
        lightDiv.setAttribute('bgcolor', '#ff0000');
        lightDiv.style.color = '#00ff00';
        lightDiv.style.backgroundColor = '#0000ff';
        darkDiv.setAttribute('color', '#000000');
        darkDiv.setAttribute('bgcolor', '#ff0000');
        darkDiv.style.color = '#00ff00';
        darkDiv.style.backgroundColor = '#0000ff';

        setColor(lightDiv, 'red', true, false);
        setColor(lightDiv, 'green', false, false);
        setColor(darkDiv, 'red', true, true);
        setColor(darkDiv, 'green', false, true);

        expect(lightDiv.outerHTML).toBe('<div style="color: green; background-color: red;"></div>');
        expect(darkDiv.outerHTML).toBe('<div style="color: green; background-color: red;"></div>');
    });
});

describe('setColor with darkColorHandler', () => {
    let knownColors: Record<string, Colors>;
    let getDarkColorSpy: jasmine.Spy;
    let updateKnownColorSpy: jasmine.Spy;
    let darkColorHandler: DarkColorHandler;

    beforeEach(() => {
        knownColors = {};
        getDarkColorSpy = jasmine
            .createSpy('getDarkColor')
            .and.callFake((color: string) => '--dark_' + color);
        updateKnownColorSpy = jasmine.createSpy('updateKnownColor');

        darkColorHandler = {
            knownColors,
            getDarkColor: getDarkColorSpy,
            updateKnownColor: updateKnownColorSpy,
            reset: null!,
            generateColorKey: defaultGenerateColorKey,
        };
    });

    it('no existing color, set null color', () => {
        const lightDiv = document.createElement('div');
        const darkDiv = document.createElement('div');

        setColor(lightDiv, null, true, false, darkColorHandler);
        setColor(lightDiv, null, false, false, darkColorHandler);
        setColor(darkDiv, null, true, true, darkColorHandler);
        setColor(darkDiv, null, false, true, darkColorHandler);

        expect(lightDiv.outerHTML).toBe('<div></div>');
        expect(darkDiv.outerHTML).toBe('<div></div>');
        expect(getDarkColorSpy).toHaveBeenCalledTimes(0);
        expect(updateKnownColorSpy).toHaveBeenCalledTimes(0);
    });

    it('no existing color, set valid color', () => {
        const lightDiv = document.createElement('div');
        const darkDiv = document.createElement('div');

        setColor(lightDiv, 'red', true, false, darkColorHandler);
        setColor(lightDiv, 'green', false, false, darkColorHandler);
        setColor(darkDiv, 'red', true, true, darkColorHandler, 'blue');
        setColor(darkDiv, 'green', false, true, darkColorHandler);

        expect(lightDiv.outerHTML).toBe('<div style="background-color: red; color: green;"></div>');
        expect(darkDiv.outerHTML).toBe(
            '<div style="background-color: var(--darkColor_red_blue, red); color: var(--darkColor_green, green);"></div>'
        );
        expect(getDarkColorSpy).toHaveBeenCalledTimes(4);
        expect(getDarkColorSpy).toHaveBeenCalledWith(
            'green',
            undefined,
            'text',
            lightDiv,
            undefined
        );
        expect(getDarkColorSpy).toHaveBeenCalledWith(
            'red',
            undefined,
            'background',
            lightDiv,
            undefined
        );
        expect(getDarkColorSpy).toHaveBeenCalledWith(
            'green',
            undefined,
            'text',
            darkDiv,
            undefined
        );
        expect(getDarkColorSpy).toHaveBeenCalledWith(
            'red',
            undefined,
            'background',
            darkDiv,
            'blue'
        );
        expect(updateKnownColorSpy).toHaveBeenCalledTimes(4);
        expect(updateKnownColorSpy).toHaveBeenCalledWith(false, '--darkColor_red', {
            lightModeColor: 'red',
            darkModeColor: '--dark_red',
        });
        expect(updateKnownColorSpy).toHaveBeenCalledWith(false, '--darkColor_green', {
            lightModeColor: 'green',
            darkModeColor: '--dark_green',
        });
        expect(updateKnownColorSpy).toHaveBeenCalledWith(true, '--darkColor_red_blue', {
            lightModeColor: 'red',
            darkModeColor: '--dark_red',
        });
        expect(updateKnownColorSpy).toHaveBeenCalledWith(true, '--darkColor_green', {
            lightModeColor: 'green',
            darkModeColor: '--dark_green',
        });
    });

    it('no existing color, set var based color', () => {
        const lightDiv = document.createElement('div');
        const darkDiv = document.createElement('div');

        setColor(lightDiv, 'var(--test, red)', true, false, darkColorHandler);
        setColor(lightDiv, 'var(--test2, green)', false, false, darkColorHandler);
        setColor(darkDiv, 'var(--test, red)', true, true, darkColorHandler);
        setColor(darkDiv, 'var(--test2, green)', false, true, darkColorHandler);

        expect(lightDiv.outerHTML).toBe('<div style="background-color: red; color: green;"></div>');
        expect(darkDiv.outerHTML).toBe(
            '<div style="background-color: var(--test, red); color: var(--test2, green);"></div>'
        );
        expect(knownColors).toEqual({});
        expect(getDarkColorSpy).toHaveBeenCalledTimes(4);
        expect(getDarkColorSpy).toHaveBeenCalledWith(
            'green',
            undefined,
            'text',
            lightDiv,
            undefined
        );
        expect(getDarkColorSpy).toHaveBeenCalledWith(
            'red',
            undefined,
            'background',
            lightDiv,
            undefined
        );
        expect(getDarkColorSpy).toHaveBeenCalledWith(
            'green',
            undefined,
            'text',
            darkDiv,
            undefined
        );
        expect(getDarkColorSpy).toHaveBeenCalledWith(
            'red',
            undefined,
            'background',
            darkDiv,
            undefined
        );
        expect(updateKnownColorSpy).toHaveBeenCalledTimes(4);
        expect(updateKnownColorSpy).toHaveBeenCalledWith(false, '--test', {
            lightModeColor: 'red',
            darkModeColor: '--dark_red',
        });
        expect(updateKnownColorSpy).toHaveBeenCalledWith(false, '--test2', {
            lightModeColor: 'green',
            darkModeColor: '--dark_green',
        });
        expect(updateKnownColorSpy).toHaveBeenCalledWith(true, '--test', {
            lightModeColor: 'red',
            darkModeColor: '--dark_red',
        });
        expect(updateKnownColorSpy).toHaveBeenCalledWith(true, '--test2', {
            lightModeColor: 'green',
            darkModeColor: '--dark_green',
        });
    });

    it('has existing color, set valid color', () => {
        const lightDiv = document.createElement('div');
        const darkDiv = document.createElement('div');

        lightDiv.setAttribute('color', '#000000');
        lightDiv.setAttribute('bgcolor', '#ff0000');
        lightDiv.style.color = '#00ff00';
        lightDiv.style.backgroundColor = '#0000ff';
        darkDiv.setAttribute('color', '#000000');
        darkDiv.setAttribute('bgcolor', '#ff0000');
        darkDiv.style.color = '#00ff00';
        darkDiv.style.backgroundColor = '#0000ff';

        setColor(lightDiv, 'red', true, false, darkColorHandler);
        setColor(lightDiv, 'green', false, false, darkColorHandler);
        setColor(darkDiv, 'red', true, true, darkColorHandler);
        setColor(darkDiv, 'green', false, true, darkColorHandler);

        expect(lightDiv.outerHTML).toBe('<div style="color: green; background-color: red;"></div>');
        expect(darkDiv.outerHTML).toBe(
            '<div style="color: var(--darkColor_green, green); background-color: var(--darkColor_red, red);"></div>'
        );
        expect(getDarkColorSpy).toHaveBeenCalledTimes(4);
        expect(getDarkColorSpy).toHaveBeenCalledWith(
            'green',
            undefined,
            'text',
            lightDiv,
            undefined
        );
        expect(getDarkColorSpy).toHaveBeenCalledWith(
            'red',
            undefined,
            'background',
            lightDiv,
            undefined
        );
        expect(getDarkColorSpy).toHaveBeenCalledWith(
            'green',
            undefined,
            'text',
            darkDiv,
            undefined
        );
        expect(getDarkColorSpy).toHaveBeenCalledWith(
            'red',
            undefined,
            'background',
            darkDiv,
            undefined
        );
        expect(updateKnownColorSpy).toHaveBeenCalledTimes(4);
        expect(updateKnownColorSpy).toHaveBeenCalledWith(false, '--darkColor_red', {
            lightModeColor: 'red',
            darkModeColor: '--dark_red',
        });
        expect(updateKnownColorSpy).toHaveBeenCalledWith(false, '--darkColor_green', {
            lightModeColor: 'green',
            darkModeColor: '--dark_green',
        });
        expect(updateKnownColorSpy).toHaveBeenCalledWith(true, '--darkColor_red', {
            lightModeColor: 'red',
            darkModeColor: '--dark_red',
        });
        expect(updateKnownColorSpy).toHaveBeenCalledWith(true, '--darkColor_green', {
            lightModeColor: 'green',
            darkModeColor: '--dark_green',
        });
    });

    it('with customized generateColorKey', () => {
        const generateColorKeySpy = jasmine
            .createSpy('generateColorKey')
            .and.callFake((color: string) => '--' + color + '_key');

        const lightDiv = document.createElement('div');
        const darkDiv = document.createElement('div');

        darkColorHandler.generateColorKey = generateColorKeySpy;

        setColor(lightDiv, 'red', true, false, darkColorHandler);
        setColor(lightDiv, 'green', false, false, darkColorHandler);
        setColor(darkDiv, 'red', true, true, darkColorHandler);
        setColor(darkDiv, 'green', false, true, darkColorHandler);

        expect(lightDiv.outerHTML).toBe('<div style="background-color: red; color: green;"></div>');
        expect(darkDiv.outerHTML).toBe(
            '<div style="background-color: var(--red_key, red); color: var(--green_key, green);"></div>'
        );
        expect(getDarkColorSpy).toHaveBeenCalledTimes(4);
        expect(getDarkColorSpy).toHaveBeenCalledWith(
            'green',
            undefined,
            'text',
            lightDiv,
            undefined
        );
        expect(getDarkColorSpy).toHaveBeenCalledWith(
            'red',
            undefined,
            'background',
            lightDiv,
            undefined
        );
        expect(getDarkColorSpy).toHaveBeenCalledWith(
            'green',
            undefined,
            'text',
            darkDiv,
            undefined
        );
        expect(getDarkColorSpy).toHaveBeenCalledWith(
            'red',
            undefined,
            'background',
            darkDiv,
            undefined
        );
        expect(updateKnownColorSpy).toHaveBeenCalledTimes(4);
        expect(updateKnownColorSpy).toHaveBeenCalledWith(false, '--red_key', {
            lightModeColor: 'red',
            darkModeColor: '--dark_red',
        });
        expect(updateKnownColorSpy).toHaveBeenCalledWith(false, '--green_key', {
            lightModeColor: 'green',
            darkModeColor: '--dark_green',
        });
        expect(updateKnownColorSpy).toHaveBeenCalledWith(true, '--red_key', {
            lightModeColor: 'red',
            darkModeColor: '--dark_red',
        });
        expect(updateKnownColorSpy).toHaveBeenCalledWith(true, '--green_key', {
            lightModeColor: 'green',
            darkModeColor: '--dark_green',
        });
    });
});

describe('parseColor', () => {
    it('empty string', () => {
        const result = parseColor('');
        expect(result).toBe(null);
    });

    it('unrecognized color', () => {
        const result = parseColor('aaa');
        expect(result).toBe(null);
    });

    it('short hex 1', () => {
        const result = parseColor('#aaa');
        expect(result).toEqual([170, 170, 170]);
    });

    it('short hex 2', () => {
        const result = parseColor('#aaab');
        expect(result).toEqual(null);
    });

    it('short hex 3', () => {
        const result = parseColor('   #aaa   ');
        expect(result).toEqual([170, 170, 170]);
    });

    it('long hex 1', () => {
        const result = parseColor('#ababab');
        expect(result).toEqual([171, 171, 171]);
    });

    it('long hex 2', () => {
        const result = parseColor('#abababc');
        expect(result).toEqual(null);
    });

    it('long hex 3', () => {
        const result = parseColor('  #ababab  ');
        expect(result).toEqual([171, 171, 171]);
    });

    it('rgb 1', () => {
        const result = parseColor('rgb(1,2,3)');
        expect(result).toEqual([1, 2, 3]);
    });

    it('rgb 2', () => {
        const result = parseColor('   rgb(   1   ,   2  ,  3  )  ');
        expect(result).toEqual([1, 2, 3]);
    });

    it('rgb 3', () => {
        const result = parseColor('rgb(1.1, 2.2, 3.3)');
        expect(result).toEqual([1, 2, 3]);
    });

    it('rgba 1', () => {
        const result = parseColor('rgba(1, 2, 3, 4)');
        expect(result).toEqual([1, 2, 3]);
    });

    it('rgba 2', () => {
        const result = parseColor('    rgba(   1.1   ,    2.2   ,  3.3  ,  4.4  )  ');
        expect(result).toEqual([1, 2, 3]);
    });

    it('rgba 3', () => {
        const result = parseColor('rgba(1.1, 2.2, 3.3, 4.4)');
        expect(result).toEqual([1, 2, 3]);
    });
});

describe('getLightModeColor', () => {
    it('should return undefined for background deprecated colors', () => {
        const result = getLightModeColor('windowtext', false, undefined, undefined);
        expect(result).toBeUndefined();
    });

    it('should return black color for text deprecated colors', () => {
        const result = getLightModeColor('windowtext', false, undefined, 'rgb(0, 0, 0)');
        expect(result).toBe('rgb(0, 0, 0)');
    });

    it('should return color as-is for normal colors without dark color handler', () => {
        const result = getLightModeColor('red', false, undefined);
        expect(result).toBe('red');
    });

    it('should extract fallback color from CSS variable', () => {
        const darkColorHandler: DarkColorHandler = {
            knownColors: {},
            getDarkColor: jasmine.createSpy('getDarkColor'),
            updateKnownColor: jasmine.createSpy('updateKnownColor'),
            reset: jasmine.createSpy('reset'),
            generateColorKey: defaultGenerateColorKey,
        };

        const result = getLightModeColor('var(--test, red)', false, darkColorHandler);
        expect(result).toBe('red');
    });

    it('should extract empty string when no fallback in CSS variable', () => {
        const darkColorHandler: DarkColorHandler = {
            knownColors: {},
            getDarkColor: jasmine.createSpy('getDarkColor'),
            updateKnownColor: jasmine.createSpy('updateKnownColor'),
            reset: jasmine.createSpy('reset'),
            generateColorKey: defaultGenerateColorKey,
        };

        const result = getLightModeColor('var(--test)', false, darkColorHandler);
        expect(result).toBe('');
    });

    it('should return empty string for unknown dark color in dark mode', () => {
        const darkColorHandler: DarkColorHandler = {
            knownColors: {},
            getDarkColor: jasmine.createSpy('getDarkColor'),
            updateKnownColor: jasmine.createSpy('updateKnownColor'),
            reset: jasmine.createSpy('reset'),
            generateColorKey: defaultGenerateColorKey,
        };

        const result = getLightModeColor('rgb(100, 100, 100)', true, darkColorHandler);
        expect(result).toBe('');
    });

    it('should find light color from known dark colors in dark mode', () => {
        const darkColorHandler: DarkColorHandler = {
            knownColors: {
                '--darkColor_red': {
                    lightModeColor: 'red',
                    darkModeColor: 'rgb(100, 100, 100)',
                },
            },
            getDarkColor: jasmine.createSpy('getDarkColor'),
            updateKnownColor: jasmine.createSpy('updateKnownColor'),
            reset: jasmine.createSpy('reset'),
            generateColorKey: defaultGenerateColorKey,
        };

        const result = getLightModeColor('rgb(100, 100, 100)', true, darkColorHandler);
        expect(result).toBe('red');
    });
});

describe('retrieveElementColor', () => {
    let element: HTMLElement;

    beforeEach(() => {
        element = document.createElement('div');
    });

    it('should retrieve text color from style', () => {
        element.style.color = 'red';
        const result = retrieveElementColor(element, 'text');
        expect(result).toBe('red');
    });

    it('should retrieve text color from attribute if no style', () => {
        element.setAttribute('color', 'blue');
        const result = retrieveElementColor(element, 'text');
        expect(result).toBe('blue');
    });

    it('should prefer style over attribute for text color', () => {
        element.style.color = 'red';
        element.setAttribute('color', 'blue');
        const result = retrieveElementColor(element, 'text');
        expect(result).toBe('red');
    });

    it('should return fallback for text if no color found', () => {
        const result = retrieveElementColor(element, 'text', 'fallback');
        expect(result).toBe('fallback');
    });

    it('should retrieve background color from style', () => {
        element.style.backgroundColor = 'green';
        const result = retrieveElementColor(element, 'background');
        expect(result).toBe('green');
    });

    it('should retrieve background color from attribute if no style', () => {
        element.setAttribute('bgcolor', 'yellow');
        const result = retrieveElementColor(element, 'background');
        expect(result).toBe('yellow');
    });

    it('should prefer style over attribute for background color', () => {
        element.style.backgroundColor = 'green';
        element.setAttribute('bgcolor', 'yellow');
        const result = retrieveElementColor(element, 'background');
        expect(result).toBe('green');
    });

    it('should return fallback for background if no color found', () => {
        const result = retrieveElementColor(element, 'background', 'fallback');
        expect(result).toBe('fallback');
    });

    it('should return undefined if no text color and no fallback', () => {
        const result = retrieveElementColor(element, 'text');
        expect(result).toBeUndefined();
    });

    it('should return undefined if no background color and no fallback', () => {
        const result = retrieveElementColor(element, 'background');
        expect(result).toBeUndefined();
    });
});

describe('adaptColor', () => {
    let element: HTMLElement;
    let darkColorHandler: DarkColorHandler;
    let getDarkColorSpy: jasmine.Spy;
    let updateKnownColorSpy: jasmine.Spy;

    beforeEach(() => {
        element = document.createElement('div');
        getDarkColorSpy = jasmine.createSpy('getDarkColor').and.returnValue('dark_red');
        updateKnownColorSpy = jasmine.createSpy('updateKnownColor');

        darkColorHandler = {
            knownColors: {},
            getDarkColor: getDarkColorSpy,
            updateKnownColor: updateKnownColorSpy,
            reset: jasmine.createSpy('reset'),
            generateColorKey: defaultGenerateColorKey,
        };
    });

    it('should return null for null color', () => {
        const result = adaptColor(element, null, 'border', false);
        expect(result).toBeNull();
    });

    it('should return undefined for undefined color', () => {
        const result = adaptColor(element, undefined, 'border', false);
        expect(result).toBeUndefined();
    });

    it('should return color as-is without dark color handler', () => {
        const result = adaptColor(element, 'red', 'border', false);
        expect(result).toBe('red');
    });

    it('should return color as-is in light mode with dark color handler', () => {
        const result = adaptColor(element, 'red', 'border', false, darkColorHandler);
        expect(result).toBe('red');
        expect(getDarkColorSpy).toHaveBeenCalledWith(
            'red',
            undefined,
            'border',
            element,
            undefined
        );
        expect(updateKnownColorSpy).toHaveBeenCalledWith(false, '--darkColor_red', {
            lightModeColor: 'red',
            darkModeColor: 'dark_red',
        });
    });

    it('should wrap color with CSS variable in dark mode', () => {
        const result = adaptColor(element, 'blue', 'border', true, darkColorHandler);
        expect(result).toBe('var(--darkColor_blue, blue)');
        expect(getDarkColorSpy).toHaveBeenCalledWith(
            'blue',
            undefined,
            'border',
            element,
            undefined
        );
        expect(updateKnownColorSpy).toHaveBeenCalledWith(true, '--darkColor_blue', {
            lightModeColor: 'blue',
            darkModeColor: 'dark_red',
        });
    });

    it('should extract fallback color from existing CSS variable', () => {
        const result = adaptColor(
            element,
            'var(--existing, green)',
            'border',
            false,
            darkColorHandler
        );
        expect(result).toBe('green');
        expect(getDarkColorSpy).toHaveBeenCalledWith(
            'green',
            undefined,
            'border',
            element,
            undefined
        );
        expect(updateKnownColorSpy).toHaveBeenCalledWith(false, '--existing', {
            lightModeColor: 'green',
            darkModeColor: 'dark_red',
        });
    });

    it('should use existing key from CSS variable in dark mode', () => {
        const result = adaptColor(
            element,
            'var(--existing, green)',
            'border',
            true,
            darkColorHandler
        );
        expect(result).toBe('var(--existing, green)');
        expect(getDarkColorSpy).toHaveBeenCalledWith(
            'green',
            undefined,
            'border',
            element,
            undefined
        );
        expect(updateKnownColorSpy).toHaveBeenCalledWith(true, '--existing', {
            lightModeColor: 'green',
            darkModeColor: 'dark_red',
        });
    });

    it('should use known dark color when available', () => {
        darkColorHandler.knownColors['--darkColor_red'] = {
            lightModeColor: 'red',
            darkModeColor: 'existing_dark_red',
        };

        const result = adaptColor(element, 'red', 'border', true, darkColorHandler);
        expect(result).toBe('var(--darkColor_red, red)');
        expect(getDarkColorSpy).not.toHaveBeenCalled();
        expect(updateKnownColorSpy).toHaveBeenCalledWith(true, '--darkColor_red', {
            lightModeColor: 'red',
            darkModeColor: 'existing_dark_red',
        });
    });

    it('should generate new dark color when not in known colors', () => {
        const result = adaptColor(element, 'purple', 'border', true, darkColorHandler);
        expect(result).toBe('var(--darkColor_purple, purple)');
        expect(getDarkColorSpy).toHaveBeenCalledWith(
            'purple',
            undefined,
            'border',
            element,
            undefined
        );
        expect(updateKnownColorSpy).toHaveBeenCalledWith(true, '--darkColor_purple', {
            lightModeColor: 'purple',
            darkModeColor: 'dark_red',
        });
    });

    it('should handle text color in light mode', () => {
        const result = adaptColor(element, 'red', 'text', false, darkColorHandler);
        expect(result).toBe('red');
        expect(getDarkColorSpy).toHaveBeenCalledWith('red', undefined, 'text', element, undefined);
        expect(updateKnownColorSpy).toHaveBeenCalledWith(false, '--darkColor_red', {
            lightModeColor: 'red',
            darkModeColor: 'dark_red',
        });
    });

    it('should handle text color in dark mode', () => {
        const result = adaptColor(element, 'red', 'text', true, darkColorHandler);
        expect(result).toBe('var(--darkColor_red, red)');
        expect(getDarkColorSpy).toHaveBeenCalledWith('red', undefined, 'text', element, undefined);
        expect(updateKnownColorSpy).toHaveBeenCalledWith(true, '--darkColor_red', {
            lightModeColor: 'red',
            darkModeColor: 'dark_red',
        });
    });

    it('should handle background color in light mode', () => {
        const result = adaptColor(element, 'blue', 'background', false, darkColorHandler);
        expect(result).toBe('blue');
        expect(getDarkColorSpy).toHaveBeenCalledWith(
            'blue',
            undefined,
            'background',
            element,
            undefined
        );
        expect(updateKnownColorSpy).toHaveBeenCalledWith(false, '--darkColor_blue', {
            lightModeColor: 'blue',
            darkModeColor: 'dark_red',
        });
    });

    it('should handle background color in dark mode', () => {
        const result = adaptColor(element, 'blue', 'background', true, darkColorHandler);
        expect(result).toBe('var(--darkColor_blue, blue)');
        expect(getDarkColorSpy).toHaveBeenCalledWith(
            'blue',
            undefined,
            'background',
            element,
            undefined
        );
        expect(updateKnownColorSpy).toHaveBeenCalledWith(true, '--darkColor_blue', {
            lightModeColor: 'blue',
            darkModeColor: 'dark_red',
        });
    });

    it('should handle text color with CSS variable in light mode', () => {
        const result = adaptColor(
            element,
            'var(--text-color, black)',
            'text',
            false,
            darkColorHandler
        );
        expect(result).toBe('black');
        expect(getDarkColorSpy).toHaveBeenCalledWith(
            'black',
            undefined,
            'text',
            element,
            undefined
        );
        expect(updateKnownColorSpy).toHaveBeenCalledWith(false, '--text-color', {
            lightModeColor: 'black',
            darkModeColor: 'dark_red',
        });
    });

    it('should handle text color with CSS variable in dark mode', () => {
        const result = adaptColor(
            element,
            'var(--text-color, black)',
            'text',
            true,
            darkColorHandler
        );
        expect(result).toBe('var(--text-color, black)');
        expect(getDarkColorSpy).toHaveBeenCalledWith(
            'black',
            undefined,
            'text',
            element,
            undefined
        );
        expect(updateKnownColorSpy).toHaveBeenCalledWith(true, '--text-color', {
            lightModeColor: 'black',
            darkModeColor: 'dark_red',
        });
    });

    it('should handle background color with CSS variable in light mode', () => {
        const result = adaptColor(
            element,
            'var(--bg-color, white)',
            'background',
            false,
            darkColorHandler
        );
        expect(result).toBe('white');
        expect(getDarkColorSpy).toHaveBeenCalledWith(
            'white',
            undefined,
            'background',
            element,
            undefined
        );
        expect(updateKnownColorSpy).toHaveBeenCalledWith(false, '--bg-color', {
            lightModeColor: 'white',
            darkModeColor: 'dark_red',
        });
    });

    it('should handle background color with CSS variable in dark mode', () => {
        const result = adaptColor(
            element,
            'var(--bg-color, white)',
            'background',
            true,
            darkColorHandler
        );
        expect(result).toBe('var(--bg-color, white)');
        expect(getDarkColorSpy).toHaveBeenCalledWith(
            'white',
            undefined,
            'background',
            element,
            undefined
        );
        expect(updateKnownColorSpy).toHaveBeenCalledWith(true, '--bg-color', {
            lightModeColor: 'white',
            darkModeColor: 'dark_red',
        });
    });

    it('should use known text color in dark mode', () => {
        darkColorHandler.knownColors['--darkColor_orange'] = {
            lightModeColor: 'orange',
            darkModeColor: 'existing_dark_orange',
        };

        const result = adaptColor(element, 'orange', 'text', true, darkColorHandler);
        expect(result).toBe('var(--darkColor_orange, orange)');
        expect(getDarkColorSpy).not.toHaveBeenCalled();
        expect(updateKnownColorSpy).toHaveBeenCalledWith(true, '--darkColor_orange', {
            lightModeColor: 'orange',
            darkModeColor: 'existing_dark_orange',
        });
    });

    it('should use known background color in dark mode', () => {
        darkColorHandler.knownColors['--darkColor_gray'] = {
            lightModeColor: 'gray',
            darkModeColor: 'existing_dark_gray',
        };

        const result = adaptColor(element, 'gray', 'background', true, darkColorHandler);
        expect(result).toBe('var(--darkColor_gray, gray)');
        expect(getDarkColorSpy).not.toHaveBeenCalled();
        expect(updateKnownColorSpy).toHaveBeenCalledWith(true, '--darkColor_gray', {
            lightModeColor: 'gray',
            darkModeColor: 'existing_dark_gray',
        });
    });
});
