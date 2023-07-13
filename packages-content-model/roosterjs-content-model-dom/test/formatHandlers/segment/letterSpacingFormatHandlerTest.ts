import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { letterSpacingFormatHandler } from '../../../lib/formatHandlers/segment/letterSpacingFormatHandler';
import {
    DomToModelContext,
    LetterSpacingFormat,
    ModelToDomContext,
} from 'roosterjs-content-model-types';

describe('letterSpacingFormatHandler.parse', () => {
    let div: HTMLElement;
    let context: DomToModelContext;
    let format: LetterSpacingFormat;

    beforeEach(() => {
        div = document.createElement('div');
        context = createDomToModelContext();
        format = {};
    });

    it('Not format', () => {
        letterSpacingFormatHandler.parse(format, div, context, {});

        expect(format.letterSpacing).toBeUndefined();
    });

    it('with letter spacing', () => {
        div.style.letterSpacing = '1em';
        letterSpacingFormatHandler.parse(format, div, context, {});

        expect(format.letterSpacing).toBe('1em');
    });
});

describe('letterSpacingFormatHandler.apply', () => {
    let div: HTMLElement;
    let format: LetterSpacingFormat;
    let context: ModelToDomContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createModelToDomContext();
    });

    it('no format', () => {
        letterSpacingFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div></div>');
    });

    it('with value', () => {
        format.letterSpacing = '1em';

        letterSpacingFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div style="letter-spacing: 1em;"></div>');
    });
});
