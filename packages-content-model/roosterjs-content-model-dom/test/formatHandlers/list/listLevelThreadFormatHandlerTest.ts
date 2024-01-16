import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { listLevelThreadFormatHandler } from '../../../lib/formatHandlers/list/listLevelThreadFormatHandler';
import {
    DomToModelContext,
    ListThreadFormat,
    ModelToDomContext,
    ModelToDomListStackItem,
} from 'roosterjs-content-model-types';

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
                format: {},
                dataset: {},
            },
        ];

        listLevelThreadFormatHandler.parse(format, ol, context, {});

        expect(format.startNumberOverride).toBeUndefined();
        expect(context.listFormat).toEqual({
            threadItemCounts: [2, 0],
            levels: [
                {
                    listType: 'OL',
                    format: {},
                    dataset: {},
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
                format: {},
                dataset: {},
            },
        ];

        listLevelThreadFormatHandler.parse(format, ol, context, {});

        expect(format.startNumberOverride).toBe(1);
        expect(context.listFormat).toEqual({
            threadItemCounts: [2, 0],
            levels: [
                {
                    listType: 'OL',
                    format: {},
                    dataset: {},
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
                format: {},
                dataset: {},
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
                    format: {},
                    dataset: {},
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
        const parent1 = ({} as any) as ModelToDomListStackItem;
        const parent2 = ({} as any) as ModelToDomListStackItem;

        context.listFormat.nodeStack = [parent1, parent2];
        listLevelThreadFormatHandler.apply(format, ol, context);

        expect(ol.outerHTML).toBe('<ol start="1"></ol>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [0],
            nodeStack: [parent1, parent2],
        });
    });

    it('Simple OL with context that already has list inside', () => {
        const ol = document.createElement('ol');
        const parent1 = ({} as any) as ModelToDomListStackItem;
        const parent2 = ({} as any) as ModelToDomListStackItem;

        context.listFormat.nodeStack = [parent1, parent2];
        context.listFormat.threadItemCounts = [0, 1];
        listLevelThreadFormatHandler.apply(format, ol, context);

        expect(ol.outerHTML).toBe('<ol start="1"></ol>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [0],
            nodeStack: [parent1, parent2],
        });
    });

    it('Simple OL with context that already has thread item count', () => {
        const ol = document.createElement('ol');
        const parent1 = ({} as any) as ModelToDomListStackItem;
        const parent2 = ({} as any) as ModelToDomListStackItem;
        const parent3 = ({} as any) as ModelToDomListStackItem;

        context.listFormat.nodeStack = [parent1, parent2, parent3];
        context.listFormat.threadItemCounts = [1, 2];
        listLevelThreadFormatHandler.apply(format, ol, context);

        expect(ol.outerHTML).toBe('<ol start="3"></ol>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [1, 2],
            nodeStack: [parent1, parent2, parent3],
        });
    });

    it('OL with start number override', () => {
        const ol = document.createElement('ol');
        const parent1 = ({} as any) as ModelToDomListStackItem;
        const parent2 = ({} as any) as ModelToDomListStackItem;
        const parent3 = ({} as any) as ModelToDomListStackItem;

        context.listFormat.nodeStack = [parent1, parent2, parent3];
        context.listFormat.threadItemCounts = [1, 2, 5];
        format.startNumberOverride = 4;

        listLevelThreadFormatHandler.apply(format, ol, context);

        expect(ol.outerHTML).toBe('<ol start="4"></ol>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [1, 3],
            nodeStack: [parent1, parent2, parent3],
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
