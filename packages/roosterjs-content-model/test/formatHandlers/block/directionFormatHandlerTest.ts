import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { DirectionFormat } from '../../../lib/publicTypes/format/formatParts/DirectionFormat';
import { directionFormatHandler } from '../../../lib/formatHandlers/block/directionFormatHandler';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { getDefaultStyle } from '../../../lib/domToModel/utils/getDefaultStyle';
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
        expectedDirectionValue: 'ltr' | 'rtl' | undefined,
        expectedIsAlignFromAttr: boolean | undefined
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
        expect(format.isTextAlignFromAttr).toBe(expectedIsAlignFromAttr);
    }

    function runTestAlignSelf(
        alignSelf: string | undefined,
        expectedAlignSelfValue: 'start' | 'center' | 'end' | undefined
    ) {
        if (alignSelf) {
            div.style.alignSelf = alignSelf;
        }
        directionFormatHandler.parse(format, div, context, {});
        expect(format.alignSelf).toBe(expectedAlignSelfValue);
    }

    it('No alignment, no direction', () => {
        directionFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({});
    });

    it('Direction in CSS', () => {
        runTest(null, null, 'rtl', null, undefined, 'rtl', undefined);
    });

    it('Direction in attribute', () => {
        runTest(null, null, null, 'rtl', undefined, 'rtl', undefined);
    });

    it('Direction in both', () => {
        runTest(null, null, 'ltr', 'rtl', undefined, 'ltr', undefined);
    });

    it('Align in CSS', () => {
        runTest('left', null, null, null, 'start', undefined, undefined);
    });

    it('Align in attribute', () => {
        runTest(null, 'left', null, null, 'start', undefined, true);
    });

    it('Align in both CSS and attribute', () => {
        runTest('left', 'right', null, null, 'start', undefined, undefined);
    });

    it('LTR', () => {
        runTest('left', null, null, null, 'start', undefined, undefined);
        runTest('center', null, null, null, 'center', undefined, undefined);
        runTest('right', null, null, null, 'end', undefined, undefined);
        runTest('start', null, null, null, 'start', undefined, undefined);
        runTest('end', null, null, null, 'end', undefined, undefined);
    });

    it('RTL', () => {
        context.blockFormat.direction = 'rtl';

        runTest('left', null, 'rtl', null, 'end', 'rtl', undefined);
        runTest('center', null, 'rtl', null, 'center', 'rtl', undefined);
        runTest('right', null, 'rtl', null, 'start', 'rtl', undefined);
        runTest('start', null, 'rtl', null, 'start', 'rtl', undefined);
        runTest('end', null, 'rtl', null, 'end', 'rtl', undefined);
    });

    it('Center tag', () => {
        const center = document.createElement('center');
        const defaultStyle = getDefaultStyle(center, context);

        directionFormatHandler.parse(format, center, context, defaultStyle);

        expect(format).toEqual({
            textAlign: 'center',
        });
    });

    it('AlignSelf', () => {
        runTestAlignSelf(undefined, undefined);
        runTestAlignSelf('start', 'start');
        runTestAlignSelf('end', 'end');
        runTestAlignSelf('center', 'center');
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

    it('Align right in attr', () => {
        format.textAlign = 'end';
        format.isTextAlignFromAttr = true;
        directionFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div align="right"></div>');
    });

    it(' Align Self start', () => {
        format.alignSelf = 'start';
        format.direction = 'ltr';
        directionFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div style="direction: ltr; align-self: start;"></div>');
    });

    it(' Align Self center', () => {
        format.alignSelf = 'center';
        format.direction = 'ltr';
        directionFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div style="direction: ltr; align-self: center;"></div>');
    });

    it(' Align Self end', () => {
        format.alignSelf = 'end';
        format.direction = 'ltr';
        directionFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div style="direction: ltr; align-self: end;"></div>');
    });
});
