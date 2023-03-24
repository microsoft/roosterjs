import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { DirectionFormat } from '../../../lib/publicTypes/format/formatParts/DirectionFormat';
import { directionFormatHandler } from '../../../lib/formatHandlers/block/directionFormatHandler';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';

describe('directionFormatHandler.parse', () => {
    let div: HTMLElement;
    let li: HTMLLIElement;
    let format: DirectionFormat;
    let context: DomToModelContext;

    beforeEach(() => {
        div = document.createElement('div');
        li = document.createElement('li');
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
        expect(format.isTextAlignFromAttr).toBe(expectedIsAlignFromAttr);
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
    let li: HTMLLIElement;
    let format: DirectionFormat;
    let context: ModelToDomContext;

    beforeEach(() => {
        div = document.createElement('div');
        li = document.createElement('li');
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

    it('Align right in attr', () => {
        format.textAlign = 'end';
        format.isTextAlignFromAttr = true;
        directionFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div align="right"></div>');
    });

    it('Align start - list', () => {
        format.textAlign = 'start';
        directionFormatHandler.apply(format, li, context);
        expect(li.outerHTML).toBe('<li style="align-self: start;"></li>');
    });

    it('Align center - list', () => {
        format.textAlign = 'center';
        directionFormatHandler.apply(format, li, context);
        expect(li.outerHTML).toBe('<li style="align-self: center;"></li>');
    });

    it('Align right - list', () => {
        format.textAlign = 'end';
        directionFormatHandler.apply(format, li, context);
        expect(li.outerHTML).toBe('<li style="align-self: end;"></li>');
    });
});
