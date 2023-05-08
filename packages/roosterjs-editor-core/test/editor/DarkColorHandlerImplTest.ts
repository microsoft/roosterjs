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

    it('simple color, light mode', () => {
        runTest('red', false, undefined, 'red', {}, []);
    });

    it('empty color, dark mode', () => {
        runTest('', true, undefined, '', {}, []);
    });

    it('simple color, dark mode', () => {
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

    it('simple color, dark mode, with dark color', () => {
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

    it('var color, light mode', () => {
        runTest('var(--aa, bb)', false, undefined, 'bb', {}, []);
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

    it('var color, dark mode with dark color and existing dark color', () => {
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

        expect((handler as any).knownColors).toEqual({});
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
