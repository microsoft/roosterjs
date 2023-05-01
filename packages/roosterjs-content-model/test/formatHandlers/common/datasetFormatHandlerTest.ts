import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { DatasetFormat } from '../../../lib/publicTypes/format/formatParts/DatasetFormat';
import { datasetFormatHandler } from '../../../lib/formatHandlers/common/datasetFormatHandler';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';

describe('datasetFormatHandler.parse', () => {
    let div: HTMLElement;
    let format: DatasetFormat;
    let context: DomToModelContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createDomToModelContext();
    });

    it('No dataset', () => {
        datasetFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({});
    });

    it('Has datasets', () => {
        div.dataset.a = 'b';
        div.dataset.c = 'd';
        datasetFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({
            a: 'b',
            c: 'd',
        });
    });
});

describe('datasetFormatHandler.apply', () => {
    let div: HTMLElement;
    let format: DatasetFormat;
    let context: ModelToDomContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createModelToDomContext();
    });

    it('No dataset', () => {
        datasetFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div></div>');
    });

    it('Has dataset', () => {
        format.a = 'b';
        format.c = 'd';
        datasetFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div data-a="b" data-c="d"></div>');
    });
});
