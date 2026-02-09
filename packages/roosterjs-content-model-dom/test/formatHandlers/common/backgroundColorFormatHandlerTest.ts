import { backgroundColorFormatHandler } from '../../../lib/formatHandlers/common/backgroundColorFormatHandler';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { defaultGenerateColorKey, DeprecatedColors } from '../../../lib/formatHandlers/utils/color';
import { expectHtml } from '../../testUtils';
import {
    BackgroundColorFormat,
    DomToModelContext,
    ModelToDomContext,
    TextColorFormat,
} from 'roosterjs-content-model-types';

describe('backgroundColorFormatHandler.parse', () => {
    let div: HTMLElement;
    let context: DomToModelContext;
    let format: BackgroundColorFormat;

    beforeEach(() => {
        div = document.createElement('div');
        context = createDomToModelContext();
        format = {};
    });

    it('No color', () => {
        backgroundColorFormatHandler.parse(format, div, context, {});

        expect(format.backgroundColor).toBeUndefined();
    });

    it('Simple css color', () => {
        div.style.backgroundColor = 'red';
        backgroundColorFormatHandler.parse(format, div, context, {});

        expect(format.backgroundColor).toBe('red');
    });

    it('Transparent', () => {
        div.style.backgroundColor = 'transparent';
        backgroundColorFormatHandler.parse(format, div, context, {});

        expect(format.backgroundColor).toBeUndefined();
    });

    it('Transparent, different with default value', () => {
        div.style.backgroundColor = 'transparent';
        backgroundColorFormatHandler.parse(format, div, context, { backgroundColor: 'red' });

        expect(format.backgroundColor).toBe('transparent');
    });

    it('Simple attribute color', () => {
        div.setAttribute('bgcolor', 'red');
        backgroundColorFormatHandler.parse(format, div, context, {});

        expect(format.backgroundColor).toBe('red');
    });

    it('Simple both css and attribute color', () => {
        div.style.backgroundColor = 'red';
        div.setAttribute('bgcolor', 'green');
        backgroundColorFormatHandler.parse(format, div, context, {});

        expect(format.backgroundColor).toBe('red');
    });

    it('Color from element overwrite default style', () => {
        div.style.backgroundColor = 'red';

        backgroundColorFormatHandler.parse(format, div, context, { color: 'green' });

        expect(format.backgroundColor).toBe('red');
    });

    DeprecatedColors.forEach(color => {
        it('Remove deprecated color ' + color, () => {
            div.style.backgroundColor = color;

            backgroundColorFormatHandler.parse(format, div, context, {});

            expect(format.backgroundColor).toBe(undefined);
        });
    });
});

describe('backgroundColorFormatHandler.apply', () => {
    let div: HTMLElement;
    let context: ModelToDomContext;
    let format: BackgroundColorFormat & TextColorFormat;

    beforeEach(() => {
        div = document.createElement('div');
        context = createModelToDomContext();

        format = {};
    });

    it('No color', () => {
        backgroundColorFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toBe('<div></div>');
    });

    it('Simple color', () => {
        format.backgroundColor = 'red';

        backgroundColorFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toBe('<div style="background-color: red;"></div>');
    });

    it('Simple color in dark mode', () => {
        format.backgroundColor = 'red';
        context.isDarkMode = true;
        context.darkColorHandler = {
            updateKnownColor: () => {},
            getDarkColor: (lightColor: string) => `var(--darkColor_${lightColor}, ${lightColor})`,
            generateColorKey: defaultGenerateColorKey,
        } as any;

        backgroundColorFormatHandler.apply(format, div, context);

        const expectedResult = ['<div style="background-color: var(--darkColor_red, red);"></div>'];

        expectHtml(div.outerHTML, expectedResult);
    });

    it('Has both text and background color in dark mode', () => {
        format.backgroundColor = 'red';
        format.textColor = 'green';
        context.isDarkMode = true;
        context.darkColorHandler = {
            updateKnownColor: () => {},
            getDarkColor: (lightColor: string) => `var(--darkColor_${lightColor}, ${lightColor})`,
            generateColorKey: defaultGenerateColorKey,
        } as any;

        backgroundColorFormatHandler.apply(format, div, context);

        const expectedResult = [
            '<div style="background-color: var(--darkColor_red_green, red);"></div>',
        ];

        expectHtml(div.outerHTML, expectedResult);
    });
});
