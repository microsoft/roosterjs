import { createListItem } from '../../../lib/modelApi/creators/createListItem';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { handleList } from '../../../lib/modelToDom/handlers/handleList';
import { itChromeOnly } from 'roosterjs-editor-dom/test/DomTestHelper';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';

describe('handleList', () => {
    let context: ModelToDomContext;
    let parent: HTMLDivElement;

    beforeEach(() => {
        context = createModelToDomContext();
        parent = document.createElement('div');
    });

    it('Empty context, empty list item', () => {
        const listItem = createListItem();

        handleList(document, parent, listItem, context);

        expect(parent.outerHTML).toBe('<div></div>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [],
            nodeStack: [
                {
                    node: parent,
                },
            ],
        });
    });

    it('Empty context, single UL list item', () => {
        const listItem = createListItem(undefined, [
            {
                listType: 'UL',
            },
        ]);

        handleList(document, parent, listItem, context);

        expect(parent.outerHTML).toBe('<div><ul></ul></div>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [],
            nodeStack: [
                {
                    node: parent,
                },
                {
                    listType: 'UL',
                    node: parent.firstChild as HTMLElement,
                },
            ],
        });
    });

    it('Empty context, single OL list item', () => {
        const listItem = createListItem(undefined, [
            {
                listType: 'OL',
            },
        ]);

        handleList(document, parent, listItem, context);

        expect(parent.outerHTML).toBe('<div><ol start="1"></ol></div>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [0],
            nodeStack: [
                {
                    node: parent,
                },
                {
                    listType: 'OL',
                    node: parent.firstChild as HTMLElement,
                },
            ],
        });
    });

    it('Context has OL, single OL list item, reuse existing OL element', () => {
        const existingOL = document.createElement('ol');
        const listItem = createListItem(undefined, [
            {
                listType: 'OL',
            },
        ]);

        context.listFormat.threadItemCounts = [1];
        context.listFormat.nodeStack = [{ node: parent }, { node: existingOL, listType: 'OL' }];

        parent.appendChild(existingOL);

        handleList(document, parent, listItem, context);

        expect(parent.outerHTML).toBe('<div><ol></ol></div>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [1],
            nodeStack: [
                {
                    node: parent,
                },
                {
                    listType: 'OL',
                    node: existingOL,
                },
            ],
        });
    });

    itChromeOnly('Context has OL, single OL list item, do not reuse existing OL element', () => {
        const existingOL = document.createElement('ol');
        const listItem = createListItem(undefined, [
            {
                listType: 'OL',
                orderedStyleType: 2,
            },
        ]);

        context.listFormat.threadItemCounts = [1];
        context.listFormat.nodeStack = [{ node: parent }, { node: existingOL, listType: 'OL' }];

        parent.appendChild(existingOL);

        handleList(document, parent, listItem, context);

        expect(parent.outerHTML).toBe(
            '<div><ol></ol><ol start="2" data-editing-info="{&quot;orderedStyleType&quot;:2}"></ol></div>'
        );
        expect(context.listFormat).toEqual({
            threadItemCounts: [1],
            nodeStack: [
                {
                    node: parent,
                },
                {
                    listType: 'OL',
                    node: parent.childNodes[1],
                    orderedStyleType: 2,
                },
            ],
        });
    });

    itChromeOnly('Context has OL, 2 level OL list item, reuse existing OL element', () => {
        const existingOL = document.createElement('ol');
        const listItem = createListItem(undefined, [
            {
                listType: 'OL',
            },
            {
                listType: 'OL',
                orderedStyleType: 2,
            },
        ]);

        context.listFormat.threadItemCounts = [1];
        context.listFormat.nodeStack = [{ node: parent }, { node: existingOL, listType: 'OL' }];

        parent.appendChild(existingOL);

        handleList(document, parent, listItem, context);

        expect(parent.outerHTML).toBe(
            '<div><ol><ol start="1" data-editing-info="{&quot;orderedStyleType&quot;:2}"></ol></ol></div>'
        );
        expect(context.listFormat).toEqual({
            threadItemCounts: [1, 0],
            nodeStack: [
                {
                    node: parent,
                },
                {
                    listType: 'OL',
                    node: existingOL,
                },
                {
                    listType: 'OL',
                    node: existingOL.firstChild as HTMLElement,
                    orderedStyleType: 2,
                },
            ],
        });
    });

    itChromeOnly('Context has OL, 2 level OL list item, do not reuse existing OL element', () => {
        const existingOL = document.createElement('ol');
        const listItem = createListItem(undefined, [
            {
                listType: 'OL',
                unorderedStyleType: 3,
            },
            {
                listType: 'OL',
            },
        ]);

        context.listFormat.threadItemCounts = [1];
        context.listFormat.nodeStack = [{ node: parent }, { node: existingOL, listType: 'OL' }];

        parent.appendChild(existingOL);

        handleList(document, parent, listItem, context);

        expect(parent.outerHTML).toBe(
            '<div><ol></ol><ol start="2" data-editing-info="{&quot;unorderedStyleType&quot;:3}"><ol start="1"></ol></ol></div>'
        );
        expect(context.listFormat).toEqual({
            threadItemCounts: [1, 0],
            nodeStack: [
                {
                    node: parent,
                },
                {
                    listType: 'OL',
                    node: existingOL.nextSibling as HTMLElement,
                    unorderedStyleType: 3,
                },
                {
                    listType: 'OL',
                    node: (existingOL.nextSibling as HTMLElement).firstChild as HTMLElement,
                },
            ],
        });
    });

    it('Context has OL and OL, single level OL list item, reuse existing OL element and decrease level', () => {
        const existingOL1 = document.createElement('ol');
        const existingOL2 = document.createElement('ol');
        parent.appendChild(existingOL1);
        existingOL1.appendChild(existingOL2);

        const listItem = createListItem(undefined, [
            {
                listType: 'OL',
            },
        ]);

        context.listFormat.threadItemCounts = [1];
        context.listFormat.nodeStack = [
            { node: parent },
            { node: existingOL1, listType: 'OL' },
            { node: existingOL2, listType: 'OL' },
        ];

        handleList(document, parent, listItem, context);

        expect(parent.outerHTML).toBe('<div><ol><ol></ol></ol></div>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [1],
            nodeStack: [
                {
                    node: parent,
                },
                {
                    listType: 'OL',
                    node: existingOL1,
                },
            ],
        });
    });

    it('Context has UL and OL, single level OL list item, do not reuse existing OL element and decrease level', () => {
        const existingOL1 = document.createElement('ul');
        const existingOL2 = document.createElement('ol');
        parent.appendChild(existingOL1);
        existingOL1.appendChild(existingOL2);

        const listItem = createListItem(undefined, [
            {
                listType: 'OL',
            },
        ]);

        context.listFormat.threadItemCounts = [1];
        context.listFormat.nodeStack = [
            { node: parent },
            { node: existingOL1, listType: 'UL' },
            { node: existingOL2, listType: 'OL' },
        ];

        handleList(document, parent, listItem, context);

        expect(parent.outerHTML).toBe('<div><ul><ol></ol></ul><ol start="2"></ol></div>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [1],
            nodeStack: [
                {
                    node: parent,
                },
                {
                    listType: 'OL',
                    node: existingOL1.nextSibling as HTMLElement,
                },
            ],
        });
    });

    it('Context has UL and OL, 2 level OL list item, reuse level 1 and restart number', () => {
        const existingOL1 = document.createElement('ul');
        const existingOL2 = document.createElement('ol');
        parent.appendChild(existingOL1);
        existingOL1.appendChild(existingOL2);

        const listItem = createListItem(undefined, [
            {
                listType: 'UL',
            },
            {
                listType: 'OL',
                startNumberOverride: 3,
            },
        ]);

        context.listFormat.threadItemCounts = [1, 1];
        context.listFormat.nodeStack = [
            { node: parent },
            { node: existingOL1, listType: 'UL' },
            { node: existingOL2, listType: 'OL' },
        ];

        handleList(document, parent, listItem, context);

        expect(parent.outerHTML).toBe('<div><ul><ol></ol><ol start="3"></ol></ul></div>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [1, 2],
            nodeStack: [
                {
                    node: parent,
                },
                {
                    listType: 'UL',
                    node: existingOL1,
                },
                {
                    listType: 'OL',
                    node: existingOL1.childNodes[1] as HTMLElement,
                    startNumberOverride: 3,
                },
            ],
        });
    });
});

describe('handleList without format handlers', () => {
    let context: ModelToDomContext;
    let parent: HTMLDivElement;

    beforeEach(() => {
        context = createModelToDomContext(undefined, {
            formatApplierOverride: {
                listType: null,
                listLevelMetadata: null,
                listLevelThread: null,
            },
        });
        parent = document.createElement('div');
    });

    it('Empty context, empty list item', () => {
        const listItem = createListItem();

        handleList(document, parent, listItem, context);

        expect(parent.outerHTML).toBe('<div></div>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [],
            nodeStack: [
                {
                    node: parent,
                },
            ],
        });
    });

    it('Empty context, single UL list item', () => {
        const listItem = createListItem(undefined, [
            {
                listType: 'UL',
            },
        ]);

        handleList(document, parent, listItem, context);

        expect(parent.outerHTML).toBe('<div><ul></ul></div>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [],
            nodeStack: [
                {
                    node: parent,
                },
                {
                    listType: 'UL',
                    node: parent.firstChild as HTMLElement,
                },
            ],
        });
    });

    it('Empty context, single OL list item', () => {
        const listItem = createListItem(undefined, [
            {
                listType: 'OL',
            },
        ]);

        handleList(document, parent, listItem, context);

        expect(parent.outerHTML).toBe('<div><ol></ol></div>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [],
            nodeStack: [
                {
                    node: parent,
                },
                {
                    listType: 'OL',
                    node: parent.firstChild as HTMLElement,
                },
            ],
        });
    });

    it('Context has OL, single OL list item, reuse existing OL element', () => {
        const existingOL = document.createElement('ol');
        const listItem = createListItem(undefined, [
            {
                listType: 'OL',
            },
        ]);

        context.listFormat.threadItemCounts = [1];
        context.listFormat.nodeStack = [{ node: parent }, { node: existingOL, listType: 'OL' }];

        parent.appendChild(existingOL);

        handleList(document, parent, listItem, context);

        expect(parent.outerHTML).toBe('<div><ol></ol></div>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [1],
            nodeStack: [
                {
                    node: parent,
                },
                {
                    listType: 'OL',
                    node: existingOL,
                },
            ],
        });
    });

    it('Context has OL, single OL list item, do not reuse existing OL element', () => {
        const existingOL = document.createElement('ol');
        const listItem = createListItem(undefined, [
            {
                listType: 'OL',
                orderedStyleType: 2,
            },
        ]);

        context.listFormat.threadItemCounts = [1];
        context.listFormat.nodeStack = [{ node: parent }, { node: existingOL, listType: 'OL' }];

        parent.appendChild(existingOL);

        handleList(document, parent, listItem, context);

        expect(parent.outerHTML).toBe('<div><ol></ol><ol></ol></div>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [1],
            nodeStack: [
                {
                    node: parent,
                },
                {
                    listType: 'OL',
                    node: parent.childNodes[1],
                    orderedStyleType: 2,
                },
            ],
        });
    });

    it('Context has OL, 2 level OL list item, reuse existing OL element', () => {
        const existingOL = document.createElement('ol');
        const listItem = createListItem(undefined, [
            {
                listType: 'OL',
            },
            {
                listType: 'OL',
                orderedStyleType: 2,
            },
        ]);

        context.listFormat.threadItemCounts = [1];
        context.listFormat.nodeStack = [{ node: parent }, { node: existingOL, listType: 'OL' }];

        parent.appendChild(existingOL);

        handleList(document, parent, listItem, context);

        expect(parent.outerHTML).toBe('<div><ol><ol></ol></ol></div>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [1],
            nodeStack: [
                {
                    node: parent,
                },
                {
                    listType: 'OL',
                    node: existingOL,
                },
                {
                    listType: 'OL',
                    node: existingOL.firstChild as HTMLElement,
                    orderedStyleType: 2,
                },
            ],
        });
    });

    it('Context has OL, 2 level OL list item, do not reuse existing OL element', () => {
        const existingOL = document.createElement('ol');
        const listItem = createListItem(undefined, [
            {
                listType: 'OL',
                unorderedStyleType: 3,
            },
            {
                listType: 'OL',
            },
        ]);

        context.listFormat.threadItemCounts = [1];
        context.listFormat.nodeStack = [{ node: parent }, { node: existingOL, listType: 'OL' }];

        parent.appendChild(existingOL);

        handleList(document, parent, listItem, context);

        expect(parent.outerHTML).toBe('<div><ol></ol><ol><ol></ol></ol></div>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [1],
            nodeStack: [
                {
                    node: parent,
                },
                {
                    listType: 'OL',
                    node: existingOL.nextSibling as HTMLElement,
                    unorderedStyleType: 3,
                },
                {
                    listType: 'OL',
                    node: (existingOL.nextSibling as HTMLElement).firstChild as HTMLElement,
                },
            ],
        });
    });

    it('Context has OL and OL, single level OL list item, reuse existing OL element and decrease level', () => {
        const existingOL1 = document.createElement('ol');
        const existingOL2 = document.createElement('ol');
        parent.appendChild(existingOL1);
        existingOL1.appendChild(existingOL2);

        const listItem = createListItem(undefined, [
            {
                listType: 'OL',
            },
        ]);

        context.listFormat.threadItemCounts = [1];
        context.listFormat.nodeStack = [
            { node: parent },
            { node: existingOL1, listType: 'OL' },
            { node: existingOL2, listType: 'OL' },
        ];

        handleList(document, parent, listItem, context);

        expect(parent.outerHTML).toBe('<div><ol><ol></ol></ol></div>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [1],
            nodeStack: [
                {
                    node: parent,
                },
                {
                    listType: 'OL',
                    node: existingOL1,
                },
            ],
        });
    });

    it('Context has UL and OL, single level OL list item, do not reuse existing OL element and decrease level', () => {
        const existingOL1 = document.createElement('ul');
        const existingOL2 = document.createElement('ol');
        parent.appendChild(existingOL1);
        existingOL1.appendChild(existingOL2);

        const listItem = createListItem(undefined, [
            {
                listType: 'OL',
            },
        ]);

        context.listFormat.threadItemCounts = [1];
        context.listFormat.nodeStack = [
            { node: parent },
            { node: existingOL1, listType: 'UL' },
            { node: existingOL2, listType: 'OL' },
        ];

        handleList(document, parent, listItem, context);

        expect(parent.outerHTML).toBe('<div><ul><ol></ol></ul><ol></ol></div>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [1],
            nodeStack: [
                {
                    node: parent,
                },
                {
                    listType: 'OL',
                    node: existingOL1.nextSibling as HTMLElement,
                },
            ],
        });
    });

    it('Context has UL and OL, 2 level OL list item, reuse level 1 and restart number', () => {
        const existingOL1 = document.createElement('ul');
        const existingOL2 = document.createElement('ol');
        parent.appendChild(existingOL1);
        existingOL1.appendChild(existingOL2);

        const listItem = createListItem(undefined, [
            {
                listType: 'UL',
            },
            {
                listType: 'OL',
                startNumberOverride: 3,
            },
        ]);

        context.listFormat.threadItemCounts = [1, 1];
        context.listFormat.nodeStack = [
            { node: parent },
            { node: existingOL1, listType: 'UL' },
            { node: existingOL2, listType: 'OL' },
        ];

        handleList(document, parent, listItem, context);

        expect(parent.outerHTML).toBe('<div><ul><ol></ol><ol></ol></ul></div>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [1, 1],
            nodeStack: [
                {
                    node: parent,
                },
                {
                    listType: 'UL',
                    node: existingOL1,
                },
                {
                    listType: 'OL',
                    node: existingOL1.childNodes[1] as HTMLElement,
                    startNumberOverride: 3,
                },
            ],
        });
    });
});
