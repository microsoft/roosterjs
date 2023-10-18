import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { listStyleFormatHandler } from '../../../lib/formatHandlers/list/listStyleFormatHandler';
import {
    DomToModelContext,
    ListStyleFormat,
    ModelToDomContext,
} from 'roosterjs-content-model-types';

describe('listStyleFormatHandler.parse', () => {
    let div: HTMLElement;
    let context: DomToModelContext;
    let format: ListStyleFormat;

    beforeEach(() => {
        div = document.createElement('div');
        context = createDomToModelContext();
        format = {};
    });

    it('Not format', () => {
        listStyleFormatHandler.parse(format, div, context, {});

        expect(format.listStylePosition).toBeUndefined();
    });

    it('with list style position', () => {
        div.style.listStylePosition = 'inside';
        listStyleFormatHandler.parse(format, div, context, {});

        expect(format).toEqual({
            listStylePosition: 'inside',
        });
    });

    it('with list style type', () => {
        div.style.listStyleType = 'a';
        listStyleFormatHandler.parse(format, div, context, {});

        expect(format).toEqual({
            listStyleType: 'a',
        });
    });
});

describe('listStyleFormatHandler.apply', () => {
    let div: HTMLElement;
    let format: ListStyleFormat;
    let context: ModelToDomContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createModelToDomContext();
    });

    it('no format', () => {
        listStyleFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div></div>');
    });

    it('with value', () => {
        format.listStylePosition = 'inside';
        format.listStyleType = 'a';

        listStyleFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual(
            '<div style="list-style-position: inside; list-style-type: a;"></div>'
        );
    });
});
