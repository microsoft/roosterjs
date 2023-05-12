import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';
import { WordBreakFormat } from '../../../lib/publicTypes/format/formatParts/WordBreakFormat';
import { wordBreakFormatHandler } from '../../../lib/formatHandlers/common/wordBreakFormatHandler';

describe('wordBreakFormatHandler.parse', () => {
    let div: HTMLElement;
    let format: WordBreakFormat;
    let context: DomToModelContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createDomToModelContext();
    });

    it('No word break', () => {
        wordBreakFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({});
    });

    it('Has word break', () => {
        div.style.wordBreak = 'break-word';
        wordBreakFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({ wordBreak: 'break-word' });
    });
});

describe('wordBreakFormatHandler.apply', () => {
    let div: HTMLElement;
    let format: WordBreakFormat;
    let context: ModelToDomContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createModelToDomContext();
    });

    it('No word break', () => {
        wordBreakFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div></div>');
    });

    it('Has word-break', () => {
        format.wordBreak = 'break-word';
        wordBreakFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div style="word-break: break-word;"></div>');
    });
});
