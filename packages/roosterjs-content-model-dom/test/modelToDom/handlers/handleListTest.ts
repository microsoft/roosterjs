import * as applyFormat from '../../../lib/modelToDom/utils/applyFormat';
import * as applyMetadata from '../../../lib/modelToDom/utils/applyMetadata';
import * as reuseCachedElement from '../../../lib/domUtils/reuseCachedElement';
import { BulletListType } from '../../../lib/constants/BulletListType';
import { ContentModelListItem, ModelToDomContext } from 'roosterjs-content-model-types';
import { createListItem } from '../../../lib/modelApi/creators/createListItem';
import { createListLevel } from '../../../lib/modelApi/creators/createListLevel';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { expectHtml } from '../../testUtils';
import { handleList } from '../../../lib/modelToDom/handlers/handleList';
import { listLevelMetadataApplier } from 'roosterjs-content-model-core/lib/override/listMetadataApplier';
import { NumberingListType } from '../../../lib/constants/NumberingListType';

describe('handleList without format handlers', () => {
    let context: ModelToDomContext;
    let parent: HTMLDivElement;

    beforeEach(() => {
        context = createModelToDomContext(undefined, {
            formatApplierOverride: {
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
                    refNode: null,
                },
            ],
        });
    });

    it('Empty context, single UL list item', () => {
        const listItem = createListItem([createListLevel('UL')]);

        handleList(document, parent, listItem, context, null);

        expect(parent.outerHTML).toBe('<div><ul></ul></div>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [],
            nodeStack: [
                { refNode: null, node: parent },
                {
                    listType: 'UL',
                    node: parent.firstChild as HTMLElement,
                    dataset: {},
                    format: {},
                    refNode: null,
                },
            ],
        });
    });

    it('Empty context, single OL list item', () => {
        const listItem = createListItem([createListLevel('OL')]);

        handleList(document, parent, listItem, context, null);
        const possibleResults = [
            '<div><ol></ol></div>', //Chrome
            '<div><ol start="1"></ol></div>', //Firefox
        ];

        expectHtml(parent.outerHTML, possibleResults);

        expect(context.listFormat).toEqual({
            threadItemCounts: [],
            nodeStack: [
                {
                    node: parent,
                    refNode: null,
                },
                {
                    listType: 'OL',
                    node: parent.firstChild as HTMLElement,
                    dataset: {},
                    format: {},
                    refNode: null,
                },
            ],
        });
    });

    it('Context has OL, single OL list item, reuse existing OL element', () => {
        const existingOL = document.createElement('ol');
        const listItem = createListItem([createListLevel('OL')]);

        context.listFormat.threadItemCounts = [1];
        context.listFormat.nodeStack = [
            { node: parent, refNode: null },
            { node: existingOL, listType: 'OL', refNode: null },
        ];

        parent.appendChild(existingOL);

        handleList(document, parent, listItem, context, null);

        expect(parent.outerHTML).toBe('<div><ol></ol></div>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [1],
            nodeStack: [
                {
                    node: parent,
                    refNode: null,
                },
                {
                    listType: 'OL',
                    node: existingOL,
                    refNode: null,
                },
            ],
        });
    });

    it('Context has OL, single OL list item, do not reuse existing OL element', () => {
        const existingOL = document.createElement('ol');
        const listItem = createListItem([
            createListLevel('OL', {}, { editingInfo: JSON.stringify({ orderedStyleType: 2 }) }),
        ]);

        context.listFormat.threadItemCounts = [1];
        context.listFormat.nodeStack = [
            { node: parent, refNode: null },
            { node: existingOL, listType: 'OL', refNode: null },
        ];

        parent.appendChild(existingOL);

        handleList(document, parent, listItem, context, null);

        expect(parent.outerHTML).toBe('<div><ol></ol><ol></ol></div>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [1],
            nodeStack: [
                {
                    node: parent,
                    refNode: null,
                },
                {
                    listType: 'OL',
                    node: parent.childNodes[1],
                    dataset: { editingInfo: JSON.stringify({ orderedStyleType: 2 }) },
                    format: {},
                    refNode: null,
                },
            ],
        });
    });

    it('Context has OL, 2 level OL list item, reuse existing OL element', () => {
        const existingOL = document.createElement('ol');
        const listItem = createListItem([
            createListLevel('OL'),
            createListLevel('OL', {}, { editingInfo: JSON.stringify({ orderedStyleType: 2 }) }),
        ]);

        context.listFormat.threadItemCounts = [1];
        context.listFormat.nodeStack = [
            { node: parent, refNode: null },
            { node: existingOL, listType: 'OL', refNode: null },
        ];

        parent.appendChild(existingOL);

        handleList(document, parent, listItem, context, null);

        expect(parent.outerHTML).toBe('<div><ol><ol></ol></ol></div>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [1],
            nodeStack: [
                {
                    node: parent,
                    refNode: null,
                },
                {
                    listType: 'OL',
                    node: existingOL,
                    refNode: null,
                },
                {
                    listType: 'OL',
                    node: existingOL.firstChild as HTMLElement,
                    dataset: { editingInfo: JSON.stringify({ orderedStyleType: 2 }) },
                    format: {},
                    refNode: null,
                },
            ],
        });
    });

    it('Context has OL, 2 level OL list item, do not reuse existing OL element', () => {
        const existingOL = document.createElement('ol');
        const listItem = createListItem([
            createListLevel('OL', {}, { editingInfo: JSON.stringify({ unorderedStyleType: 3 }) }),
            createListLevel('OL'),
        ]);

        context.listFormat.threadItemCounts = [1];
        context.listFormat.nodeStack = [
            { node: parent, refNode: null },
            { node: existingOL, listType: 'OL', refNode: null },
        ];

        parent.appendChild(existingOL);

        handleList(document, parent, listItem, context, null);

        expect(parent.outerHTML).toBe('<div><ol></ol><ol><ol></ol></ol></div>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [1],
            nodeStack: [
                {
                    node: parent,
                    refNode: null,
                },
                {
                    listType: 'OL',
                    node: existingOL.nextSibling as HTMLElement,
                    dataset: { editingInfo: JSON.stringify({ unorderedStyleType: 3 }) },
                    format: {},
                    refNode: null,
                },
                {
                    listType: 'OL',
                    node: (existingOL.nextSibling as HTMLElement).firstChild as HTMLElement,
                    dataset: {},
                    format: {},
                    refNode: null,
                },
            ],
        });
    });

    it('Context has OL and OL, single level OL list item, reuse existing OL element and decrease level', () => {
        const existingOL1 = document.createElement('ol');
        const existingOL2 = document.createElement('ol');
        parent.appendChild(existingOL1);
        existingOL1.appendChild(existingOL2);

        const listItem = createListItem([createListLevel('OL')]);

        context.listFormat.threadItemCounts = [1];
        context.listFormat.nodeStack = [
            { node: parent, refNode: null },
            { node: existingOL1, listType: 'OL', refNode: null },
            { node: existingOL2, listType: 'OL', refNode: null },
        ];

        handleList(document, parent, listItem, context, null);

        expect(parent.outerHTML).toBe('<div><ol><ol></ol></ol></div>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [1],
            nodeStack: [
                {
                    node: parent,
                    refNode: null,
                },
                {
                    listType: 'OL',
                    node: existingOL1,
                    refNode: null,
                },
            ],
        });
    });

    it('Context has UL and OL, single level OL list item, do not reuse existing OL element and decrease level', () => {
        const existingOL1 = document.createElement('ul');
        const existingOL2 = document.createElement('ol');
        parent.appendChild(existingOL1);
        existingOL1.appendChild(existingOL2);

        const listItem = createListItem([createListLevel('OL')]);

        context.listFormat.threadItemCounts = [1];
        context.listFormat.nodeStack = [
            { node: parent, refNode: null },
            { node: existingOL1, listType: 'UL', refNode: null },
            { node: existingOL2, listType: 'OL', refNode: null },
        ];

        handleList(document, parent, listItem, context, null);

        const possibleResults = [
            '<div><ul><ol></ol></ul><ol></ol></div>', //Chrome
            '<div><ul><ol></ol></ul><ol start="2"></ol></div>', //Firefox
        ];

        expectHtml(parent.outerHTML, possibleResults);

        expect(context.listFormat).toEqual({
            threadItemCounts: [1],
            nodeStack: [
                {
                    node: parent,
                    refNode: null,
                },
                {
                    listType: 'OL',
                    node: existingOL1.nextSibling as HTMLElement,
                    dataset: {},
                    format: {},
                    refNode: null,
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
            createListLevel('UL'),
            createListLevel('OL', { startNumberOverride: 3 }),
        ]);

        context.listFormat.threadItemCounts = [1, 1];
        context.listFormat.nodeStack = [
            { node: parent, refNode: null },
            { node: existingOL1, listType: 'UL', refNode: null },
            { node: existingOL2, listType: 'OL', refNode: null },
        ];

        handleList(document, parent, listItem, context, null);

        expect(parent.outerHTML).toBe('<div><ul><ol></ol><ol></ol></ul></div>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [1, 1],
            nodeStack: [
                {
                    node: parent,
                    refNode: null,
                },
                {
                    listType: 'UL',
                    node: existingOL1,
                    refNode: null,
                },
                {
                    listType: 'OL',
                    node: existingOL1.childNodes[1] as HTMLElement,
                    dataset: {},
                    format: {
                        startNumberOverride: 3,
                    },
                    refNode: null,
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
            createListLevel(
                'OL',
                {},
                {
                    editingInfo: JSON.stringify({
                        orderedStyleType: NumberingListType.UpperAlpha,
                        unorderedStyleType: BulletListType.Circle,
                    }),
                }
            ),
        ]);

        handleList(document, parent, listItem, context, null);

        const possibleResults = [
            '<ol start="1" data-editing-info="{&quot;orderedStyleType&quot;:9,&quot;unorderedStyleType&quot;:9}"></ol>',
        ];

        expectHtml(parent.innerHTML, possibleResults);
    });

    it('OL with metadata with simple value', () => {
        const listItem = createListItem([
            createListLevel(
                'OL',
                {},
                {
                    editingInfo: JSON.stringify({
                        orderedStyleType: NumberingListType.LowerAlpha,
                        unorderedStyleType: BulletListType.Circle,
                    }),
                }
            ),
        ]);

        handleList(document, parent, listItem, context, null);

        const possibleResults = [
            '<ol start="1" data-editing-info="{&quot;orderedStyleType&quot;:5,&quot;unorderedStyleType&quot;:9}"></ol>',
        ];

        expectHtml(parent.innerHTML, possibleResults);
    });

    it('UL with metadata with simple value', () => {
        const listItem = createListItem([
            createListLevel(
                'UL',
                {},
                {
                    editingInfo: JSON.stringify({
                        orderedStyleType: NumberingListType.LowerAlpha,
                        unorderedStyleType: BulletListType.Circle,
                    }),
                }
            ),
        ]);

        handleList(document, parent, listItem, context, null);

        const possibleResults = [
            '<ul data-editing-info="{&quot;orderedStyleType&quot;:5,&quot;unorderedStyleType&quot;:9}"></ul>',
        ];
        expectHtml(parent.innerHTML, possibleResults);
    });

    it('OL with refNode', () => {
        const listItem = createListItem([createListLevel('OL')]);
        const br = document.createElement('br');

        parent.appendChild(br);

        handleList(document, parent, listItem, context, br);

        const possibleResults = ['<div><ol start="1"></ol><br></div>'];

        expectHtml(parent.outerHTML, possibleResults);

        expect(context.listFormat).toEqual({
            threadItemCounts: [0],
            nodeStack: [
                {
                    node: parent,
                    refNode: br,
                },
                {
                    node: parent.firstChild as HTMLElement,
                    listType: 'OL',
                    dataset: {},
                    format: {},
                    refNode: null,
                },
            ],
        });
    });

    it('Context has OL with refNode', () => {
        const existingOL = document.createElement('ol');
        const listItem = createListItem([createListLevel('OL'), createListLevel('OL')]);
        const br = document.createElement('br');

        context.listFormat.threadItemCounts = [1];
        context.listFormat.nodeStack = [
            { node: parent, refNode: br },
            { node: existingOL, listType: 'OL', refNode: null },
        ];

        parent.appendChild(existingOL);
        parent.appendChild(br);

        const result = handleList(document, parent, listItem, context, br);

        const possibleResults = ['<div><ol><ol start="1"></ol></ol><br></div>'];

        expectHtml(parent.outerHTML, possibleResults);

        expect(context.listFormat).toEqual({
            threadItemCounts: [1, 0],
            nodeStack: [
                {
                    node: parent,
                    refNode: br,
                },
                {
                    listType: 'OL',
                    node: existingOL,
                    refNode: null,
                },
                {
                    listType: 'OL',
                    node: existingOL.firstChild as HTMLElement,
                    dataset: {},
                    format: {},
                    refNode: null,
                },
            ],
        });
        expect(result).toBe(br);
    });

    it('With onNodeCreated', () => {
        const listLevel0 = createListLevel('OL');
        const listLevel1 = createListLevel('UL');
        const listItem: ContentModelListItem = {
            blockType: 'BlockGroup',
            blockGroupType: 'ListItem',
            blocks: [],
            format: {},
            formatHolder: {
                segmentType: 'SelectionMarker',
                format: {},
                isSelected: false,
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

    it('List style type is changed by metadata, node stack should not be changed', () => {
        const listItem: ContentModelListItem = {
            blockType: 'BlockGroup',
            blockGroupType: 'ListItem',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Br',
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
            levels: [
                {
                    listType: 'UL',
                    format: {},
                    dataset: {
                        editingInfo: '{"applyListStyleFromLevel":true}',
                    },
                },
            ],
            formatHolder: {
                segmentType: 'SelectionMarker',
                isSelected: false,
                format: {},
            },
            format: {},
        };

        context = createModelToDomContext(undefined, {
            metadataAppliers: {
                listLevel: listLevelMetadataApplier,
            },
        });

        handleList(document, parent, listItem, context, null);

        expectHtml(parent.outerHTML, [
            '<div><ul data-editing-info="{&quot;applyListStyleFromLevel&quot;:true}" style="list-style-type: disc;"></ul></div>',
            '<div><ul style="list-style-type: disc;" data-editing-info="{&quot;applyListStyleFromLevel&quot;:true}"></ul></div>',
        ]);
        expect(context.listFormat).toEqual({
            threadItemCounts: [],
            nodeStack: [
                {
                    node: parent,
                    refNode: null,
                },
                {
                    node: parent.firstChild as HTMLElement,
                    listType: 'UL',
                    dataset: { editingInfo: '{"applyListStyleFromLevel":true}' },
                    format: {},
                    refNode: null,
                },
            ],
        });
        expect(listItem.levels[0].format.listStyleType).toBe('disc');
    });

    it('List style type should be changed by metadata when there is existing UL to reuse', () => {
        const listItem: ContentModelListItem = {
            blockType: 'BlockGroup',
            blockGroupType: 'ListItem',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Br',
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
            levels: [
                {
                    listType: 'UL',
                    format: {},
                    dataset: {
                        editingInfo: '{"applyListStyleFromLevel":true}',
                    },
                },
            ],
            formatHolder: {
                segmentType: 'SelectionMarker',
                isSelected: false,
                format: {},
            },
            format: {},
        };

        context = createModelToDomContext(undefined, {
            metadataAppliers: {
                listLevel: listLevelMetadataApplier,
            },
        });

        const existingUL = document.createElement('ul');
        context.listFormat.nodeStack = [
            {
                node: parent,
                refNode: null,
            },
            {
                node: existingUL,
                listType: 'UL',
                dataset: {
                    editingInfo: '{"applyListStyleFromLevel":true}',
                },
                format: {},
                refNode: null,
            },
        ];

        const applyFormatSpy = spyOn(applyFormat, 'applyFormat').and.callThrough();
        const applyMetadataSpy = spyOn(applyMetadata, 'applyMetadata').and.callThrough();

        handleList(document, parent, listItem, context, null);

        expect(applyMetadataSpy).toHaveBeenCalledTimes(1);
        expect(applyMetadataSpy).toHaveBeenCalledWith(
            listItem.levels[0],
            context.metadataAppliers.listLevel as any,
            listItem.levels[0].format,
            context
        );
        expect(applyFormatSpy).not.toHaveBeenCalled();

        expectHtml(parent.outerHTML, ['<div></div>']);
        expect(context.listFormat).toEqual({
            threadItemCounts: [],
            nodeStack: [
                {
                    node: parent,
                    refNode: null,
                },
                {
                    node: existingUL,
                    listType: 'UL',
                    dataset: { editingInfo: '{"applyListStyleFromLevel":true}' },
                    format: {},
                    refNode: null,
                },
            ],
        });
        expect(listItem.levels[0].format.listStyleType).toBe('disc');
    });
});

describe('handleList with cache', () => {
    let reuseCachedElementSpy: jasmine.Spy;

    beforeEach(() => {
        reuseCachedElementSpy = spyOn(reuseCachedElement, 'reuseCachedElement').and.callThrough();
    });

    it('Single level list without cached element', () => {
        const context = createModelToDomContext();
        const parent = document.createElement('div');
        const cachedUL = document.createElement('ul');
        const listItem = createListItem([
            {
                listType: 'UL',
                format: {},
                dataset: {},
            },
        ]);

        parent.appendChild(cachedUL);
        context.allowCacheListItem = true;

        const newRefNode = handleList(document, parent, listItem, context, cachedUL);

        expect(parent.outerHTML).toBe('<div><ul></ul><ul></ul></div>');
        expect(parent.firstChild).not.toBe(cachedUL);
        expect(parent.lastChild).toBe(cachedUL);
        expect(context.listFormat).toEqual({
            threadItemCounts: [],
            nodeStack: [
                {
                    node: parent,
                    refNode: cachedUL,
                },
                {
                    node: cachedUL,
                    listType: 'UL',
                    dataset: {},
                    format: {},
                    refNode: null,
                },
            ],
        });
        expect(reuseCachedElementSpy).not.toHaveBeenCalled();
        expect(listItem.levels[0].cachedElement).toBe(parent.firstChild as any);
        expect(newRefNode).toBe(cachedUL);
    });

    it('Single level list with cached element', () => {
        const context = createModelToDomContext();
        const parent = document.createElement('div');
        const cachedUL = document.createElement('ul');
        const listItem = createListItem([
            {
                listType: 'UL',
                format: {},
                dataset: {},
            },
        ]);

        listItem.levels[0].cachedElement = cachedUL;
        parent.appendChild(cachedUL);
        context.allowCacheListItem = true;

        const newRefNode = handleList(document, parent, listItem, context, cachedUL);

        expect(parent.outerHTML).toBe('<div><ul></ul></div>');
        expect(parent.firstChild).toBe(cachedUL);
        expect(context.listFormat).toEqual({
            threadItemCounts: [],
            nodeStack: [
                {
                    node: parent,
                    refNode: null,
                },
                {
                    node: cachedUL,
                    listType: 'UL',
                    dataset: {},
                    format: {},
                    refNode: null,
                },
            ],
        });
        expect(reuseCachedElementSpy).toHaveBeenCalledWith(
            parent,
            cachedUL,
            cachedUL,
            context.rewriteFromModel
        );
        expect(listItem.levels[0].cachedElement).toBe(cachedUL);
        expect(newRefNode).toBeNull();
    });

    it('Single level list with cached element which does not match existing refNode', () => {
        const context = createModelToDomContext();
        const parent = document.createElement('div');
        const cachedUL = document.createElement('ul');
        const refNode = document.createElement('br');
        const listItem = createListItem([
            {
                listType: 'UL',
                format: {},
                dataset: {},
            },
        ]);

        listItem.levels[0].cachedElement = cachedUL;
        parent.appendChild(refNode);
        context.allowCacheListItem = true;

        const newRefNode = handleList(document, parent, listItem, context, refNode);

        expect(parent.outerHTML).toBe('<div><ul></ul><br></div>');
        expect(parent.firstChild).toBe(cachedUL);
        expect(context.listFormat).toEqual({
            threadItemCounts: [],
            nodeStack: [
                {
                    node: parent,
                    refNode: refNode,
                },
                {
                    node: cachedUL,
                    listType: 'UL',
                    dataset: {},
                    format: {},
                    refNode: null,
                },
            ],
        });
        expect(reuseCachedElementSpy).toHaveBeenCalledWith(
            parent,
            cachedUL,
            refNode,
            context.rewriteFromModel
        );
        expect(listItem.levels[0].cachedElement).toBe(cachedUL);
        expect(newRefNode).toBe(refNode);
    });

    it('Cached element needs to be formatted again', () => {
        const context = createModelToDomContext();
        const parent = document.createElement('div');
        const cachedUL = document.createElement('ol');
        const listItem = createListItem([
            {
                listType: 'OL',
                format: { listStyleType: 'circle', startNumberOverride: 2 },
                dataset: {},
            },
        ]);
        listItem.levels[0].cachedElement = cachedUL;

        parent.appendChild(cachedUL);
        context.allowCacheListItem = true;

        const newRefNode = handleList(document, parent, listItem, context, cachedUL);

        expect(parent.outerHTML).toBe(
            '<div><ol start="2" style="list-style-type: circle;"></ol></div>'
        );
        expect(parent.firstChild).toBe(cachedUL);
        expect(context.listFormat).toEqual({
            threadItemCounts: [1],
            nodeStack: [
                {
                    node: parent,
                    refNode: null,
                },
                {
                    node: cachedUL,
                    listType: 'OL',
                    dataset: {},
                    format: { listStyleType: 'circle', startNumberOverride: 2 },
                    refNode: null,
                },
            ],
        });

        expect(listItem.levels[0].cachedElement).toBe(cachedUL);
        expect(newRefNode).toBeNull();
    });

    it('Multiple level list with cached elements', () => {
        const context = createModelToDomContext();
        const parent = document.createElement('div');
        const cachedOL = document.createElement('ol');
        const cachedUL = document.createElement('ul');
        const listItem = createListItem([
            {
                listType: 'OL',
                format: {},
                dataset: {},
            },
            {
                listType: 'UL',
                format: {},
                dataset: {},
            },
        ]);
        listItem.levels[0].cachedElement = cachedOL;
        listItem.levels[1].cachedElement = cachedUL;
        parent.appendChild(cachedOL);
        cachedOL.appendChild(cachedUL);
        context.allowCacheListItem = true;
        const newRefNode = handleList(document, parent, listItem, context, cachedUL);

        expect(parent.outerHTML).toBe('<div><ol start="1"><ul></ul></ol></div>');
        expect(parent.firstChild).toBe(cachedOL);
        expect(cachedOL.firstChild).toBe(cachedUL);
        expect(context.listFormat).toEqual({
            threadItemCounts: [0],
            nodeStack: [
                {
                    node: parent,
                    refNode: null,
                },
                {
                    node: cachedOL,
                    listType: 'OL',
                    dataset: {},
                    format: {},
                    refNode: null,
                },
                {
                    node: cachedUL,
                    listType: 'UL',
                    dataset: {},
                    format: {},
                    refNode: null,
                },
            ],
        });
        expect(listItem.levels[0].cachedElement).toBe(cachedOL);
        expect(listItem.levels[1].cachedElement).toBe(cachedUL);
        expect(newRefNode).toBeNull();
    });

    it('Multiple level list with partial cached elements', () => {
        const context = createModelToDomContext();
        const parent = document.createElement('div');
        const cachedUL = document.createElement('ul');
        const refNode = document.createElement('br');
        const listItem = createListItem([
            {
                listType: 'OL',
                format: {},
                dataset: {},
            },
            {
                listType: 'UL',
                format: {},
                dataset: {},
            },
        ]);

        parent.appendChild(refNode);
        listItem.levels[1].cachedElement = cachedUL;
        context.allowCacheListItem = true;
        const newRefNode = handleList(document, parent, listItem, context, refNode);

        expect(parent.outerHTML).toBe('<div><ol start="1"><ul></ul></ol><br></div>');
        expect(parent.firstChild!.firstChild).toBe(cachedUL);
        expect(context.listFormat).toEqual({
            threadItemCounts: [0],
            nodeStack: [
                {
                    node: parent,
                    refNode: refNode,
                },
                {
                    node: parent.firstChild as HTMLElement,
                    listType: 'OL',
                    dataset: {},
                    format: {},
                    refNode: null,
                },
                {
                    node: cachedUL,
                    listType: 'UL',
                    dataset: {},
                    format: {},
                    refNode: null,
                },
            ],
        });
        expect(listItem.levels[0].cachedElement).toBe(parent.firstChild as any);
        expect(listItem.levels[1].cachedElement).toBe(cachedUL);
        expect(newRefNode).toBe(refNode);
    });

    it('Existing list is deeper than list item levels - 1', () => {
        const context = createModelToDomContext();
        const parent = document.createElement('div');
        const existingOL1 = document.createElement('ol');
        const existingOL2 = document.createElement('ol');
        const existingLI = document.createElement('li');
        const listItem = createListItem([
            {
                listType: 'OL',
                format: {},
                dataset: {},
            },
        ]);

        listItem.levels[0].cachedElement = existingOL1;
        parent.appendChild(existingOL1);
        existingOL1.appendChild(existingLI);
        existingOL1.appendChild(existingOL2);
        context.allowCacheListItem = true;

        context.listFormat.nodeStack = [
            { node: parent, refNode: existingOL1 },
            { node: existingOL1, listType: 'OL', refNode: existingOL2 },
            { node: existingOL2, listType: 'OL', refNode: null },
        ];

        const newRefNode = handleList(document, parent, listItem, context, existingOL1);

        // We will just create new list item here but not remove existing ones, they should be removed in handleBlockGroupChildren()
        expect(parent.outerHTML).toBe('<div><ol><li></li><ol></ol></ol></div>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [],
            nodeStack: [
                {
                    node: parent,
                    refNode: null,
                },
                {
                    node: existingOL1,
                    listType: 'OL',
                    refNode: existingOL2,
                },
            ],
        });
        expect(newRefNode).toBeNull();
    });

    it('Existing list is deeper than list item levels - 2', () => {
        const context = createModelToDomContext();
        const parent = document.createElement('div');
        const existingOL1 = document.createElement('ol');
        const existingOL2 = document.createElement('ol');
        const existingLI1 = document.createElement('li');
        const existingLI2 = document.createElement('li');
        const existingLI3 = document.createElement('li');

        existingOL1.appendChild(existingLI1);
        existingOL2.appendChild(existingLI2);
        existingOL2.appendChild(existingLI3);
        existingOL1.appendChild(existingOL2);
        parent.appendChild(existingOL1);

        const listItem = createListItem([
            {
                listType: 'OL',
                format: {},
                dataset: {},
            },
        ]);

        listItem.levels[0].cachedElement = existingOL1;
        context.allowCacheListItem = true;

        context.listFormat.nodeStack = [
            { node: parent, refNode: null },
            { node: existingOL1, listType: 'OL', refNode: null },
            { node: existingOL2, listType: 'OL', refNode: existingLI3 },
        ];

        const newRefNode = handleList(document, parent, listItem, context, null);

        // We will just create new list item here but not remove existing ones, they should be removed in handleBlockGroupChildren()
        expect(parent.outerHTML).toBe('<div><ol><li></li><ol><li></li></ol></ol></div>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [],
            nodeStack: [
                {
                    node: parent,
                    refNode: null,
                },
                {
                    node: existingOL1,
                    listType: 'OL',
                    refNode: null,
                },
            ],
        });
        expect(newRefNode).toBeNull();
    });
});
