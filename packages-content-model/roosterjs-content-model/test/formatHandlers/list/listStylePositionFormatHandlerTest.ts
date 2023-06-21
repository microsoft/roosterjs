import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { listStylePositionFormatHandler } from '../../../lib/formatHandlers/list/listStylePositionFormatHandler';
import {
    DomToModelContext,
    ListStylePositionFormat,
    ModelToDomContext,
} from 'roosterjs-content-model-types';

describe('listStylePositionFormatHandler.parse', () => {
    let div: HTMLElement;
    let context: DomToModelContext;
    let format: ListStylePositionFormat;

    beforeEach(() => {
        div = document.createElement('div');
        context = createDomToModelContext();
        format = {};
    });

    it('Not format', () => {
        listStylePositionFormatHandler.parse(format, div, context, {});

        expect(format.listStylePosition).toBeUndefined();
    });

    it('with letter spacing', () => {
        div.style.listStylePosition = 'inside';
        listStylePositionFormatHandler.parse(format, div, context, {});

        expect(format.listStylePosition).toBe('inside');
    });
});

describe('listStylePositionFormatHandler.apply', () => {
    let div: HTMLElement;
    let format: ListStylePositionFormat;
    let context: ModelToDomContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createModelToDomContext();
    });

    it('no format', () => {
        listStylePositionFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div></div>');
    });

    it('with value', () => {
        format.listStylePosition = 'inside';

        listStylePositionFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div style="list-style-position: inside;"></div>');
    });
});
