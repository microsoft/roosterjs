import { BulletListType, NumberingListType } from 'roosterjs-editor-types';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { listLevelMetadataFormatHandler } from '../../../lib/formatHandlers/list/listLevelMetadataFormatHandler';
import { ListMetadataFormat } from '../../../lib/publicTypes/format/formatParts/ListMetadataFormat';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';

describe('listLevelMetadataFormatHandler.parse', () => {
    let context: DomToModelContext;
    let format: ListMetadataFormat;

    beforeEach(() => {
        context = createDomToModelContext();
        format = {};
    });

    it('OL without list style type and metadata', () => {
        const ol = document.createElement('ol');

        listLevelMetadataFormatHandler.parse(format, ol, context, {});

        expect(format.orderedStyleType).toBeUndefined();
        expect(format.unorderedStyleType).toBeUndefined();
        expect(context.listFormat).toEqual({
            threadItemCounts: [],
            levels: [],
        });
    });

    it('OL with unrecognized list style type', () => {
        const ol = document.createElement('ol');

        ol.style.listStyleType = 'test';

        listLevelMetadataFormatHandler.parse(format, ol, context, {});

        expect(format.orderedStyleType).toBeUndefined();
        expect(format.unorderedStyleType).toBeUndefined();
        expect(context.listFormat).toEqual({
            threadItemCounts: [],
            levels: [],
        });
    });

    it('OL with valid recognized list style type', () => {
        const ol = document.createElement('ol');

        ol.style.listStyleType = 'decimal';

        listLevelMetadataFormatHandler.parse(format, ol, context, {});

        expect(format.orderedStyleType).toBe(NumberingListType.Decimal);
        expect(format.unorderedStyleType).toBeUndefined();
        expect(context.listFormat).toEqual({
            threadItemCounts: [],
            levels: [],
        });
    });

    it('OL with type attribute', () => {
        const ol = document.createElement('ol');

        ol.type = 'I';

        listLevelMetadataFormatHandler.parse(format, ol, context, {});

        expect(format.orderedStyleType).toBe(NumberingListType.UpperRoman);
        expect(format.unorderedStyleType).toBeUndefined();
        expect(context.listFormat).toEqual({
            threadItemCounts: [],
            levels: [],
        });
    });

    it('OL with type attribute and list-style-type', () => {
        const ol = document.createElement('ol');

        ol.style.listStyleType = 'lower-roman';
        ol.type = 'I';

        listLevelMetadataFormatHandler.parse(format, ol, context, {});

        expect(format.orderedStyleType).toBe(NumberingListType.LowerRoman);
        expect(format.unorderedStyleType).toBeUndefined();
        expect(context.listFormat).toEqual({
            threadItemCounts: [],
            levels: [],
        });
    });

    it('UL with valid list style type', () => {
        const ul = document.createElement('ul');

        ul.style.listStyleType = 'circle';

        listLevelMetadataFormatHandler.parse(format, ul, context, {});

        expect(format.orderedStyleType).toBeUndefined();
        expect(format.unorderedStyleType).toBe(BulletListType.Circle);
        expect(context.listFormat).toEqual({
            threadItemCounts: [],
            levels: [],
        });
    });
});

describe('listLevelMetadataFormatHandler.parse', () => {
    let context: ModelToDomContext;
    let format: ListMetadataFormat;
    beforeEach(() => {
        context = createModelToDomContext();
        format = {};
    });

    it('OL without format', () => {
        const ol = document.createElement('ol');

        listLevelMetadataFormatHandler.apply(format, ol, context);

        expect(ol.outerHTML).toBe('<ol></ol>');
    });

    it('OL with list style', () => {
        const ol = document.createElement('ol');

        format.orderedStyleType = NumberingListType.UpperAlpha;

        listLevelMetadataFormatHandler.apply(format, ol, context);

        expect(ol.outerHTML).toBe('<ol style="list-style-type: upper-alpha;"></ol>');
    });

    it('OL with complex list style', () => {
        const ol = document.createElement('ol');

        format.orderedStyleType = NumberingListType.UpperAlphaDash;

        listLevelMetadataFormatHandler.apply(format, ol, context);

        expect(ol.outerHTML).toBe('<ol></ol>');
    });
});
