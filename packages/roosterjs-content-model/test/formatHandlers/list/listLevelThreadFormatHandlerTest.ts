import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { listLevelThreadFormatHandler } from '../../../lib/formatHandlers/list/listLevelThreadFormatHandler';
import { ListThreadFormat } from '../../../lib/publicTypes/format/formatParts/ListThreadFormat';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';
import { ModelToDomListStackItem } from '../../../lib/publicTypes/context/ModelToDomFormatContext';

describe('listLevelThreadFormatHandler.parse', () => {
    let context: DomToModelContext;
    let format: ListThreadFormat;

    beforeEach(() => {
        context = createDomToModelContext();
        format = {};
    });

    it('OL without listFormat', () => {
        const ol = document.createElement('ol');

        listLevelThreadFormatHandler.parse(format, ol, context, {});

        expect(format.startNumberOverride).toBeUndefined();
        expect(context.listFormat).toEqual({
            threadItemCounts: [0],
            levels: [],
        });
    });

    it('OL with listFormat: new list', () => {
        const ol = document.createElement('ol');

        ol.start = 1;
        context.listFormat.threadItemCounts = [0];
        context.listFormat.levels = [];

        listLevelThreadFormatHandler.parse(format, ol, context, {});

        expect(format.startNumberOverride).toBeUndefined();
        expect(context.listFormat).toEqual({
            threadItemCounts: [0],
            levels: [],
        });
    });

    it('OL with listFormat: new list with start number', () => {
        const ol = document.createElement('ol');

        ol.start = 2;
        context.listFormat.threadItemCounts = [0];
        context.listFormat.levels = [];

        listLevelThreadFormatHandler.parse(format, ol, context, {});

        expect(format.startNumberOverride).toBe(2);
        expect(context.listFormat).toEqual({
            threadItemCounts: [1],
            levels: [],
        });
    });

    it('OL with listFormat: continue list', () => {
        const ol = document.createElement('ol');

        ol.start = 3;
        context.listFormat.threadItemCounts = [2];
        context.listFormat.levels = [];

        listLevelThreadFormatHandler.parse(format, ol, context, {});

        expect(format.startNumberOverride).toBeUndefined();
        expect(context.listFormat).toEqual({
            threadItemCounts: [2],
            levels: [],
        });
    });

    it('OL to increase list depth', () => {
        const ol = document.createElement('ol');

        context.listFormat.threadItemCounts = [2];
        context.listFormat.levels = [
            {
                listType: 'OL',
            },
        ];

        listLevelThreadFormatHandler.parse(format, ol, context, {});

        expect(format.startNumberOverride).toBeUndefined();
        expect(context.listFormat).toEqual({
            threadItemCounts: [2, 0],
            levels: [
                {
                    listType: 'OL',
                },
            ],
        });
    });

    it('OL in deep list level and restart number', () => {
        const ol = document.createElement('ol');

        context.listFormat.threadItemCounts = [2, 3];
        context.listFormat.levels = [
            {
                listType: 'OL',
            },
        ];

        listLevelThreadFormatHandler.parse(format, ol, context, {});

        expect(format.startNumberOverride).toBe(1);
        expect(context.listFormat).toEqual({
            threadItemCounts: [2, 0],
            levels: [
                {
                    listType: 'OL',
                },
            ],
        });
    });

    it('OL in deep list level and continue list', () => {
        const ol = document.createElement('ol');

        context.listFormat.threadItemCounts = [2, 3];
        context.listFormat.levels = [
            {
                listType: 'OL',
            },
        ];

        ol.start = 4;
        listLevelThreadFormatHandler.parse(format, ol, context, {});

        expect(format.startNumberOverride).toBeUndefined();
        expect(context.listFormat).toEqual({
            threadItemCounts: [2, 3],
            levels: [
                {
                    listType: 'OL',
                },
            ],
        });
    });

    it('UL changes nothing', () => {
        const ul = document.createElement('ul');

        listLevelThreadFormatHandler.parse(format, ul, context, {});

        expect(format.startNumberOverride).toBeUndefined();
        expect(context.listFormat).toEqual({
            threadItemCounts: [],
            levels: [],
        });
    });
});

describe('listLevelThreadFormatHandler.parse', () => {
    let context: ModelToDomContext;
    let format: ListThreadFormat;

    beforeEach(() => {
        context = createModelToDomContext();
        format = {};
    });

    it('Simple OL without context', () => {
        const ol = document.createElement('ol');

        listLevelThreadFormatHandler.apply(format, ol, context);

        expect(ol.outerHTML).toBe('<ol></ol>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [],
            nodeStack: [],
        });
    });

    it('Simple OL with valid context', () => {
        const ol = document.createElement('ol');
        const parent = ({} as any) as ModelToDomListStackItem;

        context.listFormat.nodeStack = [parent];
        listLevelThreadFormatHandler.apply(format, ol, context);

        expect(ol.outerHTML).toBe('<ol start="1"></ol>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [0],
            nodeStack: [parent],
        });
    });

    it('Simple OL with context that already has list inside', () => {
        const ol = document.createElement('ol');
        const parent1 = ({} as any) as ModelToDomListStackItem;
        const parent2 = ({} as any) as ModelToDomListStackItem;

        context.listFormat.nodeStack = [parent1, parent2];
        context.listFormat.threadItemCounts = [1];
        listLevelThreadFormatHandler.apply(format, ol, context);

        expect(ol.outerHTML).toBe('<ol start="1"></ol>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [1, 0],
            nodeStack: [parent1, parent2],
        });
    });

    it('Simple OL with context that already has thread item count', () => {
        const ol = document.createElement('ol');
        const parent1 = ({} as any) as ModelToDomListStackItem;
        const parent2 = ({} as any) as ModelToDomListStackItem;

        context.listFormat.nodeStack = [parent1, parent2];
        context.listFormat.threadItemCounts = [1, 2];
        listLevelThreadFormatHandler.apply(format, ol, context);

        expect(ol.outerHTML).toBe('<ol start="3"></ol>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [1, 2],
            nodeStack: [parent1, parent2],
        });
    });

    it('OL with start number override', () => {
        const ol = document.createElement('ol');
        const parent1 = ({} as any) as ModelToDomListStackItem;
        const parent2 = ({} as any) as ModelToDomListStackItem;

        context.listFormat.nodeStack = [parent1, parent2];
        context.listFormat.threadItemCounts = [1, 2];
        format.startNumberOverride = 4;

        listLevelThreadFormatHandler.apply(format, ol, context);

        expect(ol.outerHTML).toBe('<ol start="4"></ol>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [1, 3],
            nodeStack: [parent1, parent2],
        });
    });

    it('UL', () => {
        const ul = document.createElement('ul');
        const parent = ({} as any) as ModelToDomListStackItem;

        context.listFormat.nodeStack = [parent];
        context.listFormat.threadItemCounts = [1];

        listLevelThreadFormatHandler.apply(format, ul, context);

        expect(ul.outerHTML).toBe('<ul></ul>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [1],
            nodeStack: [parent],
        });
    });

    it('UL with start number override, nothing should be changed', () => {
        const ul = document.createElement('ul');
        const parent = ({} as any) as ModelToDomListStackItem;

        format.startNumberOverride = 4;
        context.listFormat.nodeStack = [parent];
        context.listFormat.threadItemCounts = [1];

        listLevelThreadFormatHandler.apply(format, ul, context);

        expect(ul.outerHTML).toBe('<ul></ul>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [1],
            nodeStack: [parent],
        });
    });
});
