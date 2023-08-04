import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { textIndentFormatHandler } from '../../../lib/formatHandlers/block/textIndentFormatHandler';
import {
    DomToModelContext,
    TextIndentFormat,
    ModelToDomContext,
} from 'roosterjs-content-model-types';

describe('textIndentFormatHandler.parse', () => {
    let div: HTMLElement;
    let format: TextIndentFormat;
    let context: DomToModelContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createDomToModelContext();
    });

    it('No text indent', () => {
        textIndentFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({});
    });

    it('textIndent: 50px', () => {
        div.style.textIndent = '50px';
        textIndentFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({
            textIndent: '50px',
        });
    });
});

describe('textIndentFormatHandler.apply', () => {
    let div: HTMLElement;
    let format: TextIndentFormat;
    let context: ModelToDomContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createModelToDomContext();
    });

    it('No textIndent', () => {
        textIndentFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div></div>');
    });

    it('Text indent: 50px', () => {
        format.textIndent = '50px';
        textIndentFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div style="text-indent: 50px;"></div>');
    });
});
