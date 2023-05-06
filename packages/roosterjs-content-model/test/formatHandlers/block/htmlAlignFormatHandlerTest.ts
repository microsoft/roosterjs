import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { HtmlAlignFormat } from '../../../lib/publicTypes/format/formatParts/HtmlAlignFormat';
import { htmlAlignFormatHandler } from '../../../lib/formatHandlers/block/htmlAlignFormatHandler';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';
import { TextAlignFormat } from '../../../lib/publicTypes/format/formatParts/TextAlignFormat';

describe('htmlAlignFormatHandler.parse', () => {
    let div: HTMLElement;
    let format: HtmlAlignFormat & TextAlignFormat;
    let context: DomToModelContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createDomToModelContext();
    });

    function runTest(
        element: HTMLElement,
        htmlAlignValue: string | null,
        directionCssValue: string | null,
        directionAttrValue: string | null,
        expectedHtmlAlignValue: 'start' | 'center' | 'end' | 'justify' | 'initial' | undefined
    ) {
        if (htmlAlignValue) {
            element.setAttribute('align', htmlAlignValue);
        }

        if (directionCssValue) {
            element.style.direction = directionCssValue;
        }

        if (directionAttrValue) {
            element.setAttribute('dir', directionAttrValue);
        }

        htmlAlignFormatHandler.parse(format, element, context, {});

        expect(format.htmlAlign).toBe(expectedHtmlAlignValue);
    }

    it('No alignment, no direction', () => {
        htmlAlignFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({});
    });

    it('Align in attribute', () => {
        runTest(div, 'left', null, null, 'start');
    });

    it('LTR', () => {
        runTest(div, 'left', null, null, 'start');
        runTest(div, 'center', null, null, 'center');
        runTest(div, 'right', null, null, 'end');
        runTest(div, 'start', null, null, 'start');
        runTest(div, 'end', null, null, 'end');
    });

    it('RTL', () => {
        context.blockFormat.direction = 'rtl';
        runTest(div, 'left', 'rtl', null, 'end');
        runTest(div, 'center', 'rtl', null, 'center');
        runTest(div, 'right', 'rtl', null, 'start');
        runTest(div, 'start', 'rtl', null, 'start');
        runTest(div, 'end', 'rtl', null, 'end');
    });

    it('Align=justify', () => {
        runTest(div, 'justify', null, null, 'justify');
    });

    it('Html align override existing text align', () => {
        context.blockFormat.textAlign = 'center';
        format.textAlign = 'end';
        runTest(div, 'left', null, null, 'start');
        expect(context.blockFormat).toEqual({});
        expect(format).toEqual({
            htmlAlign: 'start',
        });
    });
});

describe('htmlAlignFormatHandler.apply', () => {
    let div: HTMLElement;
    let format: HtmlAlignFormat;
    let context: ModelToDomContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createModelToDomContext();
    });

    it('No alignment and direction', () => {
        htmlAlignFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div></div>');
    });

    it('Align right in attr', () => {
        format.htmlAlign = 'start';
        htmlAlignFormatHandler.apply(format, div, context);

        const result = ['<div align="left"></div>'];
        expect(result.indexOf(div.outerHTML) >= 0).toBeTrue();
    });

    it('Align justify', () => {
        format.htmlAlign = 'justify';
        htmlAlignFormatHandler.apply(format, div, context);

        const result = ['<div align="justify"></div>'];
        expect(result.indexOf(div.outerHTML) >= 0).toBeTrue();
    });
});
