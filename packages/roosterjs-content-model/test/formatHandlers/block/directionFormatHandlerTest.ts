import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { DirectionFormat } from '../../../lib/publicTypes/format/formatParts/DirectionFormat';
import { directionFormatHandler } from '../../../lib/formatHandlers/block/directionFormatHandler';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { getDefaultStyle } from '../../../lib/domToModel/utils/getDefaultStyle';
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
        textAlignValue: string | null,
        htmlAlignValue: string | null,
        directionCssValue: string | null,
        directionAttrValue: string | null,
        expectedTextAlignValue: 'start' | 'center' | 'end' | 'justify' | 'initial' | undefined,
        expectedDirectionValue: 'ltr' | 'rtl' | undefined,
        expectedHtmlAlignValue: 'start' | 'center' | 'end' | 'justify' | 'initial' | undefined
    ) {
        if (textAlignValue && element.tagName !== 'li') {
            element.style.textAlign = textAlignValue;
        }

        if (textAlignValue && element.tagName === 'li') {
            element.style.alignSelf = textAlignValue;
            element.style.display = 'flex';
            element.style.flexDirection = 'column';
        }

        if (htmlAlignValue) {
            element.setAttribute('align', htmlAlignValue);
        }

        if (directionCssValue) {
            element.style.direction = directionCssValue;
        }

        if (directionAttrValue) {
            element.setAttribute('dir', directionAttrValue);
        }

        directionFormatHandler.parse(format, element, context, {});

        expect(format.textAlign).toBe(expectedTextAlignValue);
        expect(format.direction).toBe(expectedDirectionValue);
        expect(format.htmlAlign).toBe(expectedHtmlAlignValue);
    }

    it('No alignment, no direction', () => {
        directionFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({});
    });

    it('Direction in CSS', () => {
        runTest(div, null, null, 'rtl', null, undefined, 'rtl', undefined);
    });

    it('Direction in attribute', () => {
        runTest(div, null, null, null, 'rtl', undefined, 'rtl', undefined);
    });

    it('Direction in both', () => {
        runTest(div, null, null, 'ltr', 'rtl', undefined, 'ltr', undefined);
    });

    it('Align in CSS', () => {
        runTest(div, 'left', null, null, null, 'start', undefined, undefined);
    });

    it('Align in CSS - list', () => {
        runTest(li, 'start', null, null, null, 'start', undefined, undefined);
    });

    it('Align in attribute', () => {
        runTest(div, null, 'left', null, null, undefined, undefined, 'start');
    });

    it('Align in both CSS and attribute', () => {
        runTest(div, 'left', 'right', null, null, 'start', undefined, 'end');
    });

    it('LTR', () => {
        runTest(div, 'left', null, null, null, 'start', undefined, undefined);
        runTest(div, 'center', null, null, null, 'center', undefined, undefined);
        runTest(div, 'right', null, null, null, 'end', undefined, undefined);
        runTest(div, 'start', null, null, null, 'start', undefined, undefined);
        runTest(div, 'end', null, null, null, 'end', undefined, undefined);
    });

    it('RTL', () => {
        context.blockFormat.direction = 'rtl';
        runTest(div, 'left', null, 'rtl', null, 'end', 'rtl', undefined);
        runTest(div, 'center', null, 'rtl', null, 'center', 'rtl', undefined);
        runTest(div, 'right', null, 'rtl', null, 'start', 'rtl', undefined);
        runTest(div, 'start', null, 'rtl', null, 'start', 'rtl', undefined);
        runTest(div, 'end', null, 'rtl', null, 'end', 'rtl', undefined);
    });

    it('Center tag', () => {
        const center = document.createElement('center');
        const defaultStyle = getDefaultStyle(center, context);

        directionFormatHandler.parse(format, center, context, defaultStyle);

        expect(format).toEqual({
            textAlign: 'center',
        });
    });

    it('Align in HTML attr, overwrite textAlign from format', () => {
        format.textAlign = 'center';

        runTest(div, null, 'right', null, null, undefined, undefined, 'end');
    });

    it('Align=justify', () => {
        runTest(div, 'justify', null, null, null, 'justify', undefined, undefined);
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
        format.htmlAlign = 'start';
        directionFormatHandler.apply(format, div, context);

        const result = [
            '<div align="left" style="text-align: right;"></div>',
            '<div style="text-align: right;" align="left"></div>',
        ];
        expect(result.indexOf(div.outerHTML) >= 0).toBeTrue();
    });

    it('Align start - list', () => {
        format.textAlign = 'start';
        directionFormatHandler.apply(format, li, context);
        expect(li.outerHTML).toBe('<li style="text-align: left;"></li>');
    });

    it('Align center - list', () => {
        format.textAlign = 'center';
        directionFormatHandler.apply(format, li, context);
        expect(li.outerHTML).toBe('<li style="text-align: center;"></li>');
    });

    it('Align right - list', () => {
        format.textAlign = 'end';
        directionFormatHandler.apply(format, li, context);
        expect(li.outerHTML).toBe('<li style="text-align: right;"></li>');
    });

    it('Align start - list with OL parent', () => {
        const ol = document.createElement('ol');
        ol.appendChild(li);

        format.textAlign = 'start';
        directionFormatHandler.apply(format, li, context);
        expect(ol.outerHTML).toBe(
            '<ol style="flex-direction: column; display: flex;"><li style="align-self: start;"></li></ol>'
        );
    });

    it('Align center - list with OL parent', () => {
        const ol = document.createElement('ol');
        ol.appendChild(li);
        format.textAlign = 'center';
        directionFormatHandler.apply(format, li, context);
        expect(ol.outerHTML).toBe(
            '<ol style="flex-direction: column; display: flex;"><li style="align-self: center;"></li></ol>'
        );
    });

    it('Align right - list with OL parent', () => {
        const ol = document.createElement('ol');
        ol.appendChild(li);

        format.textAlign = 'end';
        directionFormatHandler.apply(format, li, context);
        expect(ol.outerHTML).toBe(
            '<ol style="flex-direction: column; display: flex;"><li style="align-self: end;"></li></ol>'
        );
    });

    it('Align justify', () => {
        format.textAlign = 'justify';
        directionFormatHandler.apply(format, div, context);

        const result = ['<div style="text-align: justify;"></div>'];
        expect(result.indexOf(div.outerHTML) >= 0).toBeTrue();
    });
});
