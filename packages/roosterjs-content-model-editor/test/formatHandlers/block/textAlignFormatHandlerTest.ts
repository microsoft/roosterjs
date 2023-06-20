import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { DirectionFormat } from '../../../lib/publicTypes/format/formatParts/DirectionFormat';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';
import { TextAlignFormat } from '../../../lib/publicTypes/format/formatParts/TextAlignFormat';
import { textAlignFormatHandler } from '../../../lib/formatHandlers/block/textAlignFormatHandler';

describe('textAlignFormatHandler.parse', () => {
    let div: HTMLElement;
    let li: HTMLLIElement;
    let format: TextAlignFormat & DirectionFormat;
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
        directionCssValue: string | null,
        directionAttrValue: string | null,
        expectedTextAlignValue: 'start' | 'center' | 'end' | 'justify' | 'initial' | undefined,
        expectedDirectionValue: 'ltr' | 'rtl' | undefined
    ) {
        if (textAlignValue && element.tagName !== 'li') {
            element.style.textAlign = textAlignValue;
        }

        if (textAlignValue && element.tagName === 'li') {
            element.style.alignSelf = textAlignValue;
            element.style.display = 'flex';
            element.style.flexDirection = 'column';
        }

        if (directionCssValue) {
            element.style.direction = directionCssValue;
        }

        if (directionAttrValue) {
            element.setAttribute('dir', directionAttrValue);
        }

        textAlignFormatHandler.parse(format, element, context, {});

        expect(format.textAlign).toBe(expectedTextAlignValue);
        expect(format.direction).toBe(expectedDirectionValue);
    }

    it('No alignment, no direction', () => {
        textAlignFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({});
    });

    it('Align in CSS', () => {
        runTest(div, 'left', null, null, 'start', undefined);
    });

    it('Align in CSS - list', () => {
        runTest(li, 'start', null, null, 'start', undefined);
    });

    it('Align in both CSS and attribute', () => {
        runTest(div, 'left', null, null, 'start', undefined);
    });

    it('LTR', () => {
        runTest(div, 'left', null, null, 'start', undefined);
        runTest(div, 'center', null, null, 'center', undefined);
        runTest(div, 'right', null, null, 'end', undefined);
        runTest(div, 'start', null, null, 'start', undefined);
        runTest(div, 'end', null, null, 'end', undefined);
    });

    it('RTL', () => {
        context.blockFormat.direction = 'rtl';
        runTest(div, 'left', null, 'rtl', 'end', 'rtl');
        runTest(div, 'center', null, 'rtl', 'center', 'rtl');
        runTest(div, 'right', null, 'rtl', 'start', 'rtl');
        runTest(div, 'start', null, 'rtl', 'start', 'rtl');
        runTest(div, 'end', null, 'rtl', 'end', 'rtl');
    });

    it('Align=justify', () => {
        runTest(div, 'justify', null, null, 'justify', undefined);
    });
});

describe('textAlignFormatHandler.apply', () => {
    let div: HTMLElement;
    let li: HTMLLIElement;
    let format: TextAlignFormat & DirectionFormat;
    let context: ModelToDomContext;

    beforeEach(() => {
        div = document.createElement('div');
        li = document.createElement('li');
        format = {};
        context = createModelToDomContext();
    });

    it('No alignment and direction', () => {
        textAlignFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div></div>');
    });

    it('No direction start', () => {
        format.textAlign = 'start';
        textAlignFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div style="text-align: left;"></div>');
    });

    it('LTR start', () => {
        format.textAlign = 'start';
        format.direction = 'ltr';
        textAlignFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div style="text-align: left;"></div>');
    });

    it('LTR end', () => {
        format.textAlign = 'end';
        format.direction = 'ltr';
        textAlignFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div style="text-align: right;"></div>');
    });

    it('RTL start', () => {
        format.textAlign = 'start';
        format.direction = 'rtl';
        textAlignFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div style="text-align: right;"></div>');
    });

    it('RTL end', () => {
        format.textAlign = 'end';
        format.direction = 'rtl';
        textAlignFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div style="text-align: left;"></div>');
    });

    it('Center', () => {
        format.textAlign = 'center';
        textAlignFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div style="text-align: center;"></div>');
    });

    it('Align start - list', () => {
        format.textAlign = 'start';
        textAlignFormatHandler.apply(format, li, context);
        expect(li.outerHTML).toBe('<li style="text-align: left;"></li>');
    });

    it('Align center - list', () => {
        format.textAlign = 'center';
        textAlignFormatHandler.apply(format, li, context);
        expect(li.outerHTML).toBe('<li style="text-align: center;"></li>');
    });

    it('Align right - list', () => {
        format.textAlign = 'end';
        textAlignFormatHandler.apply(format, li, context);
        expect(li.outerHTML).toBe('<li style="text-align: right;"></li>');
    });

    it('Align start - list with OL parent', () => {
        const ol = document.createElement('ol');
        ol.appendChild(li);

        format.textAlign = 'start';
        textAlignFormatHandler.apply(format, li, context);
        expect(ol.outerHTML).toBe(
            '<ol style="flex-direction: column; display: flex;"><li style="align-self: start;"></li></ol>'
        );
    });

    it('Align center - list with OL parent', () => {
        const ol = document.createElement('ol');
        ol.appendChild(li);
        format.textAlign = 'center';
        textAlignFormatHandler.apply(format, li, context);
        expect(ol.outerHTML).toBe(
            '<ol style="flex-direction: column; display: flex;"><li style="align-self: center;"></li></ol>'
        );
    });

    it('Align right - list with OL parent', () => {
        const ol = document.createElement('ol');
        ol.appendChild(li);

        format.textAlign = 'end';
        textAlignFormatHandler.apply(format, li, context);
        expect(ol.outerHTML).toBe(
            '<ol style="flex-direction: column; display: flex;"><li style="align-self: end;"></li></ol>'
        );
    });

    it('Align justify', () => {
        format.textAlign = 'justify';
        textAlignFormatHandler.apply(format, div, context);

        const result = ['<div style="text-align: justify;"></div>'];
        expect(result.indexOf(div.outerHTML) >= 0).toBeTrue();
    });
});
