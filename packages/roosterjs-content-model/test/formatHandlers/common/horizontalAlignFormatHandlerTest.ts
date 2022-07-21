import { createFormatContext } from '../../../lib/formatHandlers/createFormatContext';
import { FormatContext } from '../../../lib/formatHandlers/FormatContext';
import { HorizontalAlignFormat } from '../../../lib/publicTypes/format/formatParts/HorizontalAlignFormat';
import { horizontalAlignFormatHandler } from '../../../lib/formatHandlers/common/horizontalAlignFormatHandler';

describe('horizontalAlignFormatHandler.parse', () => {
    let div: HTMLElement;
    let format: HorizontalAlignFormat;
    let context: FormatContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createFormatContext();
    });

    function runTest(
        cssValue: string | null,
        attrValue: string | null,
        expectedValue: 'start' | 'center' | 'end'
    ) {
        if (cssValue) {
            div.style.textAlign = cssValue;
        }

        if (attrValue) {
            div.setAttribute('align', attrValue);
        }

        horizontalAlignFormatHandler.parse(format, div, context);

        expect(format).toEqual({
            horizontalAlign: expectedValue,
        });
    }

    it('No alignment', () => {
        horizontalAlignFormatHandler.parse(format, div, context);
        expect(format).toEqual({});
    });

    it('Align in CSS', () => {
        runTest('left', null, 'start');
    });

    it('Align in attribute', () => {
        runTest(null, 'left', 'start');
    });

    it('Align in both CSS and attribute', () => {
        runTest('left', 'right', 'start');
    });

    it('LTR', () => {
        runTest('left', null, 'start');
        runTest('center', null, 'center');
        runTest('right', null, 'end');
        runTest('start', null, 'start');
        runTest('end', null, 'end');
    });

    it('RTL', () => {
        context.isRightToLeft = true;

        runTest('left', null, 'end');
        runTest('center', null, 'center');
        runTest('right', null, 'start');
        runTest('start', null, 'start');
        runTest('end', null, 'end');
    });
});

describe('horizontalAlignFormatHandler.apply', () => {
    let div: HTMLElement;
    let format: HorizontalAlignFormat;
    let context: FormatContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createFormatContext();
    });

    it('No alignment', () => {
        horizontalAlignFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div></div>');
    });

    it('LTR start', () => {
        format.horizontalAlign = 'start';
        horizontalAlignFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div style="text-align: left;"></div>');
    });

    it('LTR end', () => {
        format.horizontalAlign = 'end';
        horizontalAlignFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div style="text-align: right;"></div>');
    });

    it('RTL start', () => {
        context.isRightToLeft = true;
        format.horizontalAlign = 'start';
        horizontalAlignFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div style="text-align: right;"></div>');
    });

    it('RTL end', () => {
        context.isRightToLeft = true;
        format.horizontalAlign = 'end';
        horizontalAlignFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div style="text-align: left;"></div>');
    });

    it('Center', () => {
        format.horizontalAlign = 'center';
        horizontalAlignFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div style="text-align: center;"></div>');
    });
});
