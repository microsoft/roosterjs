import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { directionFormatHandler } from '../../../lib/formatHandlers/block/directionFormatHandler';
import {
    DirectionFormat,
    DomToModelContext,
    ModelToDomContext,
} from 'roosterjs-content-model-types';

describe('directionFormatHandler.parse', () => {
    let div: HTMLElement;
    let format: DirectionFormat;
    let context: DomToModelContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createDomToModelContext();
    });

    function runTest(
        element: HTMLElement,
        directionCssValue: string | null,
        directionAttrValue: string | null,
        expectedDirectionValue: 'ltr' | 'rtl' | undefined
    ) {
        if (directionCssValue) {
            element.style.direction = directionCssValue;
        }

        if (directionAttrValue) {
            element.setAttribute('dir', directionAttrValue);
        }

        directionFormatHandler.parse(format, element, context, {});

        expect(format.direction).toBe(expectedDirectionValue);
    }

    it('No alignment, no direction', () => {
        directionFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({});
    });

    it('Direction in CSS', () => {
        runTest(div, 'rtl', null, 'rtl');
    });

    it('Direction in attribute', () => {
        runTest(div, null, 'rtl', 'rtl');
    });

    it('Direction in both', () => {
        runTest(div, 'ltr', 'rtl', 'ltr');
    });

    it('Already has dir', () => {
        format.direction = 'rtl';
        runTest(div, 'ltr', null, 'ltr');
    });
});

describe('directionFormatHandler.apply', () => {
    let div: HTMLElement;
    let format: DirectionFormat;
    let context: ModelToDomContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createModelToDomContext();
    });

    it('No alignment and direction', () => {
        directionFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div></div>');
    });

    it('LTR start', () => {
        format.direction = 'ltr';
        directionFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div style="direction: ltr;"></div>');
    });

    it('RTL on table', () => {
        const table = document.createElement('table');
        format.direction = 'rtl';
        directionFormatHandler.apply(format, table, context);
        expect(table.outerHTML).toBe(
            '<table style="direction: rtl; justify-self: flex-end;"></table>'
        );
    });
});
