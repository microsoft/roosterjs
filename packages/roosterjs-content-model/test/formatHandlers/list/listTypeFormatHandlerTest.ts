import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { ListTypeFormat } from '../../../lib/publicTypes/format/formatParts/ListTypeFormat';
import { listTypeFormatHandler } from '../../../lib/formatHandlers/list/listTypeFormatHandler';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';

describe('listTypeFormatHandler.parse', () => {
    let context: DomToModelContext;
    let format: ListTypeFormat;

    beforeEach(() => {
        context = createDomToModelContext();
        format = {};
    });

    it('OL', () => {
        const ol = document.createElement('ol');

        listTypeFormatHandler.parse(format, ol, context, {});

        expect(format.listType).toBe('OL');
    });

    it('UL', () => {
        const ul = document.createElement('ul');

        listTypeFormatHandler.parse(format, ul, context, {});

        expect(format.listType).toBe('UL');
    });

    it('Others', () => {
        const div = document.createElement('div');

        listTypeFormatHandler.parse(format, div, context, {});

        expect(format.listType).toBeUndefined();
    });
});

describe('listTypeFormatHandler.parse', () => {
    let context: ModelToDomContext;
    let format: ListTypeFormat;

    beforeEach(() => {
        context = createModelToDomContext();
        format = {};
    });

    it('NO OP', () => {
        const ol = document.createElement('ol');
        listTypeFormatHandler.apply(format, ol, context);

        expect(ol.outerHTML).toBe('<ol></ol>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [],
            nodeStack: [],
        });
    });
});
