import * as colorUtils from '../../../lib/formatHandlers/utils/color';
import { borderColorFormatHandler } from '../../../lib/formatHandlers/common/borderColorFormatHandler';
import { BorderFormat, DomToModelContext, ModelToDomContext } from 'roosterjs-content-model-types';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';

describe('borderColorFormatHandler.parse', () => {
    let div: HTMLElement;
    let format: BorderFormat;
    let context: DomToModelContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createDomToModelContext({
            experimentalFeatures: ['TransformTableBorderColors'],
        });
    });

    it('Parse border with CSS variable in dark mode', () => {
        div.style.borderTop = 'var(--colorKey1, red) 1px solid';

        const mockDarkColorHandler = {
            knownColors: {
                '--colorKey1': {
                    lightModeColor: 'red',
                    darkModeColor: 'darkred',
                },
            },
            getDarkColor: jasmine.createSpy('getDarkColor'),
            updateKnownColor: jasmine.createSpy('updateKnownColor'),
            generateColorKey: jasmine.createSpy('generateColorKey'),
            reset: jasmine.createSpy('reset'),
        };

        context.isDarkMode = true;
        context.darkColorHandler = mockDarkColorHandler;

        spyOn(colorUtils, 'retrieveElementColor').and.returnValue('red');
        spyOn(colorUtils, 'getLightModeColor').and.returnValue('red');

        borderColorFormatHandler.parse(format, div, context, {});

        expect(colorUtils.retrieveElementColor).toHaveBeenCalledWith(div, 'borderTop');
        expect(colorUtils.getLightModeColor).toHaveBeenCalledWith(
            'red',
            false,
            true,
            mockDarkColorHandler
        );
        expect(format.borderTop).toBeDefined();
    });

    it('Parse border with CSS variable in light mode', () => {
        div.style.borderBottom = 'var(--colorKey2, blue) 2px dashed';

        const mockDarkColorHandler = {
            knownColors: {
                '--colorKey2': {
                    lightModeColor: 'blue',
                    darkModeColor: 'darkblue',
                },
            },
            getDarkColor: jasmine.createSpy('getDarkColor'),
            updateKnownColor: jasmine.createSpy('updateKnownColor'),
            generateColorKey: jasmine.createSpy('generateColorKey'),
            reset: jasmine.createSpy('reset'),
        };

        context.isDarkMode = false;
        context.darkColorHandler = mockDarkColorHandler;

        spyOn(colorUtils, 'retrieveElementColor').and.returnValue('blue');
        spyOn(colorUtils, 'getLightModeColor').and.returnValue('blue');

        borderColorFormatHandler.parse(format, div, context, {});

        expect(colorUtils.retrieveElementColor).toHaveBeenCalledWith(div, 'borderBottom');
        expect(colorUtils.getLightModeColor).toHaveBeenCalledWith(
            'blue',
            false,
            false,
            mockDarkColorHandler
        );
        expect(format.borderBottom).toBeDefined();
    });

    it('Parse multiple borders with CSS variables', () => {
        div.style.borderTop = 'var(--colorKey1, red) 1px solid';
        div.style.borderRight = 'var(--colorKey2, green) 2px dashed';
        div.style.borderBottom = 'var(--colorKey3, blue) 3px dotted';
        div.style.borderLeft = 'var(--colorKey4, yellow) 4px double';

        const mockDarkColorHandler = {
            knownColors: {
                '--colorKey1': { lightModeColor: 'red', darkModeColor: 'darkred' },
                '--colorKey2': { lightModeColor: 'green', darkModeColor: 'darkgreen' },
                '--colorKey3': { lightModeColor: 'blue', darkModeColor: 'darkblue' },
                '--colorKey4': { lightModeColor: 'yellow', darkModeColor: 'darkyellow' },
            },
            getDarkColor: jasmine.createSpy('getDarkColor'),
            updateKnownColor: jasmine.createSpy('updateKnownColor'),
            generateColorKey: jasmine.createSpy('generateColorKey'),
            reset: jasmine.createSpy('reset'),
        };

        context.isDarkMode = true;
        context.darkColorHandler = mockDarkColorHandler;

        spyOn(colorUtils, 'retrieveElementColor').and.returnValues(
            'red',
            'green',
            'blue',
            'yellow'
        );
        spyOn(colorUtils, 'getLightModeColor').and.returnValues('red', 'green', 'blue', 'yellow');

        borderColorFormatHandler.parse(format, div, context, {});

        expect(colorUtils.retrieveElementColor).toHaveBeenCalledTimes(4);
        expect(colorUtils.getLightModeColor).toHaveBeenCalledTimes(4);
        expect(format.borderTop).toBeDefined();
        expect(format.borderRight).toBeDefined();
        expect(format.borderBottom).toBeDefined();
        expect(format.borderLeft).toBeDefined();
    });

    it('Parse border without CSS variable - should not parse', () => {
        div.style.borderTop = '1px solid red';

        context.isDarkMode = false;
        context.darkColorHandler = undefined;

        spyOn(colorUtils, 'retrieveElementColor');
        spyOn(colorUtils, 'getLightModeColor');

        borderColorFormatHandler.parse(format, div, context, {});

        expect(colorUtils.retrieveElementColor).not.toHaveBeenCalled();
        expect(colorUtils.getLightModeColor).not.toHaveBeenCalled();
        expect(format.borderTop).toBeUndefined();
    });

    it('Parse border with CSS variable but no color retrieved', () => {
        div.style.borderTop = 'var(--colorKey1, red) 1px solid';

        const mockDarkColorHandler = {
            knownColors: {},
            getDarkColor: jasmine.createSpy('getDarkColor'),
            updateKnownColor: jasmine.createSpy('updateKnownColor'),
            generateColorKey: jasmine.createSpy('generateColorKey'),
            reset: jasmine.createSpy('reset'),
        };

        context.isDarkMode = true;
        context.darkColorHandler = mockDarkColorHandler;

        spyOn(colorUtils, 'retrieveElementColor').and.returnValue(undefined);
        spyOn(colorUtils, 'getLightModeColor');

        borderColorFormatHandler.parse(format, div, context, {});

        expect(colorUtils.retrieveElementColor).toHaveBeenCalled();
        expect(colorUtils.getLightModeColor).not.toHaveBeenCalled();
        expect(format.borderTop).toBeUndefined();
    });

    it('Parse border without dark color handler', () => {
        div.style.borderTop = 'var(--colorKey1, red) 1px solid';

        context.isDarkMode = false;
        context.darkColorHandler = undefined;

        spyOn(colorUtils, 'retrieveElementColor').and.returnValue('red');
        spyOn(colorUtils, 'getLightModeColor').and.returnValue('red');

        borderColorFormatHandler.parse(format, div, context, {});

        expect(colorUtils.retrieveElementColor).toHaveBeenCalled();
        expect(colorUtils.getLightModeColor).toHaveBeenCalledWith('red', false, false, undefined);
        expect(format.borderTop).toBeDefined();
    });
});

describe('borderColorFormatHandler.apply', () => {
    let div: HTMLElement;
    let format: BorderFormat;
    let context: ModelToDomContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createModelToDomContext({
            experimentalFeatures: ['TransformTableBorderColors'],
        });
    });

    it('Apply border with dark mode color handler in dark mode', () => {
        format.borderTop = '1px solid red';

        const mockDarkColorHandler = {
            knownColors: {},
            getDarkColor: jasmine.createSpy('getDarkColor').and.returnValue('darkred'),
            updateKnownColor: jasmine.createSpy('updateKnownColor'),
            generateColorKey: jasmine.createSpy('generateColorKey').and.returnValue('--colorKey1'),
            reset: jasmine.createSpy('reset'),
        };

        context.isDarkMode = true;
        context.darkColorHandler = mockDarkColorHandler;

        spyOn(colorUtils, 'adaptColor').and.returnValue('var(--colorKey1, red)');

        borderColorFormatHandler.apply(format, div, context);

        expect(colorUtils.adaptColor).toHaveBeenCalledWith(
            div,
            'red',
            'border',
            true,
            mockDarkColorHandler
        );
        expect(div.style.borderTop).toBe('1px solid var(--colorKey1, red)');
    });

    it('Apply border with dark mode color handler in light mode', () => {
        format.borderBottom = '2px dashed blue';

        const mockDarkColorHandler = {
            knownColors: {},
            getDarkColor: jasmine.createSpy('getDarkColor').and.returnValue('darkblue'),
            updateKnownColor: jasmine.createSpy('updateKnownColor'),
            generateColorKey: jasmine.createSpy('generateColorKey').and.returnValue('--colorKey2'),
            reset: jasmine.createSpy('reset'),
        };

        context.isDarkMode = false;
        context.darkColorHandler = mockDarkColorHandler;

        spyOn(colorUtils, 'adaptColor').and.returnValue('blue');

        borderColorFormatHandler.apply(format, div, context);

        expect(colorUtils.adaptColor).toHaveBeenCalledWith(
            div,
            'blue',
            'border',
            false,
            mockDarkColorHandler
        );
        expect(div.style.borderBottom).toBe('2px dashed blue');
    });

    it('Apply multiple borders with dark mode color handler', () => {
        format.borderTop = '1px solid red';
        format.borderRight = '2px dashed green';
        format.borderBottom = '3px dotted blue';
        format.borderLeft = '4px double yellow';

        const mockDarkColorHandler = {
            knownColors: {},
            getDarkColor: jasmine
                .createSpy('getDarkColor')
                .and.returnValues('darkred', 'darkgreen', 'darkblue', 'darkyellow'),
            updateKnownColor: jasmine.createSpy('updateKnownColor'),
            generateColorKey: jasmine
                .createSpy('generateColorKey')
                .and.returnValues('--key1', '--key2', '--key3', '--key4'),
            reset: jasmine.createSpy('reset'),
        };

        context.isDarkMode = true;
        context.darkColorHandler = mockDarkColorHandler;

        spyOn(colorUtils, 'adaptColor').and.returnValues(
            'var(--key1, red)',
            'var(--key2, green)',
            'var(--key3, blue)',
            'var(--key4, yellow)'
        );

        borderColorFormatHandler.apply(format, div, context);

        expect(colorUtils.adaptColor).toHaveBeenCalledTimes(4);
        expect(div.style.borderTop).toBe('1px solid var(--key1, red)');
        expect(div.style.borderRight).toBe('2px dashed var(--key2, green)');
        expect(div.style.borderBottom).toBe('3px dotted var(--key3, blue)');
        expect(div.style.borderLeft).toBe('4px double var(--key4, yellow)');
    });

    it('Apply border without dark mode color handler', () => {
        format.borderTop = '1px solid red';

        context.isDarkMode = false;
        context.darkColorHandler = undefined;

        spyOn(colorUtils, 'adaptColor').and.returnValue('red');

        borderColorFormatHandler.apply(format, div, context);

        expect(colorUtils.adaptColor).toHaveBeenCalledWith(div, 'red', 'border', false, undefined);
        expect(div.style.borderTop).toBe('1px solid red');
    });

    it('Apply border with existing CSS variable color', () => {
        format.borderTop = '1px solid red';

        const mockDarkColorHandler = {
            knownColors: {
                '--existingKey': {
                    lightModeColor: 'red',
                    darkModeColor: 'darkred',
                },
            },
            getDarkColor: jasmine.createSpy('getDarkColor').and.returnValue('darkred'),
            updateKnownColor: jasmine.createSpy('updateKnownColor'),
            generateColorKey: jasmine
                .createSpy('generateColorKey')
                .and.returnValue('--existingKey'),
            reset: jasmine.createSpy('reset'),
        };

        context.isDarkMode = true;
        context.darkColorHandler = mockDarkColorHandler;

        spyOn(colorUtils, 'adaptColor').and.returnValue('var(--existingKey, red)');

        borderColorFormatHandler.apply(format, div, context);

        expect(colorUtils.adaptColor).toHaveBeenCalledWith(
            div,
            'red',
            'border',
            true,
            mockDarkColorHandler
        );
        expect(div.style.borderTop).toBe('1px solid var(--existingKey, red)');
    });

    it('Apply border without color - should not apply', () => {
        format.borderTop = '1px solid';

        context.isDarkMode = false;
        context.darkColorHandler = undefined;

        spyOn(colorUtils, 'adaptColor');

        borderColorFormatHandler.apply(format, div, context);

        expect(colorUtils.adaptColor).not.toHaveBeenCalled();
        expect(div.style.borderTop).toBe('');
    });

    it('Apply border with only width and style, no color', () => {
        format.borderTop = '2px dashed';

        const mockDarkColorHandler = {
            knownColors: {},
            getDarkColor: jasmine.createSpy('getDarkColor'),
            updateKnownColor: jasmine.createSpy('updateKnownColor'),
            generateColorKey: jasmine.createSpy('generateColorKey'),
            reset: jasmine.createSpy('reset'),
        };

        context.isDarkMode = true;
        context.darkColorHandler = mockDarkColorHandler;

        spyOn(colorUtils, 'adaptColor');

        borderColorFormatHandler.apply(format, div, context);

        expect(colorUtils.adaptColor).not.toHaveBeenCalled();
        expect(div.style.borderTop).toBe('');
    });

    it('Apply empty format - should not apply anything', () => {
        context.isDarkMode = false;
        context.darkColorHandler = undefined;

        spyOn(colorUtils, 'adaptColor');

        borderColorFormatHandler.apply(format, div, context);

        expect(colorUtils.adaptColor).not.toHaveBeenCalled();
        expect(div.style.borderTop).toBe('');
        expect(div.style.borderRight).toBe('');
        expect(div.style.borderBottom).toBe('');
        expect(div.style.borderLeft).toBe('');
    });

    it('Apply border with hex color value', () => {
        format.borderTop = '1px solid #FF0000';

        const mockDarkColorHandler = {
            knownColors: {},
            getDarkColor: jasmine.createSpy('getDarkColor').and.returnValue('#990000'),
            updateKnownColor: jasmine.createSpy('updateKnownColor'),
            generateColorKey: jasmine.createSpy('generateColorKey').and.returnValue('--hexColor'),
            reset: jasmine.createSpy('reset'),
        };

        context.isDarkMode = true;
        context.darkColorHandler = mockDarkColorHandler;

        spyOn(colorUtils, 'adaptColor').and.returnValue('var(--hexColor, #FF0000)');

        borderColorFormatHandler.apply(format, div, context);

        expect(colorUtils.adaptColor).toHaveBeenCalledWith(
            div,
            '#FF0000',
            'border',
            true,
            mockDarkColorHandler
        );
        expect(div.style.borderTop).toBe('1px solid var(--hexColor, #FF0000)');
    });

    it('Apply border with rgb color value', () => {
        format.borderBottom = '2px dashed rgb(0, 128, 255)';

        const mockDarkColorHandler = {
            knownColors: {},
            getDarkColor: jasmine.createSpy('getDarkColor').and.returnValue('rgb(0, 64, 128)'),
            updateKnownColor: jasmine.createSpy('updateKnownColor'),
            generateColorKey: jasmine.createSpy('generateColorKey').and.returnValue('--rgbColor'),
            reset: jasmine.createSpy('reset'),
        };

        context.isDarkMode = true;
        context.darkColorHandler = mockDarkColorHandler;

        spyOn(colorUtils, 'adaptColor').and.returnValue('var(--rgbColor, rgb(0, 128, 255))');

        borderColorFormatHandler.apply(format, div, context);

        expect(colorUtils.adaptColor).toHaveBeenCalledWith(
            div,
            'rgb(0,128,255)',
            'border',
            true,
            mockDarkColorHandler
        );
        expect(div.style.borderBottom).toBe('2px dashed var(--rgbColor, rgb(0, 128, 255))');
    });
});
