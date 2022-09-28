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

    it('OL with valid metadata', () => {
        const ol = document.createElement('ol');

        ol.dataset.editingInfo = JSON.stringify({
            orderedStyleType: 1,
            unorderedStyleType: 2,
        });

        listLevelMetadataFormatHandler.parse(format, ol, context, {});

        expect(format.orderedStyleType).toBe(1);
        expect(format.unorderedStyleType).toBe(2);
        expect(context.listFormat).toEqual({
            threadItemCounts: [],
            levels: [],
        });
    });

    it('OL with invalid metadata', () => {
        const ol = document.createElement('ol');

        ol.dataset.editingInfo = JSON.stringify({
            orderedStyleType: true,
            unorderedStyleType: 100,
        });

        listLevelMetadataFormatHandler.parse(format, ol, context, {});

        expect(format.orderedStyleType).toBeUndefined();
        expect(format.unorderedStyleType).toBeUndefined();
        expect(context.listFormat).toEqual({
            threadItemCounts: [],
            levels: [],
        });
    });

    it('OL with metadata that has value at the edge of range', () => {
        const ol = document.createElement('ol');

        ol.dataset.editingInfo = JSON.stringify({
            orderedStyleType: NumberingListType.Max,
            unorderedStyleType: BulletListType.Max,
        });

        listLevelMetadataFormatHandler.parse(format, ol, context, {});

        expect(format.orderedStyleType).toBe(NumberingListType.Max);
        expect(format.unorderedStyleType).toBe(BulletListType.Max);
        expect(context.listFormat).toEqual({
            threadItemCounts: [],
            levels: [],
        });
    });

    it('OL with metadata that has value at the out of range', () => {
        const ol = document.createElement('ol');

        ol.dataset.editingInfo = JSON.stringify({
            orderedStyleType: NumberingListType.Max + 1,
            unorderedStyleType: BulletListType.Max + 1,
        });

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

    it('OL with conflict metadata and list type', () => {
        const ol = document.createElement('ol');

        ol.style.listStyleType = 'decimal';
        ol.dataset.editingInfo = JSON.stringify({
            orderedStyleType: NumberingListType.Max,
        });

        listLevelMetadataFormatHandler.parse(format, ol, context, {});

        expect(format.orderedStyleType).toBe(NumberingListType.Max);
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

    it('OL with metadata', () => {
        const ol = document.createElement('ol');

        format.orderedStyleType = NumberingListType.UpperAlpha;
        format.unorderedStyleType = BulletListType.Circle;

        listLevelMetadataFormatHandler.apply(format, ol, context);

        expect(ol.outerHTML).toBe(
            '<ol data-editing-info="{&quot;orderedStyleType&quot;:9,&quot;unorderedStyleType&quot;:9}"></ol>'
        );
    });

    it('OL with metadata with simple value', () => {
        const ol = document.createElement('ol');

        format.orderedStyleType = NumberingListType.LowerAlpha;
        format.unorderedStyleType = BulletListType.Circle;

        listLevelMetadataFormatHandler.apply(format, ol, context);

        expect(ol.outerHTML).toBe(
            '<ol data-editing-info="{&quot;orderedStyleType&quot;:5,&quot;unorderedStyleType&quot;:9}" style="list-style-type: lower-alpha;"></ol>'
        );
    });

    it('UL with metadata with simple value', () => {
        const ul = document.createElement('ul');

        format.orderedStyleType = NumberingListType.LowerAlpha;
        format.unorderedStyleType = BulletListType.Circle;

        listLevelMetadataFormatHandler.apply(format, ul, context);

        expect(ul.outerHTML).toBe(
            '<ul data-editing-info="{&quot;orderedStyleType&quot;:5,&quot;unorderedStyleType&quot;:9}" style="list-style-type: circle;"></ul>'
        );
    });
});
