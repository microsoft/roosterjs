import { BorderFormat, DomToModelContext, ModelToDomContext } from 'roosterjs-content-model-types';
import { borderFormatHandler } from '../../../lib/formatHandlers/common/borderFormatHandler';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { defaultGenerateColorKey } from '../../../lib/formatHandlers/utils/color';

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

    it('Has border color in dark mode - parse', () => {
        const td = document.createElement('td');
        td.style.borderColor = 'rgb(50, 100, 150)';
        td.style.borderStyle = 'solid';
        td.style.borderWidth = '1px';
        context.isDarkMode = true;
        context.darkColorHandler = {
            updateKnownColor: jasmine.createSpy('updateKnownColor'),
            getDarkColor: (lightColor: string) => `dark_${lightColor}`,
            generateColorKey: defaultGenerateColorKey,
            knownColors: {
                '--darkColor_red': {
                    lightModeColor: 'red',
                    darkModeColor: 'rgb(50, 100, 150)',
                },
            },
        } as any;

        borderFormatHandler.parse(format, td, context, {});

        expect(format).toEqual({
            borderTop: '1px solid red',
            borderRight: '1px solid red',
            borderBottom: '1px solid red',
            borderLeft: '1px solid red',
        });
    });

    it('Has border color in dark mode for non-table element - parse (no color transformation)', () => {
        div.style.borderColor = 'red';
        div.style.borderStyle = 'solid';
        div.style.borderWidth = '1px';
        context.isDarkMode = true;
        context.darkColorHandler = {
            updateKnownColor: jasmine.createSpy('updateKnownColor'),
            getDarkColor: (lightColor: string) => `dark_${lightColor}`,
            generateColorKey: defaultGenerateColorKey,
            knownColors: {},
        } as any;

        borderFormatHandler.parse(format, div, context, {});

        expect(format).toEqual({
            borderTop: '1px solid red',
            borderRight: '1px solid red',
            borderBottom: '1px solid red',
            borderLeft: '1px solid red',
        });
    });

    it('Has border color that matches known dark color in dark mode - parse', () => {
        const td = document.createElement('td');
        td.style.borderColor = 'rgb(50, 100, 150)';
        td.style.borderStyle = 'solid';
        td.style.borderWidth = '1px';
        context.isDarkMode = true;
        context.darkColorHandler = {
            updateKnownColor: jasmine.createSpy('updateKnownColor'),
            getDarkColor: (lightColor: string) => `dark_${lightColor}`,
            generateColorKey: defaultGenerateColorKey,
            knownColors: {
                '--darkColor_green': {
                    lightModeColor: 'green',
                    darkModeColor: 'rgb(50, 100, 150)',
                },
            },
        } as any;

        borderFormatHandler.parse(format, td, context, {});

        expect(format).toEqual({
            borderTop: '1px solid green',
            borderRight: '1px solid green',
            borderBottom: '1px solid green',
            borderLeft: '1px solid green',
        });
    });

    it('Has border color that does not match known dark color in dark mode - parse', () => {
        const th = document.createElement('th');
        th.style.borderColor = 'rgb(255, 255, 255)';
        th.style.borderStyle = 'solid';
        th.style.borderWidth = '1px';
        context.isDarkMode = true;
        context.darkColorHandler = {
            updateKnownColor: jasmine.createSpy('updateKnownColor'),
            getDarkColor: (lightColor: string) => `dark_${lightColor}`,
            generateColorKey: defaultGenerateColorKey,
            knownColors: {},
        } as any;

        borderFormatHandler.parse(format, th, context, {});

        expect(format).toEqual({
            borderTop: '1px solid',
            borderRight: '1px solid',
            borderBottom: '1px solid',
            borderLeft: '1px solid',
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

    it('Has border color in dark mode - apply', () => {
        const td = document.createElement('td');
        format.borderTop = '1px solid red';
        context.isDarkMode = true;
        context.darkColorHandler = {
            updateKnownColor: jasmine.createSpy('updateKnownColor'),
            getDarkColor: (lightColor: string) => `dark_${lightColor}`,
            generateColorKey: defaultGenerateColorKey,
            knownColors: {},
        } as any;

        borderFormatHandler.apply(format, td, context);

        expect(td.outerHTML).toEqual(
            '<td style="border-top: 1px solid var(--darkColor_red, red);"></td>'
        );
        expect(context.darkColorHandler!.updateKnownColor).toHaveBeenCalledWith(
            true,
            '--darkColor_red',
            {
                lightModeColor: 'red',
                darkModeColor: 'dark_red',
            }
        );
    });

    it('Has border color in dark mode for non-table element - apply (no color transformation)', () => {
        format.borderTop = '1px solid red';
        context.isDarkMode = true;
        context.darkColorHandler = {
            updateKnownColor: jasmine.createSpy('updateKnownColor'),
            getDarkColor: (lightColor: string) => `dark_${lightColor}`,
            generateColorKey: defaultGenerateColorKey,
            knownColors: {},
        } as any;

        borderFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div style="border-top: 1px solid red;"></div>');
        expect(context.darkColorHandler!.updateKnownColor).not.toHaveBeenCalled();
    });

    it('Has border color in light mode - apply', () => {
        const th = document.createElement('th');
        format.borderBottom = '2px dotted blue';
        context.isDarkMode = false;
        context.darkColorHandler = {
            updateKnownColor: jasmine.createSpy('updateKnownColor'),
            getDarkColor: (lightColor: string) => `dark_${lightColor}`,
            generateColorKey: defaultGenerateColorKey,
            knownColors: {},
        } as any;

        borderFormatHandler.apply(format, th, context);

        expect(th.outerHTML).toEqual('<th style="border-bottom: 2px dotted blue;"></th>');
        expect(context.darkColorHandler!.updateKnownColor).toHaveBeenCalledWith(
            false,
            '--darkColor_blue',
            {
                lightModeColor: 'blue',
                darkModeColor: 'dark_blue',
            }
        );
    });

    it('Has multiple border colors in dark mode - apply', () => {
        const td = document.createElement('td');
        format.borderTop = '1px solid red';
        format.borderRight = '2px dashed green';
        format.borderBottom = '3px double blue';
        format.borderLeft = '1px solid yellow';
        context.isDarkMode = true;
        context.darkColorHandler = {
            updateKnownColor: jasmine.createSpy('updateKnownColor'),
            getDarkColor: (lightColor: string) => `dark_${lightColor}`,
            generateColorKey: defaultGenerateColorKey,
            knownColors: {},
        } as any;

        borderFormatHandler.apply(format, td, context);

        expect(td.outerHTML).toEqual(
            '<td style="border-top: 1px solid var(--darkColor_red, red); border-right: 2px dashed var(--darkColor_green, green); border-bottom: 3px double var(--darkColor_blue, blue); border-left: 1px solid var(--darkColor_yellow, yellow);"></td>'
        );
    });

    it('Has border without color in dark mode - apply', () => {
        const th = document.createElement('th');
        format.borderTop = '1px solid';
        context.isDarkMode = true;
        context.darkColorHandler = {
            updateKnownColor: jasmine.createSpy('updateKnownColor'),
            getDarkColor: (lightColor: string) => `dark_${lightColor}`,
            generateColorKey: defaultGenerateColorKey,
            knownColors: {},
        } as any;

        borderFormatHandler.apply(format, th, context);

        expect(th.outerHTML).toEqual('<th style="border-top: 1px solid;"></th>');
        expect(context.darkColorHandler!.updateKnownColor).not.toHaveBeenCalled();
    });

    it('Has border with existing CSS variable in dark mode - apply', () => {
        const td = document.createElement('td');
        format.borderTop = '1px solid red';
        context.isDarkMode = true;
        context.darkColorHandler = {
            updateKnownColor: jasmine.createSpy('updateKnownColor'),
            getDarkColor: (lightColor: string) => `dark_${lightColor}`,
            generateColorKey: defaultGenerateColorKey,
            knownColors: {
                '--darkColor_red': {
                    lightModeColor: 'red',
                    darkModeColor: 'rgb(200, 50, 50)',
                },
            },
        } as any;

        borderFormatHandler.apply(format, td, context);

        expect(td.outerHTML).toEqual(
            '<td style="border-top: 1px solid var(--darkColor_red, red);"></td>'
        );
        expect(context.darkColorHandler!.updateKnownColor).toHaveBeenCalledWith(
            true,
            '--darkColor_red',
            {
                lightModeColor: 'red',
                darkModeColor: 'rgb(200, 50, 50)',
            }
        );
    });
});
