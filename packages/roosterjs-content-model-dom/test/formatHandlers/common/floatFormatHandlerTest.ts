import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { DomToModelContext, FloatFormat, ModelToDomContext } from 'roosterjs-content-model-types';
import { floatFormatHandler } from '../../../lib/formatHandlers/common/floatFormatHandler';

describe('floatFormatHandler.parse', () => {
    let div: HTMLElement;
    let format: FloatFormat;
    let context: DomToModelContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createDomToModelContext();
    });

    it('No float', () => {
        floatFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({});
    });

    it('Float left', () => {
        div.style.float = 'left';
        floatFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({
            float: 'left',
        });
    });

    it('Float left from attribute', () => {
        div.setAttribute('align', 'left');
        floatFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({
            float: 'left',
        });
    });
});

describe('floatFormatHandler.apply', () => {
    let div: HTMLElement;
    let format: FloatFormat;
    let context: ModelToDomContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createModelToDomContext();
    });

    it('No float', () => {
        floatFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div></div>');
    });

    it('Float: left', () => {
        format.float = 'left';
        floatFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div style="float: left;"></div>');
    });
});
