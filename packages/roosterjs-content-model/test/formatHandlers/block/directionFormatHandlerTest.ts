import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { DirectionFormat } from '../../../lib/publicTypes/format/formatParts/DirectionFormat';
import { directionFormatHandler } from '../../../lib/formatHandlers/block/directionFormatHandler';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';

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
        textAlignCssValue: string | null,
        textAlignAttrValue: string | null,
        directionCssValue: string | null,
        directionAttrVAlue: string | null,
        expectedAlignValue: 'start' | 'center' | 'end' | undefined,
        expectedDirectionValue: 'ltr' | 'rtl' | undefined
    ) {
        if (textAlignCssValue) {
            div.style.textAlign = textAlignCssValue;
        }

        if (textAlignAttrValue) {
            div.setAttribute('align', textAlignAttrValue);
        }

        if (directionCssValue) {
            div.style.direction = directionCssValue;
        }

        if (directionAttrVAlue) {
            div.setAttribute('dir', directionAttrVAlue);
        }

        directionFormatHandler.parse(format, div, context, {});

        expect(format.textAlign).toBe(expectedAlignValue);
        expect(format.direction).toBe(expectedDirectionValue);
    }

    it('No alignment, no direction', () => {
        directionFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({});
    });

    it('Direction in CSS', () => {
        runTest(null, null, 'rtl', null, undefined, 'rtl');
    });

    it('Direction in attribute', () => {
        runTest(null, null, null, 'rtl', undefined, 'rtl');
    });

    it('Direction in both', () => {
        runTest(null, null, 'ltr', 'rtl', undefined, 'ltr');
    });

    it('Align in CSS', () => {
        runTest('left', null, null, null, 'start', undefined);
    });

    it('Align in attribute', () => {
        runTest(null, 'left', null, null, 'start', undefined);
    });

    it('Align in both CSS and attribute', () => {
        runTest('left', 'right', null, null, 'start', undefined);
    });

    it('LTR', () => {
        runTest('left', null, null, null, 'start', undefined);
        runTest('center', null, null, null, 'center', undefined);
        runTest('right', null, null, null, 'end', undefined);
        runTest('start', null, null, null, 'start', undefined);
        runTest('end', null, null, null, 'end', undefined);
    });

    it('RTL', () => {
        context.isRightToLeft = true;

        runTest('left', null, 'rtl', null, 'end', 'rtl');
        runTest('center', null, 'rtl', null, 'center', 'rtl');
        runTest('right', null, 'rtl', null, 'start', 'rtl');
        runTest('start', null, 'rtl', null, 'start', 'rtl');
        runTest('end', null, 'rtl', null, 'end', 'rtl');
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

    it('No direction start', () => {
        format.textAlign = 'start';
        directionFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div style="text-align: left;"></div>');
    });

    it('LTR start', () => {
        format.textAlign = 'start';
        format.direction = 'ltr';
        directionFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div style="direction: ltr; text-align: left;"></div>');
    });

    it('LTR end', () => {
        format.textAlign = 'end';
        format.direction = 'ltr';
        directionFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div style="direction: ltr; text-align: right;"></div>');
    });

    it('RTL start', () => {
        format.textAlign = 'start';
        format.direction = 'rtl';
        directionFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div style="direction: rtl; text-align: right;"></div>');
    });

    it('RTL end', () => {
        format.textAlign = 'end';
        format.direction = 'rtl';
        directionFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div style="direction: rtl; text-align: left;"></div>');
    });

    it('Center', () => {
        format.textAlign = 'center';
        directionFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div style="text-align: center;"></div>');
    });
});
