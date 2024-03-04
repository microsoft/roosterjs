import { Colors, DarkColorHandler } from 'roosterjs-content-model-types';
import { getColor, parseColor, setColor } from '../../../lib/formatHandlers/utils/color';

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

        expect(backLight).toBe('var(--test, green)');
        expect(textLight).toBe('var(--test, red)');
        expect(backDark).toBe('var(--test, green)');
        expect(textDark).toBe('var(--test, red)');
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
        setColor(darkDiv, 'red', true, true, darkColorHandler);
        setColor(darkDiv, 'green', false, true, darkColorHandler);

        expect(lightDiv.outerHTML).toBe('<div style="background-color: red; color: green;"></div>');
        expect(darkDiv.outerHTML).toBe(
            '<div style="background-color: var(--darkColor_red, red); color: var(--darkColor_green, green);"></div>'
        );
        expect(getDarkColorSpy).toHaveBeenCalledTimes(4);
        expect(getDarkColorSpy).toHaveBeenCalledWith('green', undefined, 'text', lightDiv);
        expect(getDarkColorSpy).toHaveBeenCalledWith('red', undefined, 'background', lightDiv);
        expect(getDarkColorSpy).toHaveBeenCalledWith('green', undefined, 'text', darkDiv);
        expect(getDarkColorSpy).toHaveBeenCalledWith('red', undefined, 'background', darkDiv);
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
        expect(getDarkColorSpy).toHaveBeenCalledWith('green', undefined, 'text', lightDiv);
        expect(getDarkColorSpy).toHaveBeenCalledWith('red', undefined, 'background', lightDiv);
        expect(getDarkColorSpy).toHaveBeenCalledWith('green', undefined, 'text', darkDiv);
        expect(getDarkColorSpy).toHaveBeenCalledWith('red', undefined, 'background', darkDiv);
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
        expect(getDarkColorSpy).toHaveBeenCalledWith('green', undefined, 'text', lightDiv);
        expect(getDarkColorSpy).toHaveBeenCalledWith('red', undefined, 'background', lightDiv);
        expect(getDarkColorSpy).toHaveBeenCalledWith('green', undefined, 'text', darkDiv);
        expect(getDarkColorSpy).toHaveBeenCalledWith('red', undefined, 'background', darkDiv);
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
