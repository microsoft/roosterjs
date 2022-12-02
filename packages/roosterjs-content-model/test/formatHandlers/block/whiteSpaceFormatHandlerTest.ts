import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';
import { WhiteSpaceFormat } from '../../../lib/publicTypes/format/formatParts/WhiteSpaceFormat';
import { whiteSpaceFormatHandler } from '../../../lib/formatHandlers/block/whiteSpaceFormatHandler';

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
    let format: WhiteSpaceFormat;
    let context: ModelToDomContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createModelToDomContext();
    });

    it('No white space', () => {
        whiteSpaceFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div></div>');
    });

    it('Has white space', () => {
        format.whiteSpace = 'pre';
        whiteSpaceFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div style="white-space: pre;"></div>');
    });
});
