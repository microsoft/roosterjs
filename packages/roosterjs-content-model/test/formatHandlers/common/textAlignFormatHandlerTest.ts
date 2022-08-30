import { ContentModelContext } from '../../../lib/publicTypes/ContentModelContext';
import { TextAlignFormat } from '../../../lib/publicTypes/format/formatParts/TextAlignFormat';
import { textAlignFormatHandler } from '../../../lib/formatHandlers/common/textAlignFormatHandler';

describe('textAlignFormatHandler.parse', () => {
    let div: HTMLElement;
    let format: TextAlignFormat;
    let context: ContentModelContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = {
            isDarkMode: false,
            zoomScale: 1,
            isRightToLeft: false,
        };
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

        textAlignFormatHandler.parse(format, div, context);

        expect(format).toEqual({
            textAlign: expectedValue,
        });
    }

    it('No alignment', () => {
        textAlignFormatHandler.parse(format, div, context);
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

describe('textAlignFormatHandler.apply', () => {
    let div: HTMLElement;
    let format: TextAlignFormat;
    let context: ContentModelContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = {
            isDarkMode: false,
            zoomScale: 1,
            isRightToLeft: false,
        };
    });

    it('No alignment', () => {
        textAlignFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div></div>');
    });

    it('LTR start', () => {
        format.textAlign = 'start';
        textAlignFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div style="text-align: left;"></div>');
    });

    it('LTR end', () => {
        format.textAlign = 'end';
        textAlignFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div style="text-align: right;"></div>');
    });

    it('RTL start', () => {
        context.isRightToLeft = true;
        format.textAlign = 'start';
        textAlignFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div style="text-align: right;"></div>');
    });

    it('RTL end', () => {
        context.isRightToLeft = true;
        format.textAlign = 'end';
        textAlignFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div style="text-align: left;"></div>');
    });

    it('Center', () => {
        format.textAlign = 'center';
        textAlignFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div style="text-align: center;"></div>');
    });
});
