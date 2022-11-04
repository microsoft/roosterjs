import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { DisplayFormat } from '../../../lib/publicTypes/format/formatParts/DisplayFormat';
import { displayFormatHandler } from '../../../lib/formatHandlers/block/displayFormatHandler';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';

describe('displayFormatHandler.parse', () => {
    let div: HTMLElement;
    let format: DisplayFormat;
    let context: DomToModelContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createDomToModelContext();
    });

    it('No display', () => {
        displayFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({});
    });

    it('Display: block', () => {
        div.style.display = 'block';
        displayFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({
            display: 'block',
        });
    });
});

describe('displayFormatHandler.apply', () => {
    let div: HTMLElement;
    let format: DisplayFormat;
    let context: ModelToDomContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createModelToDomContext();
    });

    it('No display', () => {
        displayFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div></div>');
    });

    it('Display: block', () => {
        format.display = 'block';
        displayFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div style="display: block;"></div>');
    });
});
