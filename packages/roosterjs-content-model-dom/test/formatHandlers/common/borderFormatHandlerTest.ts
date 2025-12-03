import * as colorUtils from '../../../lib/formatHandlers/utils/color';
import { BorderFormat, DomToModelContext, ModelToDomContext } from 'roosterjs-content-model-types';
import { borderFormatHandler } from '../../../lib/formatHandlers/common/borderFormatHandler';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';

describe('borderFormatHandler.parse', () => {
    let div: HTMLElement;
    let format: BorderFormat;
    let context: DomToModelContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createDomToModelContext();
    });

    it('No border', () => {
        borderFormatHandler.parse(format, div, context, {});

        expect(format).toEqual({});
    });

    it('Has border values', () => {
        div.style.borderColor = 'red';
        div.style.borderStyle = 'solid';
        div.style.borderWidth = '1px';

        borderFormatHandler.parse(format, div, context, {});

        expect(format).toEqual({
            borderTop: '1px solid red',
            borderRight: '1px solid red',
            borderBottom: '1px solid red',
            borderLeft: '1px solid red',
        });
    });

    it('Has border width with different values', () => {
        div.style.borderWidth = '1px 2px 3px 4px';
        div.style.borderStyle = 'solid';
        div.style.borderColor = 'red';

        borderFormatHandler.parse(format, div, context, {});

        expect(format).toEqual({
            borderTop: '1px solid red',
            borderRight: '2px solid red',
            borderBottom: '3px solid red',
            borderLeft: '4px solid red',
        });
    });

    it('Has border width none value', () => {
        div.style.borderWidth = '1px 2px 3px 4px';
        div.style.borderStyle = 'none';
        div.style.borderColor = 'red';

        borderFormatHandler.parse(format, div, context, {});

        expect(format).toEqual({
            borderTop: jasmine.stringMatching(/1px (none )?red/),
            borderRight: jasmine.stringMatching(/2px (none )?red/),
            borderBottom: jasmine.stringMatching(/3px (none )?red/),
            borderLeft: jasmine.stringMatching(/4px (none )?red/),
        });
    });

    it('Has border width none value only', () => {
        div.style.borderStyle = '';

        borderFormatHandler.parse(format, div, context, {});

        expect(format).toEqual({});
    });

    it('Has 0 width border', () => {
        div.style.border = '0px sold black';

        borderFormatHandler.parse(format, div, context, {});

        expect(format).toEqual({});
    });

    it('Has border with CSS variable color', () => {
        div.style.borderTop = '1px solid var(--123, red)';
        div.style.borderTopWidth = '1px';

        const mockDarkColorHandler = {
            knownColors: {},
            getDarkColor: jasmine.createSpy('getDarkColor').and.returnValue('darkblue'),
            updateKnownColor: jasmine.createSpy('updateKnownColor'),
            generateColorKey: jasmine.createSpy('generateColorKey'),
            reset: jasmine.createSpy('reset'),
        };

        context.isDarkMode = true;
        context.darkColorHandler = mockDarkColorHandler;

        // Spy on retrieveElementColor to return the actual computed color
        spyOn(colorUtils, 'retrieveElementColor').and.returnValue('blue');

        borderFormatHandler.parse(format, div, context, {});

        expect(format.borderTop).toBe('1px solid blue');
    });

    it('Has border with CSS variable color in light mode', () => {
        div.style.borderTop = '1px solid var(--456, green)';
        div.style.borderTopWidth = '1px';

        const mockDarkColorHandler = {
            knownColors: {},
            getDarkColor: jasmine.createSpy('getDarkColor').and.returnValue('darkgreen'),
            updateKnownColor: jasmine.createSpy('updateKnownColor'),
            generateColorKey: jasmine.createSpy('generateColorKey'),
            reset: jasmine.createSpy('reset'),
        };

        context.isDarkMode = false;
        context.darkColorHandler = mockDarkColorHandler;

        // Spy on retrieveElementColor to return the actual computed color
        spyOn(colorUtils, 'retrieveElementColor').and.returnValue('lightgreen');

        borderFormatHandler.parse(format, div, context, {});

        expect(format.borderTop).toBe('1px solid lightgreen');
    });

    it('Has multiple borders with CSS variable colors', () => {
        div.style.borderTop = '1px solid var(--123, red)';
        div.style.borderRight = '2px dashed var(--456, blue)';
        div.style.borderTopWidth = '1px';
        div.style.borderRightWidth = '2px';

        const mockDarkColorHandler = {
            knownColors: {},
            getDarkColor: jasmine.createSpy('getDarkColor').and.returnValue('darkcolor'),
            updateKnownColor: jasmine.createSpy('updateKnownColor'),
            generateColorKey: jasmine.createSpy('generateColorKey'),
            reset: jasmine.createSpy('reset'),
        };

        context.isDarkMode = true;
        context.darkColorHandler = mockDarkColorHandler;

        // Spy on retrieveElementColor to return the actual computed colors
        spyOn(colorUtils, 'retrieveElementColor').and.returnValues('red', 'blue');

        borderFormatHandler.parse(format, div, context, {});

        expect(format.borderTop).toBe('1px solid red');
        expect(format.borderRight).toBe('2px dashed blue');
    });

    it('Has border radius', () => {
        div.style.borderRadius = '10px';

        borderFormatHandler.parse(format, div, context, {});

        expect(format).toEqual({
            borderRadius: '10px',
        });
    });

    it('Has border radius and independant corner radius, but prefer shorthand css', () => {
        div.style.borderTopRightRadius = '7px';
        div.style.borderBottomLeftRadius = '7px';
        div.style.borderBottomRightRadius = '7px';
        div.style.borderRadius = '10px';

        borderFormatHandler.parse(format, div, context, {});

        expect(format).toEqual({
            borderRadius: '10px',
        });
    });

    it('Has border borderTopLeftRadius', () => {
        div.style.borderTopLeftRadius = '10px';

        borderFormatHandler.parse(format, div, context, {});

        expect(format).toEqual({
            borderTopLeftRadius: '10px',
        });
    });

    it('Has border borderTopRightRadius', () => {
        div.style.borderTopRightRadius = '10px';

        borderFormatHandler.parse(format, div, context, {});

        expect(format).toEqual({
            borderTopRightRadius: '10px',
        });
    });

    it('Has border borderBottomLeftRadius', () => {
        div.style.borderBottomLeftRadius = '10px';

        borderFormatHandler.parse(format, div, context, {});

        expect(format).toEqual({
            borderBottomLeftRadius: '10px',
        });
    });

    it('Has border borderBottomRightRadius', () => {
        div.style.borderBottomRightRadius = '10px';

        borderFormatHandler.parse(format, div, context, {});

        expect(format).toEqual({
            borderBottomRightRadius: '10px',
        });
    });
});

describe('borderFormatHandler.apply', () => {
    let div: HTMLElement;
    let format: BorderFormat;
    let context: ModelToDomContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createModelToDomContext();
    });

    it('No border', () => {
        borderFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div></div>');
    });

    it('Has top border', () => {
        format.borderTop = '1px solid red';

        borderFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div style="border-top: 1px solid red;"></div>');
    });

    it('Has border color - empty values', () => {
        format.borderTop = 'red';

        borderFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div style="border-top: red;"></div>');
    });

    it('Use independant border radius 1', () => {
        format.borderBottomLeftRadius = '2px';
        format.borderBottomRightRadius = '3px';
        format.borderTopRightRadius = '3px';

        borderFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual(
            '<div style="border-top-right-radius: 3px; border-bottom-left-radius: 2px; border-bottom-right-radius: 3px;"></div>'
        );
    });

    it('border radius', () => {
        format.borderRadius = '50%';

        borderFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div style="border-radius: 50%;"></div>');
    });

    it('Apply border with dark mode color handler', () => {
        format.borderTop = '1px solid red';

        const mockDarkColorHandler = {
            knownColors: {},
            getDarkColor: jasmine.createSpy('getDarkColor').and.returnValue('darkred'),
            updateKnownColor: jasmine.createSpy('updateKnownColor'),
            generateColorKey: jasmine.createSpy('generateColorKey').and.returnValue('colorKey1'),
            reset: jasmine.createSpy('reset'),
        };

        context.isDarkMode = true;
        context.darkColorHandler = mockDarkColorHandler;

        // Spy on retrieveElementColor to return the color
        spyOn(colorUtils, 'retrieveElementColor').and.returnValue('red');

        borderFormatHandler.apply(format, div, context);

        expect(div.style.borderTop).toContain('var(--colorKey1, red)');
        expect(mockDarkColorHandler.generateColorKey).toHaveBeenCalledWith(
            'red',
            undefined,
            'border',
            div
        );
        expect(mockDarkColorHandler.updateKnownColor).toHaveBeenCalledWith(true, 'colorKey1', {
            lightModeColor: 'red',
            darkModeColor: 'darkred',
        });
    });

    it('Apply border with dark mode color handler in light mode', () => {
        format.borderBottom = '2px dashed blue';

        const mockDarkColorHandler = {
            knownColors: {},
            getDarkColor: jasmine.createSpy('getDarkColor').and.returnValue('darkblue'),
            updateKnownColor: jasmine.createSpy('updateKnownColor'),
            generateColorKey: jasmine.createSpy('generateColorKey').and.returnValue('colorKey2'),
            reset: jasmine.createSpy('reset'),
        };

        context.isDarkMode = false;
        context.darkColorHandler = mockDarkColorHandler;

        // Spy on retrieveElementColor to return the color
        spyOn(colorUtils, 'retrieveElementColor').and.returnValue('blue');

        borderFormatHandler.apply(format, div, context);

        expect(div.style.borderBottom).toBe('2px dashed blue');
        expect(mockDarkColorHandler.generateColorKey).toHaveBeenCalledWith(
            'blue',
            undefined,
            'border',
            div
        );
        expect(mockDarkColorHandler.updateKnownColor).toHaveBeenCalledWith(false, 'colorKey2', {
            lightModeColor: 'blue',
            darkModeColor: 'darkblue',
        });
    });

    it('Apply multiple borders with dark mode color handler', () => {
        format.borderTop = '1px solid red';
        format.borderRight = '2px dashed green';
        format.borderBottom = '3px dotted blue';

        const mockDarkColorHandler = {
            knownColors: {},
            getDarkColor: jasmine
                .createSpy('getDarkColor')
                .and.returnValues('darkred', 'darkgreen', 'darkblue'),
            updateKnownColor: jasmine.createSpy('updateKnownColor'),
            generateColorKey: jasmine
                .createSpy('generateColorKey')
                .and.returnValues('key1', 'key2', 'key3'),
            reset: jasmine.createSpy('reset'),
        };

        context.isDarkMode = true;
        context.darkColorHandler = mockDarkColorHandler;

        // Spy on retrieveElementColor to return colors
        spyOn(colorUtils, 'retrieveElementColor').and.returnValues('red', 'green', 'blue');

        borderFormatHandler.apply(format, div, context);

        expect(div.style.borderTop).toContain('var(--key1, red)');
        expect(div.style.borderRight).toContain('var(--key2, green)');
        expect(div.style.borderBottom).toContain('var(--key3, blue)');
        expect(mockDarkColorHandler.generateColorKey).toHaveBeenCalledTimes(3);
    });

    it('Apply border without dark mode color handler', () => {
        format.borderTop = '1px solid red';

        context.isDarkMode = false;
        context.darkColorHandler = undefined;

        borderFormatHandler.apply(format, div, context);

        expect(div.style.borderTop).toBe('1px solid red');
    });

    it('Apply border with existing CSS variable color', () => {
        format.borderTop = '1px solid red';

        const mockDarkColorHandler = {
            knownColors: {
                existingKey: {
                    lightModeColor: 'red',
                    darkModeColor: 'darkred',
                },
            },
            getDarkColor: jasmine.createSpy('getDarkColor').and.returnValue('darkred'),
            updateKnownColor: jasmine.createSpy('updateKnownColor'),
            generateColorKey: jasmine.createSpy('generateColorKey').and.returnValue('existingKey'),
            reset: jasmine.createSpy('reset'),
        };

        context.isDarkMode = true;
        context.darkColorHandler = mockDarkColorHandler;

        // Spy on retrieveElementColor to return the color
        spyOn(colorUtils, 'retrieveElementColor').and.returnValue('red');

        borderFormatHandler.apply(format, div, context);

        expect(div.style.borderTop).toContain('var(--existingKey, red)');
        expect(mockDarkColorHandler.updateKnownColor).toHaveBeenCalled();
    });
});
