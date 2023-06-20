import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { listItemThreadFormatHandler } from '../../../lib/formatHandlers/list/listItemThreadFormatHandler';
import { ListThreadFormat } from '../../../lib/publicTypes/format/formatParts/ListThreadFormat';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';

describe('listItemThreadFormatHandler.parse', () => {
    let context: DomToModelContext;
    let format: ListThreadFormat;

    beforeEach(() => {
        context = createDomToModelContext();
        format = {};
    });

    it('LI not under OL', () => {
        const li = document.createElement('li');

        listItemThreadFormatHandler.parse(format, li, context, {});

        expect(format).toEqual({});
        expect(context.listFormat).toEqual({
            threadItemCounts: [],
            levels: [],
        });
    });

    it('LI under UL', () => {
        const ul = document.createElement('ul');
        const li = document.createElement('li');

        ul.appendChild(li);
        context.listFormat.levels = [{}];

        listItemThreadFormatHandler.parse(format, li, context, {});

        expect(format).toEqual({});
        expect(context.listFormat).toEqual({
            threadItemCounts: [],
            levels: [{}],
        });
    });

    it('LI under OL without levels', () => {
        const ol = document.createElement('ol');
        const li = document.createElement('li');

        ol.appendChild(li);

        listItemThreadFormatHandler.parse(format, li, context, {});

        expect(format).toEqual({});
        expect(context.listFormat).toEqual({
            threadItemCounts: [],
            levels: [],
        });
    });

    it('LI under OL with valid levels', () => {
        const ol = document.createElement('ol');
        const li = document.createElement('li');

        ol.appendChild(li);
        context.listFormat.levels = [{}];
        context.listFormat.threadItemCounts = [1];

        listItemThreadFormatHandler.parse(format, li, context, {});

        expect(format).toEqual({});
        expect(context.listFormat).toEqual({
            threadItemCounts: [2],
            levels: [{}],
        });
    });

    it('LI under OL with valid levels and start number needs to be deleted', () => {
        const ol = document.createElement('ol');
        const li = document.createElement('li');

        ol.appendChild(li);
        context.listFormat.levels = [
            {
                listType: 'OL',
                startNumberOverride: 3,
            },
        ];
        context.listFormat.threadItemCounts = [1];

        listItemThreadFormatHandler.parse(format, li, context, {});

        expect(format).toEqual({});
        expect(context.listFormat).toEqual({
            threadItemCounts: [2],
            levels: [
                {
                    listType: 'OL',
                },
            ],
        });
    });

    it('LI under OL, need to splice thread item count', () => {
        const ol = document.createElement('ol');
        const li = document.createElement('li');

        ol.appendChild(li);
        context.listFormat.levels = [
            {
                listType: 'OL',
                startNumberOverride: 3,
            },
        ];
        context.listFormat.threadItemCounts = [3, 2, 1];

        listItemThreadFormatHandler.parse(format, li, context, {});

        expect(format).toEqual({});
        expect(context.listFormat).toEqual({
            threadItemCounts: [4],
            levels: [
                {
                    listType: 'OL',
                },
            ],
        });
    });

    it('LI under OL, in a deeper list', () => {
        const ol = document.createElement('ol');
        const li = document.createElement('li');

        ol.appendChild(li);
        context.listFormat.levels = [
            {},
            {
                listType: 'OL',
                startNumberOverride: 3,
            },
        ];
        context.listFormat.threadItemCounts = [3, 2, 1];

        listItemThreadFormatHandler.parse(format, li, context, {});

        expect(format).toEqual({});
        expect(context.listFormat).toEqual({
            threadItemCounts: [3, 3],
            levels: [
                {},
                {
                    listType: 'OL',
                },
            ],
        });
    });

    it('LI under OL with display: block', () => {
        const ol = document.createElement('ol');
        const li = document.createElement('li');

        ol.appendChild(li);
        li.style.display = 'block';
        context.listFormat.levels = [
            {},
            {
                listType: 'OL',
            },
        ];
        context.listFormat.threadItemCounts = [1];

        listItemThreadFormatHandler.parse(format, li, context, {});

        expect(format).toEqual({
            displayForDummyItem: 'block',
        });
        expect(context.listFormat).toEqual({
            threadItemCounts: [1],
            levels: [
                {},
                {
                    listType: 'OL',
                },
            ],
        });
    });
});

describe('listItemThreadFormatHandler.parse', () => {
    let context: ModelToDomContext;
    let format: ListThreadFormat;
    beforeEach(() => {
        context = createModelToDomContext();
        format = {};
    });

    it('LI not under OL', () => {
        const li = document.createElement('li');

        listItemThreadFormatHandler.apply(format, li, context);

        expect(li.outerHTML).toBe('<li></li>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [],
            nodeStack: [],
        });
    });

    it('LI under OL without valid context', () => {
        const ol = document.createElement('ol');
        const li = document.createElement('li');

        ol.appendChild(li);

        listItemThreadFormatHandler.apply(format, li, context);

        expect(li.outerHTML).toBe('<li></li>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [],
            nodeStack: [],
        });
    });

    it('LI under OL with valid context', () => {
        const ol = document.createElement('ol');
        const li = document.createElement('li');

        ol.appendChild(li);

        context.listFormat.nodeStack = [
            {
                node: {} as Node,
            },
            {
                node: {} as Node,
            },
        ];

        listItemThreadFormatHandler.apply(format, li, context);

        expect(li.outerHTML).toBe('<li></li>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [1],
            nodeStack: [
                {
                    node: {} as Node,
                },
                {
                    node: {} as Node,
                },
            ],
        });
    });

    it('LI under UL with valid context', () => {
        const ul = document.createElement('ul');
        const li = document.createElement('li');

        ul.appendChild(li);

        context.listFormat.nodeStack = [
            {
                node: {} as Node,
            },
            {
                node: {} as Node,
            },
        ];

        listItemThreadFormatHandler.apply(format, li, context);

        expect(li.outerHTML).toBe('<li></li>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [],
            nodeStack: [
                {
                    node: {} as Node,
                },
                {
                    node: {} as Node,
                },
            ],
        });
    });

    it('LI under OL with context and deeper item counts', () => {
        const ol = document.createElement('ol');
        const li = document.createElement('li');

        ol.appendChild(li);

        context.listFormat.nodeStack = [
            {
                node: {} as Node,
            },
            {
                node: {} as Node,
            },
        ];

        context.listFormat.threadItemCounts = [3, 6, 9];

        listItemThreadFormatHandler.apply(format, li, context);

        expect(li.outerHTML).toBe('<li></li>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [4],
            nodeStack: [
                {
                    node: {} as Node,
                },
                {
                    node: {} as Node,
                },
            ],
        });
    });

    it('LI under OL with context and deeper item counts and deeper stack', () => {
        const ol = document.createElement('ol');
        const li = document.createElement('li');

        ol.appendChild(li);

        context.listFormat.nodeStack = [
            {
                node: {} as Node,
            },
            {
                node: {} as Node,
            },
            {
                node: {} as Node,
            },
        ];

        context.listFormat.threadItemCounts = [3, 6, 9];

        listItemThreadFormatHandler.apply(format, li, context);

        expect(li.outerHTML).toBe('<li></li>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [3, 7],
            nodeStack: [
                {
                    node: {} as Node,
                },
                {
                    node: {} as Node,
                },
                {
                    node: {} as Node,
                },
            ],
        });
    });

    it('LI under OL with display: block', () => {
        const ol = document.createElement('ol');
        const li = document.createElement('li');

        ol.appendChild(li);

        context.listFormat.nodeStack = [
            {
                node: {} as Node,
            },
        ];

        context.listFormat.threadItemCounts = [1];
        format.displayForDummyItem = 'block';

        listItemThreadFormatHandler.apply(format, li, context);

        expect(li.outerHTML).toBe('<li style="display: block;"></li>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [1],
            nodeStack: [
                {
                    node: {} as Node,
                },
            ],
        });
    });
});
