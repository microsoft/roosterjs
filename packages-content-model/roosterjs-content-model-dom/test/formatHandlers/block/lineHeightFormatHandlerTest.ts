import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { lineHeightFormatHandler } from '../../../lib/formatHandlers/block/lineHeightFormatHandler';
import {
    DomToModelContext,
    LineHeightFormat,
    ModelToDomContext,
} from 'roosterjs-content-model-types';

describe('lineHeightFormatHandler.parse', () => {
    let div: HTMLElement;
    let format: LineHeightFormat;
    let context: DomToModelContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createDomToModelContext();
    });

    it('No line height', () => {
        lineHeightFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({});
    });

    it('Line height: 50px', () => {
        div.style.lineHeight = '50px';
        lineHeightFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({
            lineHeight: '50px',
        });
    });
});

describe('lineHeightFormatHandler.apply', () => {
    let div: HTMLElement;
    let format: LineHeightFormat;
    let context: ModelToDomContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createModelToDomContext();
    });

    it('No line height', () => {
        lineHeightFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div></div>');
    });

    it('Line height: 50px', () => {
        format.lineHeight = '50px';
        lineHeightFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div style="line-height: 50px;"></div>');
    });
});
