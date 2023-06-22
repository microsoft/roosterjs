import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { whiteSpaceFormatHandler } from '../../../lib/formatHandlers/block/whiteSpaceFormatHandler';
import {
    DomToModelContext,
    ModelToDomContext,
    WhiteSpaceFormat,
} from 'roosterjs-content-model-types';

describe('whiteSpaceFormatHandler.parse', () => {
    let div: HTMLElement;
    let format: WhiteSpaceFormat;
    let context: DomToModelContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createDomToModelContext();
    });

    it('No white space', () => {
        whiteSpaceFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({});
    });

    it('White space from CSS', () => {
        div.style.whiteSpace = 'pre';
        whiteSpaceFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({
            whiteSpace: 'pre',
        });
    });

    it('White space from default style', () => {
        whiteSpaceFormatHandler.parse(format, div, context, {
            whiteSpace: 'nowrap',
        });
        expect(format).toEqual({
            whiteSpace: 'nowrap',
        });
    });

    it('White space from both CSs and default style', () => {
        div.style.whiteSpace = 'pre';
        whiteSpaceFormatHandler.parse(format, div, context, {
            whiteSpace: 'nowrap',
        });
        expect(format).toEqual({
            whiteSpace: 'pre',
        });
    });
});

describe('whiteSpaceFormatHandler.apply', () => {
    let div: HTMLElement;
    let container: HTMLElement;
    let format: WhiteSpaceFormat;
    let context: ModelToDomContext;

    beforeEach(() => {
        container = document.createElement('div');
        div = document.createElement('div');
        container.appendChild(div);

        format = {};
        context = createModelToDomContext();
    });

    it('No white space', () => {
        whiteSpaceFormatHandler.apply(format, div, context);
        expect(container.innerHTML).toBe('<div></div>');
    });

    it('Has white space: pre', () => {
        format.whiteSpace = 'pre';
        whiteSpaceFormatHandler.apply(format, div, context);
        expect(container.innerHTML).toBe('<div style="white-space: pre;"></div>');
    });

    it('Has white space: pre-wrap', () => {
        format.whiteSpace = 'pre-wrap';
        whiteSpaceFormatHandler.apply(format, div, context);
        expect(container.innerHTML).toBe('<div style="white-space: pre-wrap;"></div>');
    });

    it('Has white space in implicit format', () => {
        format.whiteSpace = 'pre';
        context.implicitFormat.whiteSpace = 'pre';
        whiteSpaceFormatHandler.apply(format, div, context);
        expect(container.innerHTML).toBe('<div></div>');
    });

    it('Has different white space from implicit format', () => {
        format.whiteSpace = 'pre';
        context.implicitFormat.whiteSpace = 'pre-wrap';
        whiteSpaceFormatHandler.apply(format, div, context);
        expect(container.innerHTML).toBe('<div style="white-space: pre;"></div>');
    });
});
