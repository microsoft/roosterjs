import { ColorKeyAndValue, DarkColorHandler } from 'roosterjs-editor-types';
import { createDarkColorHandler } from '../../lib/editor/DarkColorHandlerImpl';
import { createDarkColorHandler as createInnderDarkColorHandler } from 'roosterjs-content-model-core/lib/editor/DarkColorHandlerImpl';

function getDarkColor(color: string) {
    return 'Dark_' + color;
}

describe('DarkColorHandlerImpl.ctor', () => {
    it('No additional param', () => {
        const div = document.createElement('div');
        const innerHandler = createInnderDarkColorHandler(div, getDarkColor);
        const handler = createDarkColorHandler(innerHandler);

        expect(handler).toBeDefined();
    });

    it('Calculate color using customized base color', () => {
        const div = document.createElement('div');
        const innerHandler = createInnderDarkColorHandler(div, getDarkColor);
        const handler = createDarkColorHandler(innerHandler);

        const darkColor = handler.registerColor('red', true);
        const parsedColor = handler.parseColorValue(darkColor);

        expect(darkColor).toBe('var(--darkColor_red, red)');
        expect(parsedColor).toEqual({
            key: '--darkColor_red',
            lightModeColor: 'red',
            darkModeColor: 'Dark_red',
        });
    });
});

describe('DarkColorHandlerImpl.parseColorValue', () => {
    let div: HTMLElement;
    let handler: DarkColorHandler;

    beforeEach(() => {
        div = document.createElement('div');
        const innerHandler = createInnderDarkColorHandler(div, getDarkColor);
        handler = createDarkColorHandler(innerHandler);
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
        (handler as any).innerHandler.knownColors = {
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
        (handler as any).innerHandler.knownColors = {
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
    let setProperty: jasmine.Spy;
    let handler: DarkColorHandler;

    beforeEach(() => {
        setProperty = jasmine.createSpy('setProperty');
        const div = ({
            style: {
                setProperty,
            },
        } as any) as HTMLElement;
        const innerHandler = createInnderDarkColorHandler(div, getDarkColor);
        handler = createDarkColorHandler(innerHandler);
    });

    function runTest(
        input: string,
        isDark: boolean,
        darkColor: string | undefined,
        expectedOutput: string,
        expectedKnownColors: Record<string, ColorKeyAndValue>
    ) {
        const result = handler.registerColor(input, isDark, darkColor);

        expect(result).toEqual(expectedOutput);
        expect((handler as any).innerHandler.knownColors).toEqual(expectedKnownColors);
    }

    it('empty color, light mode', () => {
        runTest('', false, undefined, '', {});
    });

    it('simple color, light mode', () => {
        runTest('red', false, undefined, 'red', {});
    });

    it('empty color, dark mode', () => {
        runTest('', true, undefined, '', {});
    });

    it('simple color, dark mode', () => {
        runTest('red', true, undefined, 'var(--darkColor_red, red)', {
            '--darkColor_red': {
                lightModeColor: 'red',
                darkModeColor: 'Dark_red',
            },
        });
    });

    it('simple color, dark mode, with dark color', () => {
        runTest('red', true, 'blue', 'var(--darkColor_red, red)', {
            '--darkColor_red': {
                lightModeColor: 'red',
                darkModeColor: 'blue',
            },
        });
    });

    it('var color, light mode', () => {
        runTest('var(--aa, bb)', false, undefined, 'bb', {});
    });

    it('var color, dark mode', () => {
        runTest('var(--aa, red)', true, undefined, 'var(--aa, red)', {
            '--aa': {
                lightModeColor: 'red',
                darkModeColor: 'Dark_red',
            },
        });
    });

    it('var color, dark mode with dark color', () => {
        runTest('var(--aa, bb)', true, 'cc', 'var(--aa, bb)', {
            '--aa': {
                lightModeColor: 'bb',
                darkModeColor: 'cc',
            },
        });
    });

    it('var color, dark mode with dark color and existing dark color', () => {
        (handler as any).innerHandler.knownColors['--aa'] = {
            lightModeColor: 'dd',
            darkModeColor: 'ee',
        };
        runTest('var(--aa, bb)', true, 'cc', 'var(--aa, bb)', {
            '--aa': {
                lightModeColor: 'dd',
                darkModeColor: 'ee',
            },
        });
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
        const innerHandler = createInnderDarkColorHandler(div, getDarkColor);
        const handler = createDarkColorHandler(innerHandler);

        (handler as any).innerHandler.knownColors = {
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

        expect(removeProperty).toHaveBeenCalledTimes(2);
        expect(removeProperty).toHaveBeenCalledWith('--aa');
        expect(removeProperty).toHaveBeenCalledWith('--dd');
    });
});

describe('DarkColorHandlerImpl.findLightColorFromDarkColor', () => {
    it('Not found', () => {
        const div = ({} as any) as HTMLElement;
        const innerHandler = createInnderDarkColorHandler(div, getDarkColor);
        const handler = createDarkColorHandler(innerHandler);

        const result = handler.findLightColorFromDarkColor('#010203');

        expect(result).toEqual(null);
    });

    it('Found: HEX to RGB', () => {
        const div = ({} as any) as HTMLElement;
        const innerHandler = createInnderDarkColorHandler(div, getDarkColor);
        const handler = createDarkColorHandler(innerHandler);

        (handler as any).innerHandler.knownColors = {
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
        const innerHandler = createInnderDarkColorHandler(div, getDarkColor);
        const handler = createDarkColorHandler(innerHandler);

        (handler as any).innerHandler.knownColors = {
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
        const innerHandler = createInnderDarkColorHandler(div, getDarkColor);
        const handler = createDarkColorHandler(innerHandler);

        (handler as any).innerHandler.knownColors = {
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
        const innerHandler = createInnderDarkColorHandler(div, getDarkColor);
        const handler = createDarkColorHandler(innerHandler);

        (handler as any).innerHandler.knownColors = {
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
    let handler: DarkColorHandler;
    let contentDiv: HTMLDivElement;

    beforeEach(() => {
        contentDiv = document.createElement('div');
        const innerHandler = createInnderDarkColorHandler(contentDiv, getDarkColor);
        handler = createDarkColorHandler(innerHandler);
    });

    it('No color, light to dark', () => {
        const span = document.createElement('span');
        handler.transformElementColor(span, false, true);

        expect(span.outerHTML).toBe('<span></span>');
    });

    it('Has simple color in HTML, light to dark', () => {
        const span = document.createElement('span');

        span.setAttribute('color', 'red');

        handler.transformElementColor(span, false, true);

        expect(span.outerHTML).toBe('<span style="color: var(--darkColor_red, red);"></span>');
    });

    it('Has simple color in CSS, light to dark', () => {
        const span = document.createElement('span');

        span.style.color = 'red';

        handler.transformElementColor(span, false, true);

        expect(span.outerHTML).toBe('<span style="color: var(--darkColor_red, red);"></span>');
    });

    it('Has color in both text and background, light to dark', () => {
        const span = document.createElement('span');

        span.style.color = 'red';
        span.style.backgroundColor = 'green';

        handler.transformElementColor(span, false, true);

        expect(span.outerHTML).toBe(
            '<span style="color: var(--darkColor_red, red); background-color: var(--darkColor_green, green);"></span>'
        );
    });

    it('Has var-based color, light to dark', () => {
        const span = document.createElement('span');

        span.style.color = 'var(--darkColor_red, red)';

        handler.transformElementColor(span, false, true);

        expect(span.outerHTML).toBe('<span style="color: var(--darkColor_red, red);"></span>');
    });

    it('No color, dark to light', () => {
        const span = document.createElement('span');
        handler.transformElementColor(span, true, false);

        expect(span.outerHTML).toBe('<span></span>');
    });

    it('Has simple color in HTML, dark to light', () => {
        const span = document.createElement('span');

        span.setAttribute('color', 'red');

        handler.transformElementColor(span, true, false);

        expect(span.outerHTML).toBe('<span></span>');
    });

    it('Has simple color in CSS, dark to light', () => {
        const span = document.createElement('span');

        span.style.color = 'red';

        handler.transformElementColor(span, true, false);

        expect(span.outerHTML).toBe('<span style=""></span>');
    });

    it('Has color in both text and background, dark to light', () => {
        const span = document.createElement('span');

        span.style.color = 'red';
        span.style.backgroundColor = 'green';

        handler.transformElementColor(span, true, false);

        expect(span.outerHTML).toBe('<span style=""></span>');
    });

    it('Has var-based color, dark to light', () => {
        const span = document.createElement('span');

        span.style.color = 'var(--darkColor_red, red)';

        handler.transformElementColor(span, true, false);

        expect(span.outerHTML).toBe('<span style="color: red;"></span>');
    });
});
