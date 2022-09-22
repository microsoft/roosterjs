import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { IdFormat } from '../../../lib/publicTypes/format/formatParts/IdFormat';
import { idFormatHandler } from '../../../lib/formatHandlers/common/idFormatHandler';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';

describe('idFormatHandler.parse', () => {
    let div: HTMLElement;
    let format: IdFormat;
    let context: DomToModelContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createDomToModelContext();
    });

    it('No id', () => {
        idFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({});
    });

    it('Has id', () => {
        div.id = 'test';
        idFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({ id: 'test' });
    });
});

describe('idFormatHandler.apply', () => {
    let div: HTMLElement;
    let format: IdFormat;
    let context: ModelToDomContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createModelToDomContext();
    });

    it('No id', () => {
        idFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div></div>');
    });

    it('Has id', () => {
        format.id = 'test';
        idFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div id="test"></div>');
    });
});
