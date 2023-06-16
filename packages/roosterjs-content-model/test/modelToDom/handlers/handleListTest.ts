import { BulletListType, NumberingListType } from 'roosterjs-editor-types';
import { ContentModelListItem } from '../../../lib/publicTypes/group/ContentModelListItem';
import { ContentModelListItemLevelFormat } from '../../../lib/publicTypes/format/ContentModelListItemLevelFormat';
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
        const listItem = createListItem([]);

        handleList(document, parent, listItem, context, null);

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
        const listItem = createListItem([
            {
                listType: 'UL',
            },
        ]);

        handleList(document, parent, listItem, context, null);

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
        const listItem = createListItem([
            {
                listType: 'OL',
            },
        ]);

        handleList(document, parent, listItem, context, null);
        const possibleResults = [
            '<div><ol start="1"></ol></div>', //Chrome
            '<div><ol start="1"></ol></div>', //Firefox
        ];

        expect(possibleResults.indexOf(parent.outerHTML)).toBeGreaterThanOrEqual(
            0,
            parent.outerHTML
        );
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
        const listItem = createListItem([
            {
                listType: 'OL',
            },
        ]);

        context.listFormat.threadItemCounts = [1];
        context.listFormat.nodeStack = [{ node: parent }, { node: existingOL, listType: 'OL' }];

        parent.appendChild(existingOL);

        handleList(document, parent, listItem, context, null);

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
        const listItem = createListItem([
            {
                listType: 'OL',
                orderedStyleType: 2,
            },
        ]);

        context.listFormat.threadItemCounts = [1];
        context.listFormat.nodeStack = [{ node: parent }, { node: existingOL, listType: 'OL' }];

        parent.appendChild(existingOL);

        handleList(document, parent, listItem, context, null);

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
        const listItem = createListItem([
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

        handleList(document, parent, listItem, context, null);

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
        const listItem = createListItem([
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

        handleList(document, parent, listItem, context, null);

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

        const listItem = createListItem([
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

        handleList(document, parent, listItem, context, null);

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

        const listItem = createListItem([
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

        handleList(document, parent, listItem, context, null);
        const possibleResults = [
            '<div><ul><ol></ol></ul><ol start="2"></ol></div>', //Chrome
            '<div><ul><ol></ol></ul><ol start="2"></ol></div>', //Firefox
        ];

        expect(possibleResults.indexOf(parent.outerHTML)).toBeGreaterThanOrEqual(
            0,
            parent.outerHTML
        );
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

        const listItem = createListItem([
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

        handleList(document, parent, listItem, context, null);

        const possibleResults = [
            '<div><ul><ol></ol><ol start="3"></ol></ul></div>', //Chrome
            '<div><ul><ol></ol><ol start="3"></ol></ul></div>', //Firefox
        ];

        expect(possibleResults.indexOf(parent.outerHTML)).toBeGreaterThanOrEqual(
            0,
            parent.outerHTML
        );

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

    it('List with margin and padding', () => {
        const listItem = createListItem([
            {
                listType: 'UL',
                marginLeft: '1px',
                marginRight: '2px',
                marginTop: '3px',
                marginBottom: '4px',
                paddingLeft: '5px',
                paddingRight: '6px',
                paddingTop: '7px',
                paddingBottom: '8px',
            },
        ]);

        handleList(document, parent, listItem, context, null);

        expect(parent.outerHTML).toBe(
            '<div><ul style="margin: 3px 2px 4px 1px; padding: 7px 6px 8px 5px;"></ul></div>'
        );
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
                dataset: null,
            },
        });
        parent = document.createElement('div');
    });

    it('Empty context, empty list item', () => {
        const listItem = createListItem([]);

        handleList(document, parent, listItem, context, null);

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
        const listItem = createListItem([
            {
                listType: 'UL',
            },
        ]);

        handleList(document, parent, listItem, context, null);

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
        const listItem = createListItem([
            {
                listType: 'OL',
            },
        ]);

        handleList(document, parent, listItem, context, null);
        const possibleResults = [
            '<div><ol></ol></div>', //Chrome
            '<div><ol start="1"></ol></div>', //Firefox
        ];

        expect(possibleResults.indexOf(parent.outerHTML)).toBeGreaterThanOrEqual(
            0,
            parent.outerHTML
        );
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
        const listItem = createListItem([
            {
                listType: 'OL',
            },
        ]);

        context.listFormat.threadItemCounts = [1];
        context.listFormat.nodeStack = [{ node: parent }, { node: existingOL, listType: 'OL' }];

        parent.appendChild(existingOL);

        handleList(document, parent, listItem, context, null);

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
        const listItem = createListItem([
            {
                listType: 'OL',
                orderedStyleType: 2,
            },
        ]);

        context.listFormat.threadItemCounts = [1];
        context.listFormat.nodeStack = [{ node: parent }, { node: existingOL, listType: 'OL' }];

        parent.appendChild(existingOL);

        handleList(document, parent, listItem, context, null);

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
        const listItem = createListItem([
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

        handleList(document, parent, listItem, context, null);

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
        const listItem = createListItem([
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

        handleList(document, parent, listItem, context, null);

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

        const listItem = createListItem([
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

        handleList(document, parent, listItem, context, null);

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

        const listItem = createListItem([
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

        handleList(document, parent, listItem, context, null);

        const possibleResults = [
            '<div><ul><ol></ol></ul><ol></ol></div>', //Chrome
            '<div><ul><ol></ol></ul><ol start="2"></ol></div>', //Firefox
        ];

        expect(possibleResults.indexOf(parent.outerHTML)).toBeGreaterThanOrEqual(
            0,
            parent.outerHTML
        );
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

        const listItem = createListItem([
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

        handleList(document, parent, listItem, context, null);

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

describe('handleList handles metadata', () => {
    let context: ModelToDomContext;
    let parent: HTMLDivElement;

    beforeEach(() => {
        context = createModelToDomContext();
        parent = document.createElement('div');
    });

    it('OL with metadata', () => {
        const listItem = createListItem([
            {
                listType: 'OL',
                orderedStyleType: NumberingListType.UpperAlpha,
                unorderedStyleType: BulletListType.Circle,
            },
        ]);

        handleList(document, parent, listItem, context, null);

        const possibleResults = [
            '<ol start="1" data-editing-info="{&quot;orderedStyleType&quot;:9,&quot;unorderedStyleType&quot;:9}" style="list-style-type: upper-alpha;"></ol>', // Chrome
            '<ol style="list-style-type: upper-alpha;" data-editing-info="{&quot;orderedStyleType&quot;:9,&quot;unorderedStyleType&quot;:9}" start="1"></ol>', // Firefox
        ];
        expect(possibleResults.indexOf(parent.innerHTML)).toBeGreaterThanOrEqual(
            0,
            parent.innerHTML
        );
    });

    it('OL with metadata with simple value', () => {
        const listItem = createListItem([
            {
                listType: 'OL',
                orderedStyleType: NumberingListType.LowerAlpha,
                unorderedStyleType: BulletListType.Circle,
            },
        ]);

        handleList(document, parent, listItem, context, null);

        const possibleResults = [
            '<ol start="1" data-editing-info="{&quot;orderedStyleType&quot;:5,&quot;unorderedStyleType&quot;:9}" style="list-style-type: lower-alpha;"></ol>', // Chrome
            '<ol style="list-style-type: lower-alpha;" data-editing-info="{&quot;orderedStyleType&quot;:5,&quot;unorderedStyleType&quot;:9}" start="1"></ol>', // Firefox
        ];

        expect(possibleResults.indexOf(parent.innerHTML)).toBeGreaterThanOrEqual(
            0,
            parent.innerHTML
        );
    });

    it('UL with metadata with simple value', () => {
        const listItem = createListItem([
            {
                listType: 'UL',
                orderedStyleType: NumberingListType.LowerAlpha,
                unorderedStyleType: BulletListType.Circle,
            },
        ]);

        handleList(document, parent, listItem, context, null);

        const possibleResults = [
            '<ul data-editing-info="{&quot;orderedStyleType&quot;:5,&quot;unorderedStyleType&quot;:9}" style="list-style-type: circle;"></ul>', // Chrome
            '<ul style="list-style-type: circle;" data-editing-info="{&quot;orderedStyleType&quot;:5,&quot;unorderedStyleType&quot;:9}"></ul>', // Firefox
        ];
        expect(possibleResults.indexOf(parent.innerHTML)).toBeGreaterThanOrEqual(
            0,
            parent.innerHTML
        );
    });

    it('OL with refNode', () => {
        const listItem = createListItem([
            {
                listType: 'OL',
            },
        ]);
        const br = document.createElement('br');

        parent.appendChild(br);

        handleList(document, parent, listItem, context, br);

        const possibleResults = ['<div><ol start="1"></ol><br></div>'];

        expect(possibleResults.indexOf(parent.outerHTML)).toBeGreaterThanOrEqual(
            0,
            parent.outerHTML
        );
        expect(context.listFormat).toEqual({
            threadItemCounts: [0],
            nodeStack: [
                {
                    node: parent,
                },
                {
                    node: parent.firstChild as HTMLElement,
                    listType: 'OL',
                },
            ],
        });
    });

    it('Context has OL with refNode', () => {
        const existingOL = document.createElement('ol');
        const listItem = createListItem([
            {
                listType: 'OL',
            },
            {
                listType: 'OL',
            },
        ]);
        const br = document.createElement('br');

        context.listFormat.threadItemCounts = [1];
        context.listFormat.nodeStack = [{ node: parent }, { node: existingOL, listType: 'OL' }];

        parent.appendChild(existingOL);
        parent.appendChild(br);

        const result = handleList(document, parent, listItem, context, br);

        const possibleResults = [
            '<div><ol><ol start="1"></ol></ol><br></div>', //Chrome
            '<div><ol><ol start="1"></ol></ol><br></div>', //Firefox
        ];

        expect(possibleResults.indexOf(parent.outerHTML)).toBeGreaterThanOrEqual(
            0,
            parent.outerHTML
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
                },
            ],
        });
        expect(result).toBe(br);
    });

    it('With onNodeCreated', () => {
        const listLevel0: ContentModelListItemLevelFormat = {
            listType: 'OL',
        };
        const listLevel1: ContentModelListItemLevelFormat = {
            listType: 'UL',
        };
        const listItem: ContentModelListItem = {
            blockType: 'BlockGroup',
            blockGroupType: 'ListItem',
            blocks: [],
            format: {},
            formatHolder: {
                segmentType: 'SelectionMarker',
                format: {},
                isSelected: true,
            },
            levels: [listLevel0, listLevel1],
        };
        const parent = document.createElement('div');

        const onNodeCreated = jasmine.createSpy('onNodeCreated');

        context.onNodeCreated = onNodeCreated;

        handleList(document, parent, listItem, context, null);

        expect(
            ['<ol start="1"><ul></ul></ol>', '<ol start="1"><ul></ul></ol>'].indexOf(
                parent.innerHTML
            ) >= 0
        ).toBeTrue();
        expect(onNodeCreated).toHaveBeenCalledTimes(2);
        expect(onNodeCreated.calls.argsFor(0)[0]).toBe(listLevel0);
        expect(onNodeCreated.calls.argsFor(0)[1]).toBe(parent.querySelector('ol'));
        expect(onNodeCreated.calls.argsFor(1)[0]).toBe(listLevel1);
        expect(onNodeCreated.calls.argsFor(1)[1]).toBe(parent.querySelector('ul'));
    });
});
