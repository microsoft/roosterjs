import DarkColorHandlerImpl from '../../lib/editor/DarkColorHandlerImpl';
import { ColorKeyAndValue } from 'roosterjs-editor-types';

describe('DarkColorHandlerImpl.parseColorValue', () => {
    function getDarkColor(color: string) {
        return color + color;
    }

    let div: HTMLElement;
    let handler: DarkColorHandlerImpl;

    beforeEach(() => {
        div = document.createElement('div');
        handler = new DarkColorHandlerImpl(div, getDarkColor);
    });

    function runTest(input: string, expectedOutput: ColorKeyAndValue) {
        const result = handler.parseColorValue(input);

        expect(result).toEqual(expectedOutput);
    }

    it('empty color', () => {
        runTest(null!, {
            key: undefined,
            lightModeColor: '',
            darkModeColor: undefined,
        });
    });

    it('simple color', () => {
        runTest('aa', {
            key: undefined,
            lightModeColor: 'aa',
            darkModeColor: undefined,
        });
    });

    it('var color without fallback', () => {
        runTest('var(--bb)', {
            key: undefined,
            lightModeColor: '',
            darkModeColor: undefined,
        });
    });

    it('var color with fallback', () => {
        runTest('var(--bb,cc)', {
            key: '--bb',
            lightModeColor: 'cc',
            darkModeColor: undefined,
        });
    });

    it('var color with fallback, has dark color', () => {
        (handler as any).knownColors = {
            '--bb': {
                lightModeColor: 'dd',
                darkModeColor: 'ee',
            },
        };
        runTest('var(--bb,cc)', {
            key: '--bb',
            lightModeColor: 'cc',
            darkModeColor: 'ee',
        });
    });

    function runDarkTest(input: string, expectedOutput: ColorKeyAndValue) {
        const result = handler.parseColorValue(input, true);

        expect(result).toEqual(expectedOutput);
    }

    it('simple color in dark mode', () => {
        runDarkTest('aa', {
            key: undefined,
            lightModeColor: '',
            darkModeColor: undefined,
        });
    });

    it('var color in dark mode', () => {
        runDarkTest('var(--aa, bb)', {
            key: '--aa',
            lightModeColor: 'bb',
            darkModeColor: undefined,
        });
    });

    it('known simple color in dark mode', () => {
        (handler as any).knownColors = {
            '--bb': {
                lightModeColor: '#ff0000',
                darkModeColor: '#00ffff',
            },
        };
        runDarkTest('#00ffff', {
            key: undefined,
            lightModeColor: '#ff0000',
            darkModeColor: '#00ffff',
        });
    });
});

describe('DarkColorHandlerImpl.registerColor', () => {
    function getDarkColor(color: string) {
        return color + color;
    }

    let setProperty: jasmine.Spy;
    let handler: DarkColorHandlerImpl;

    beforeEach(() => {
        setProperty = jasmine.createSpy('setProperty');
        const div = ({
            style: {
                setProperty,
            },
        } as any) as HTMLElement;
        handler = new DarkColorHandlerImpl(div, getDarkColor);
    });

    function runTest(
        input: string,
        isDark: boolean,
        darkColor: string | undefined,
        expectedOutput: string,
        expectedKnownColors: Record<string, ColorKeyAndValue>,
        expectedSetPropertyCalls: [string, string][]
    ) {
        handler.isDarkMode = isDark;
        const result = handler.registerColor(input, isDark, darkColor);

        expect(result).toEqual(expectedOutput);
        expect((handler as any).knownColors).toEqual(expectedKnownColors);
        expect(setProperty).toHaveBeenCalledTimes(expectedSetPropertyCalls.length);

        expectedSetPropertyCalls.forEach(v => {
            expect(setProperty).toHaveBeenCalledWith(...v);
        });
    }

    it('empty color, light mode', () => {
        runTest('', false, undefined, '', {}, []);
    });

    xit('simple color, light mode', () => {
        runTest('red', false, undefined, 'var(--darkColor_red, red)', {}, []);
    });

    it('empty color, dark mode', () => {
        runTest('', true, undefined, '', {}, []);
    });

    xit('simple color, dark mode', () => {
        runTest(
            'red',
            true,
            undefined,
            'var(--darkColor_red, red)',
            {
                '--darkColor_red': {
                    lightModeColor: 'red',
                    darkModeColor: 'redred',
                },
            },
            [['--darkColor_red', 'redred']]
        );
    });

    xit('simple color, dark mode, with dark color', () => {
        runTest(
            'red',
            true,
            'blue',
            'var(--darkColor_red, red)',
            {
                '--darkColor_red': {
                    lightModeColor: 'red',
                    darkModeColor: 'blue',
                },
            },
            [['--darkColor_red', 'blue']]
        );
    });

    xit('var color, light mode', () => {
        runTest('var(--aa, bb)', false, undefined, 'var(--aa, bb)', {}, []);
    });

    it('var color, dark mode', () => {
        runTest(
            'var(--aa, bb)',
            true,
            undefined,
            'var(--aa, bb)',
            {
                '--aa': {
                    lightModeColor: 'bb',
                    darkModeColor: 'bbbb',
                },
            },
            [['--aa', 'bbbb']]
        );
    });

    it('var color, dark mode with dark color', () => {
        runTest(
            'var(--aa, bb)',
            true,
            'cc',
            'var(--aa, bb)',
            {
                '--aa': {
                    lightModeColor: 'bb',
                    darkModeColor: 'cc',
                },
            },
            [['--aa', 'cc']]
        );
    });

    xit('var color, dark mode with dark color and existing dark color', () => {
        (handler as any).knownColors['--aa'] = {
            lightModeColor: 'dd',
            darkModeColor: 'ee',
        };
        runTest(
            'var(--aa, bb)',
            true,
            'cc',
            'var(--aa, bb)',
            {
                '--aa': {
                    lightModeColor: 'dd',
                    darkModeColor: 'ee',
                },
            },
            []
        );
    });
});

describe('DarkColorHandlerImpl.reset', () => {
    it('Reset', () => {
        const removeProperty = jasmine.createSpy('removeProperty');
        const div = ({
            style: {
                removeProperty,
            },
        } as any) as HTMLElement;
        const handler = new DarkColorHandlerImpl(div, null!);

        (handler as any).knownColors = {
            '--aa': {
                lightModeColor: 'bb',
                darkModeColor: 'cc',
            },
            '--dd': {
                lightModeColor: 'ee',
                darkModeColor: 'ff',
            },
        };

        handler.reset();

        expect((handler as any).knownColors).toEqual({
            '--aa': { lightModeColor: 'bb', darkModeColor: 'cc' },
            '--dd': { lightModeColor: 'ee', darkModeColor: 'ff' },
        });
        expect(removeProperty).toHaveBeenCalledTimes(2);
        expect(removeProperty).toHaveBeenCalledWith('--aa');
        expect(removeProperty).toHaveBeenCalledWith('--dd');
    });
});

describe('DarkColorHandlerImpl.findLightColorFromDarkColor', () => {
    it('Not found', () => {
        const div = ({} as any) as HTMLElement;
        const handler = new DarkColorHandlerImpl(div, null!);

        const result = handler.findLightColorFromDarkColor('#010203');

        expect(result).toEqual(null);
    });

    it('Found: HEX to RGB', () => {
        const div = ({} as any) as HTMLElement;
        const handler = new DarkColorHandlerImpl(div, null!);

        (handler as any).knownColors = {
            '--bb': {
                lightModeColor: 'bb',
                darkModeColor: 'rgb(4,5,6)',
            },
            '--aa': {
                lightModeColor: 'aa',
                darkModeColor: 'rgb(1,2,3)',
            },
        };

        const result = handler.findLightColorFromDarkColor('#010203');

        expect(result).toEqual('aa');
    });

    it('Found: HEX to HEX', () => {
        const div = ({} as any) as HTMLElement;
        const handler = new DarkColorHandlerImpl(div, null!);

        (handler as any).knownColors = {
            '--bb': {
                lightModeColor: 'bb',
                darkModeColor: 'rgb(4,5,6)',
            },
            '--aa': {
                lightModeColor: 'aa',
                darkModeColor: '#010203',
            },
        };

        const result = handler.findLightColorFromDarkColor('#010203');

        expect(result).toEqual('aa');
    });

    it('Found: RGB to HEX', () => {
        const div = ({} as any) as HTMLElement;
        const handler = new DarkColorHandlerImpl(div, null!);

        (handler as any).knownColors = {
            '--bb': {
                lightModeColor: 'bb',
                darkModeColor: 'rgb(4,5,6)',
            },
            '--aa': {
                lightModeColor: 'aa',
                darkModeColor: '#010203',
            },
        };

        const result = handler.findLightColorFromDarkColor('rgb(1,2,3)');

        expect(result).toEqual('aa');
    });

    it('Found: RGB to RGB', () => {
        const div = ({} as any) as HTMLElement;
        const handler = new DarkColorHandlerImpl(div, null!);

        (handler as any).knownColors = {
            '--bb': {
                lightModeColor: 'bb',
                darkModeColor: 'rgb(4,5,6)',
            },
            '--aa': {
                lightModeColor: 'aa',
                darkModeColor: 'rgb(1, 2, 3)',
            },
        };

        const result = handler.findLightColorFromDarkColor('rgb(1,2,3)');

        expect(result).toEqual('aa');
    });
});

describe('DarkColorHandlerImpl.transformElementColor', () => {
    let parseColorSpy: jasmine.Spy;
    let registerColorSpy: jasmine.Spy;
    let handler: DarkColorHandlerImpl;
    let contentDiv: HTMLDivElement;

    beforeEach(() => {
        const getDarkColor = (color: string) => 'mocked_' + color;
        contentDiv = document.createElement('div');
        handler = new DarkColorHandlerImpl(contentDiv, getDarkColor);

        parseColorSpy = spyOn(handler, 'parseColorValue').and.callThrough();
        registerColorSpy = spyOn(handler, 'registerColor').and.callThrough();
    });

    it('No color, light to dark', () => {
        const span = document.createElement('span');
        handler.transformElementColor(span, false, true);

        expect(span.outerHTML).toBe('<span></span>');
        expect(parseColorSpy).toHaveBeenCalledTimes(2);
        expect(parseColorSpy).toHaveBeenCalledWith('', false);
        expect(registerColorSpy).not.toHaveBeenCalled();
    });

    xit('Has simple color in HTML, light to dark', () => {
        const span = document.createElement('span');

        span.setAttribute('color', 'red');

        handler.transformElementColor(span, false, true);

        expect(span.outerHTML).toBe('<span style="color: var(--darkColor_red, red);"></span>');
        expect(parseColorSpy).toHaveBeenCalledTimes(3);
        expect(parseColorSpy).toHaveBeenCalledWith('red', false);
        expect(parseColorSpy).toHaveBeenCalledWith('', false);
        expect(registerColorSpy).toHaveBeenCalledTimes(1);
        expect(registerColorSpy).toHaveBeenCalledWith('red', true, undefined);
    });

    xit('Has simple color in CSS, light to dark', () => {
        const span = document.createElement('span');

        span.style.color = 'red';

        handler.transformElementColor(span, false, true);

        expect(span.outerHTML).toBe('<span style="color: var(--darkColor_red, red);"></span>');
        expect(parseColorSpy).toHaveBeenCalledTimes(3);
        expect(parseColorSpy).toHaveBeenCalledWith('red', false);
        expect(parseColorSpy).toHaveBeenCalledWith('', false);
        expect(registerColorSpy).toHaveBeenCalledTimes(1);
        expect(registerColorSpy).toHaveBeenCalledWith('red', true, undefined);
    });

    xit('Has color in both text and background, light to dark', () => {
        const span = document.createElement('span');

        span.style.color = 'red';
        span.style.backgroundColor = 'green';

        handler.transformElementColor(span, false, true);

        expect(span.outerHTML).toBe(
            '<span style="color: var(--darkColor_red, red); background-color: var(--darkColor_green, green);"></span>'
        );
        expect(parseColorSpy).toHaveBeenCalledTimes(4);
        expect(parseColorSpy).toHaveBeenCalledWith('red', false);
        expect(parseColorSpy).toHaveBeenCalledWith('green', false);
        expect(parseColorSpy).toHaveBeenCalledWith('red');
        expect(parseColorSpy).toHaveBeenCalledWith('green');
        expect(registerColorSpy).toHaveBeenCalledTimes(2);
        expect(registerColorSpy).toHaveBeenCalledWith('red', true, undefined);
        expect(registerColorSpy).toHaveBeenCalledWith('green', true, undefined);
    });

    xit('Has var-based color, light to dark', () => {
        const span = document.createElement('span');

        span.style.color = 'var(--darkColor_red, red)';

        handler.transformElementColor(span, false, true);

        expect(span.outerHTML).toBe('<span style="color: var(--darkColor_red, red);"></span>');
        expect(parseColorSpy).toHaveBeenCalledTimes(3);
        expect(parseColorSpy).toHaveBeenCalledWith('var(--darkColor_red, red)', false);
        expect(parseColorSpy).toHaveBeenCalledWith('red');
        expect(parseColorSpy).toHaveBeenCalledWith(null, false);
        expect(registerColorSpy).toHaveBeenCalledTimes(1);
        expect(registerColorSpy).toHaveBeenCalledWith('red', true, undefined);
    });

    xit('No color, dark to light', () => {
        const span = document.createElement('span');
        handler.transformElementColor(span, true, false);

        expect(span.outerHTML).toBe('<span></span>');
        expect(parseColorSpy).toHaveBeenCalledTimes(2);
        expect(parseColorSpy).toHaveBeenCalledWith(null, true);
        expect(registerColorSpy).not.toHaveBeenCalled();
    });

    it('Has simple color in HTML, dark to light', () => {
        const span = document.createElement('span');

        span.setAttribute('color', 'red');

        handler.transformElementColor(span, true, false);

        expect(span.outerHTML).toBe('<span></span>');
        expect(parseColorSpy).toHaveBeenCalledTimes(2);
        expect(parseColorSpy).toHaveBeenCalledWith('red', true);
        expect(parseColorSpy).toHaveBeenCalledWith('', true);
        expect(registerColorSpy).not.toHaveBeenCalled();
    });

    it('Has simple color in CSS, dark to light', () => {
        const span = document.createElement('span');

        span.style.color = 'red';

        handler.transformElementColor(span, true, false);

        expect(span.outerHTML).toBe('<span style=""></span>');
        expect(parseColorSpy).toHaveBeenCalledTimes(2);
        expect(parseColorSpy).toHaveBeenCalledWith('red', true);
        expect(parseColorSpy).toHaveBeenCalledWith('', true);
        expect(registerColorSpy).not.toHaveBeenCalled();
    });

    it('Has color in both text and background, dark to light', () => {
        const span = document.createElement('span');

        span.style.color = 'red';
        span.style.backgroundColor = 'green';

        handler.transformElementColor(span, true, false);

        expect(span.outerHTML).toBe('<span style=""></span>');
        expect(parseColorSpy).toHaveBeenCalledTimes(2);
        expect(parseColorSpy).toHaveBeenCalledWith('red', true);
        expect(parseColorSpy).toHaveBeenCalledWith('green', true);
        expect(registerColorSpy).not.toHaveBeenCalled();
    });

    xit('Has var-based color, dark to light', () => {
        const span = document.createElement('span');

        span.style.color = 'var(--darkColor_red, red)';

        handler.isDarkMode = true;
        handler.transformElementColor(span, true, false);

        expect(span.outerHTML).toBe('<span style="color: red;"></span>');
        expect(parseColorSpy).toHaveBeenCalledTimes(3);
        expect(parseColorSpy).toHaveBeenCalledWith('var(--darkColor_red, red)', true);
        expect(parseColorSpy).toHaveBeenCalledWith('red');
        expect(parseColorSpy).toHaveBeenCalledWith('', true);
        expect(registerColorSpy).toHaveBeenCalledTimes(1);
        expect(registerColorSpy).toHaveBeenCalledWith('red', false, undefined);
    });
});
