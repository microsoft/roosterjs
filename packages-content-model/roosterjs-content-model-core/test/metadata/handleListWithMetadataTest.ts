import { expectHtml, itChromeOnly } from 'roosterjs-editor-dom/test/DomTestHelper';
import { handleList } from 'roosterjs-content-model-dom/lib/modelToDom/handlers/handleList';
import { ModelToDomContext } from 'roosterjs-content-model-types';
import {
    createListItem,
    createListLevel,
    createModelToDomContext,
} from 'roosterjs-content-model-dom';
import {
    listItemMetadataApplier,
    listLevelMetadataApplier,
} from '../../lib/metadata/updateListMetadata';

describe('handleList with metadata', () => {
    let context: ModelToDomContext;
    let parent: HTMLDivElement;

    beforeEach(() => {
        context = createModelToDomContext(undefined, {
            metadataAppliers: {
                listItem: listItemMetadataApplier,
                listLevel: listLevelMetadataApplier,
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
        const listItem = createListItem([createListLevel('UL')]);

        handleList(document, parent, listItem, context, null);

        expect(parent.outerHTML).toBe('<div><ul style="list-style-type: disc;"></ul></div>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [],
            nodeStack: [
                {
                    node: parent,
                },
                {
                    listType: 'UL',
                    node: parent.firstChild as HTMLElement,
                    dataset: {},
                    format: {
                        listStyleType: 'disc',
                    },
                },
            ],
        });
    });

    it('Empty context, single OL list item', () => {
        const listItem = createListItem([createListLevel('OL')]);

        handleList(document, parent, listItem, context, null);
        const possibleResults = [
            '<div><ol start="1" style="list-style-type: decimal;"></ol></div>',
        ];

        expectHtml(parent.outerHTML, possibleResults);
        expect(context.listFormat).toEqual({
            threadItemCounts: [0],
            nodeStack: [
                {
                    node: parent,
                },
                {
                    listType: 'OL',
                    node: parent.firstChild as HTMLElement,
                    dataset: {},
                    format: {
                        listStyleType: 'decimal',
                    },
                },
            ],
        });
    });

    it('Context has OL, single OL list item, reuse existing OL element', () => {
        const existingOL = document.createElement('ol');
        const listItem = createListItem([createListLevel('OL')]);

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
            createListLevel('OL', {}, { editingInfo: JSON.stringify({ orderedStyleType: 2 }) }),
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
                    dataset: { editingInfo: JSON.stringify({ orderedStyleType: 2 }) },
                    format: {},
                },
            ],
        });
    });

    itChromeOnly('Context has OL, 2 level OL list item, reuse existing OL element', () => {
        const existingOL = document.createElement('ol');
        const listItem = createListItem([
            createListLevel('OL'),
            createListLevel('OL', {}, { editingInfo: JSON.stringify({ orderedStyleType: 2 }) }),
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
                    dataset: { editingInfo: JSON.stringify({ orderedStyleType: 2 }) },
                    format: {},
                },
            ],
        });
    });

    itChromeOnly('Context has OL, 2 level OL list item, do not reuse existing OL element', () => {
        const existingOL = document.createElement('ol');
        const listItem = createListItem([
            createListLevel(
                'OL',
                {},
                {
                    editingInfo: JSON.stringify({
                        unorderedStyleType: 3,
                    }),
                }
            ),
            createListLevel('OL'),
        ]);

        context.listFormat.threadItemCounts = [1];
        context.listFormat.nodeStack = [{ node: parent }, { node: existingOL, listType: 'OL' }];

        parent.appendChild(existingOL);

        handleList(document, parent, listItem, context, null);

        expect(parent.outerHTML).toBe(
            '<div><ol></ol><ol start="2" data-editing-info="{&quot;unorderedStyleType&quot;:3}" style="list-style-type: decimal;"><ol start="1" style="list-style-type: lower-alpha;"></ol></ol></div>'
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
                    dataset: { editingInfo: JSON.stringify({ unorderedStyleType: 3 }) },
                    format: {
                        listStyleType: 'decimal',
                    },
                },
                {
                    listType: 'OL',
                    node: (existingOL.nextSibling as HTMLElement).firstChild as HTMLElement,
                    dataset: {},
                    format: {
                        listStyleType: 'lower-alpha',
                    },
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

        const listItem = createListItem([createListLevel('OL')]);

        context.listFormat.threadItemCounts = [1];
        context.listFormat.nodeStack = [
            { node: parent },
            { node: existingOL1, listType: 'UL' },
            { node: existingOL2, listType: 'OL' },
        ];

        handleList(document, parent, listItem, context, null);
        const possibleResults = [
            '<div><ul><ol></ol></ul><ol start="2" style="list-style-type: decimal;"></ol></div>',
        ];

        expectHtml(parent.outerHTML, possibleResults);

        expect(context.listFormat).toEqual({
            threadItemCounts: [1],
            nodeStack: [
                {
                    node: parent,
                },
                {
                    listType: 'OL',
                    node: existingOL1.nextSibling as HTMLElement,
                    dataset: {},
                    format: {
                        listStyleType: 'decimal',
                    },
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
            { node: parent },
            { node: existingOL1, listType: 'UL' },
            { node: existingOL2, listType: 'OL' },
        ];

        handleList(document, parent, listItem, context, null);

        const possibleResults = [
            '<div><ul><ol></ol><ol start="3" style="list-style-type: lower-alpha;"></ol></ul></div>',
        ];

        expectHtml(parent.outerHTML, possibleResults);

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
                    dataset: {},
                    format: {
                        startNumberOverride: 3,
                        listStyleType: 'lower-alpha',
                    },
                },
            ],
        });
    });

    it('List with margin and padding', () => {
        const listItem = createListItem([
            createListLevel('UL', {
                marginLeft: '1px',
                marginRight: '2px',
                marginTop: '3px',
                marginBottom: '4px',
                paddingLeft: '5px',
                paddingRight: '6px',
                paddingTop: '7px',
                paddingBottom: '8px',
            }),
        ]);

        handleList(document, parent, listItem, context, null);

        expect(parent.outerHTML).toBe(
            '<div><ul style="margin: 3px 2px 4px 1px; padding: 7px 6px 8px 5px; list-style-type: disc;"></ul></div>'
        );
    });
});
