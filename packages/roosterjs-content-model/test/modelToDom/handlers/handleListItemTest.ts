import * as applyFormat from '../../../lib/modelToDom/utils/applyFormat';
import { ContentModelBlockGroup } from '../../../lib/publicTypes/group/ContentModelBlockGroup';
import { ContentModelListItem } from '../../../lib/publicTypes/group/ContentModelListItem';
import { ContentModelListItemLevelFormat } from '../../../lib/publicTypes/format/ContentModelListItemLevelFormat';
import { createListItem } from '../../../lib/modelApi/creators/createListItem';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';
import { handleList as originalHandleList } from '../../../lib/modelToDom/handlers/handleList';
import { handleListItem } from '../../../lib/modelToDom/handlers/handleListItem';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';
import {
    ContentModelBlockHandler,
    ContentModelHandler,
} from '../../../lib/publicTypes/context/ContentModelHandler';

describe('handleListItem', () => {
    let context: ModelToDomContext;
    let handleBlockGroupChildren: jasmine.Spy<ContentModelHandler<ContentModelBlockGroup>>;
    let handleList: jasmine.Spy<ContentModelBlockHandler<ContentModelListItem>>;

    beforeEach(() => {
        handleBlockGroupChildren = jasmine.createSpy('handleBlockGroupChildren');
        handleList = jasmine.createSpy('handleList').and.callFake(originalHandleList);
        context = createModelToDomContext(undefined, {
            modelHandlerOverride: {
                blockGroupChildren: handleBlockGroupChildren,
                list: handleList,
            },
        });

        spyOn(applyFormat, 'applyFormat').and.callThrough();
    });

    it('not an OL or UL', () => {
        const parent = document.createElement('div');
        const listItem = createListItem([]);
        const paragraph = createParagraph(true /*isImplicit*/);

        listItem.blocks.push(paragraph);

        handleListItem(document, parent, listItem, context, null);

        expect(parent.outerHTML).toBe('<div></div>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [],
            nodeStack: [
                {
                    node: parent,
                },
            ],
        });
        expect(handleList).toHaveBeenCalledTimes(1);
        expect(handleList).toHaveBeenCalledWith(document, parent, listItem, context, null);
        expect(applyFormat.applyFormat).not.toHaveBeenCalled();
        expect(handleBlockGroupChildren).toHaveBeenCalledTimes(1);
        expect(handleBlockGroupChildren).toHaveBeenCalledWith(
            document,
            document.createElement('li'),
            listItem,
            context
        );
        expect(paragraph.isImplicit).toBeFalse();
    });

    it('OL parent', () => {
        const fragment = document.createDocumentFragment();
        const parent = document.createElement('ol');
        const listItem = createListItem([{ listType: 'OL' }]);

        fragment.appendChild(parent);
        context.listFormat.threadItemCounts = [0];
        context.listFormat.nodeStack = [
            {
                node: fragment,
            },
            {
                node: parent,
                listType: 'OL',
            },
        ];

        handleListItem(document, parent, listItem, context, null);

        expect(parent.outerHTML).toBe('<ol><li></li></ol>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [1],
            nodeStack: [
                {
                    node: fragment,
                },
                {
                    node: parent,
                    listType: 'OL',
                },
            ],
        });
        expect(handleList).toHaveBeenCalledTimes(1);
        expect(handleList).toHaveBeenCalledWith(document, parent, listItem, context, null);
        expect(applyFormat.applyFormat).toHaveBeenCalledTimes(3);
        expect(applyFormat.applyFormat).toHaveBeenCalledWith(
            parent.firstChild as HTMLElement,
            context.formatAppliers.segment,
            listItem.formatHolder.format,
            context
        );
        expect(applyFormat.applyFormat).toHaveBeenCalledWith(
            parent.firstChild as HTMLElement,
            context.formatAppliers.listItemElement,
            listItem.format,
            context
        );
        expect(applyFormat.applyFormat).toHaveBeenCalledWith(
            parent.firstChild as HTMLElement,
            context.formatAppliers.listItem,
            listItem.levels[0],
            context
        );
        expect(handleBlockGroupChildren).toHaveBeenCalledTimes(1);
        expect(handleBlockGroupChildren).toHaveBeenCalledWith(
            document,
            parent.firstChild as HTMLElement,
            listItem,
            context
        );
    });

    it('UL parent', () => {
        const fragment = document.createDocumentFragment();
        const parent = document.createElement('ul');
        const listItem = createListItem([{ listType: 'UL' }]);

        fragment.appendChild(parent);
        context.listFormat.threadItemCounts = [0];
        context.listFormat.nodeStack = [
            {
                node: fragment,
            },
            {
                node: parent,
                listType: 'UL',
            },
        ];

        handleListItem(document, parent, listItem, context, null);

        expect(parent.outerHTML).toBe('<ul><li></li></ul>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [0],
            nodeStack: [
                {
                    node: fragment,
                },
                {
                    node: parent,
                    listType: 'UL',
                },
            ],
        });
        expect(handleList).toHaveBeenCalledTimes(1);
        expect(handleList).toHaveBeenCalledWith(document, parent, listItem, context, null);
        expect(applyFormat.applyFormat).toHaveBeenCalledTimes(3);
        expect(applyFormat.applyFormat).toHaveBeenCalledWith(
            parent.firstChild as HTMLElement,
            context.formatAppliers.segment,
            listItem.formatHolder.format,
            context
        );
        expect(applyFormat.applyFormat).toHaveBeenCalledWith(
            parent.firstChild as HTMLElement,
            context.formatAppliers.listItemElement,
            listItem.format,
            context
        );
        expect(applyFormat.applyFormat).toHaveBeenCalledWith(
            parent.firstChild as HTMLElement,
            context.formatAppliers.listItem,
            listItem.levels[0],
            context
        );
        expect(handleBlockGroupChildren).toHaveBeenCalledTimes(1);
        expect(handleBlockGroupChildren).toHaveBeenCalledWith(
            document,
            parent.firstChild as HTMLElement,
            listItem,
            context
        );
    });

    it('With refNode', () => {
        const parent = document.createElement('div');
        const br = document.createElement('br');
        const listItem = createListItem([]);
        const paragraph = createParagraph(true /*isImplicit*/);

        parent.appendChild(br);
        listItem.blocks.push(paragraph);

        handleListItem(document, parent, listItem, context, br);

        expect(parent.outerHTML).toBe('<div><br></div>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [],
            nodeStack: [
                {
                    node: parent,
                },
            ],
        });
        expect(handleList).toHaveBeenCalledTimes(1);
        expect(handleList).toHaveBeenCalledWith(document, parent, listItem, context, br);
        expect(applyFormat.applyFormat).not.toHaveBeenCalled();
        expect(handleBlockGroupChildren).toHaveBeenCalledTimes(1);
        expect(handleBlockGroupChildren).toHaveBeenCalledWith(
            document,
            document.createElement('li'),
            listItem,
            context
        );
        expect(paragraph.isImplicit).toBeFalse();
    });

    it('list item with alignment', () => {
        const parent = document.createElement('div');
        const listItem = createListItem([
            {
                listType: 'OL',
            },
        ]);

        listItem.format.textAlign = 'center';

        handleListItem(document, parent, listItem, context, null);

        const expectedResult = [
            '<div><ol start="1" style="flex-direction: column; display: flex;"><li style="align-self: center;"></li></ol></div>',
            '<div><ol style="flex-direction: column; display: flex;" start="1"><li style="align-self: center;"></li></ol></div>',
        ];

        expect(expectedResult.indexOf(parent.outerHTML)).toBeGreaterThanOrEqual(
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
                    node: parent.firstChild as HTMLOListElement,
                    listType: 'OL',
                },
            ],
        });
        expect(handleList).toHaveBeenCalledTimes(1);
        expect(handleList).toHaveBeenCalledWith(document, parent, listItem, context, null);
        expect(handleBlockGroupChildren).toHaveBeenCalledTimes(1);
        expect(handleBlockGroupChildren).toHaveBeenCalledWith(
            document,
            parent.firstChild?.firstChild as HTMLLIElement,
            listItem,
            context
        );
    });
});

describe('handleListItem without format handler', () => {
    let context: ModelToDomContext;
    let handleBlockGroupChildren: jasmine.Spy<ContentModelHandler<ContentModelBlockGroup>>;
    let handleList: jasmine.Spy<ContentModelBlockHandler<ContentModelListItem>>;

    beforeEach(() => {
        handleBlockGroupChildren = jasmine.createSpy('handleBlockGroupChildren');
        handleList = jasmine.createSpy('handleList').and.callFake(originalHandleList);
        context = createModelToDomContext(undefined, {
            modelHandlerOverride: {
                blockGroupChildren: handleBlockGroupChildren,
                list: handleList,
            },
            formatApplierOverride: {
                listItemThread: null,
                listItemMetadata: null,
            },
        });

        spyOn(applyFormat, 'applyFormat').and.callThrough();
    });

    it('not an OL or UL', () => {
        const parent = document.createElement('div');
        const listItem = createListItem([]);
        const paragraph = createParagraph(true /*isImplicit*/);

        listItem.blocks.push(paragraph);

        handleListItem(document, parent, listItem, context, null);

        expect(parent.outerHTML).toBe('<div></div>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [],
            nodeStack: [
                {
                    node: parent,
                },
            ],
        });
        expect(handleList).toHaveBeenCalledTimes(1);
        expect(handleList).toHaveBeenCalledWith(document, parent, listItem, context, null);
        expect(applyFormat.applyFormat).not.toHaveBeenCalledTimes(1);
        expect(handleBlockGroupChildren).toHaveBeenCalledTimes(1);
        expect(handleBlockGroupChildren).toHaveBeenCalledWith(
            document,
            document.createElement('li'),
            listItem,
            context
        );
        expect(paragraph.isImplicit).toBeFalse();
    });

    it('OL parent', () => {
        const fragment = document.createDocumentFragment();
        const parent = document.createElement('ol');
        const listItem = createListItem([{ listType: 'OL' }]);

        fragment.appendChild(parent);
        context.listFormat.threadItemCounts = [0];
        context.listFormat.nodeStack = [
            {
                node: fragment,
            },
            {
                node: parent,
                listType: 'OL',
            },
        ];

        handleListItem(document, parent, listItem, context, null);

        expect(parent.outerHTML).toBe('<ol><li></li></ol>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [0],
            nodeStack: [
                {
                    node: fragment,
                },
                {
                    node: parent,
                    listType: 'OL',
                },
            ],
        });
        expect(handleList).toHaveBeenCalledTimes(1);
        expect(handleList).toHaveBeenCalledWith(document, parent, listItem, context, null);
        expect(applyFormat.applyFormat).toHaveBeenCalledTimes(3);
        expect(applyFormat.applyFormat).toHaveBeenCalledWith(
            parent.firstChild as HTMLElement,
            context.formatAppliers.listItemElement,
            listItem.format,
            context
        );
        expect(applyFormat.applyFormat).toHaveBeenCalledWith(
            parent.firstChild as HTMLElement,
            context.formatAppliers.segment,
            listItem.formatHolder.format,
            context
        );
        expect(applyFormat.applyFormat).toHaveBeenCalledWith(
            parent.firstChild as HTMLElement,
            context.formatAppliers.listItem,
            listItem.levels[0],
            context
        );
        expect(handleBlockGroupChildren).toHaveBeenCalledTimes(1);
        expect(handleBlockGroupChildren).toHaveBeenCalledWith(
            document,
            parent.firstChild as HTMLElement,
            listItem,
            context
        );
    });

    it('UL parent', () => {
        const fragment = document.createDocumentFragment();
        const parent = document.createElement('ul');
        const listItem = createListItem([{ listType: 'UL' }]);

        fragment.appendChild(parent);
        context.listFormat.threadItemCounts = [0];
        context.listFormat.nodeStack = [
            {
                node: fragment,
            },
            {
                node: parent,
                listType: 'UL',
            },
        ];

        handleListItem(document, parent, listItem, context, null);

        expect(parent.outerHTML).toBe('<ul><li></li></ul>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [0],
            nodeStack: [
                {
                    node: fragment,
                },
                {
                    node: parent,
                    listType: 'UL',
                },
            ],
        });
        expect(handleList).toHaveBeenCalledTimes(1);
        expect(handleList).toHaveBeenCalledWith(document, parent, listItem, context, null);
        expect(applyFormat.applyFormat).toHaveBeenCalledTimes(3);
        expect(applyFormat.applyFormat).toHaveBeenCalledWith(
            parent.firstChild as HTMLElement,
            context.formatAppliers.listItemElement,
            listItem.format,
            context
        );
        expect(applyFormat.applyFormat).toHaveBeenCalledWith(
            parent.firstChild as HTMLElement,
            context.formatAppliers.segment,
            listItem.formatHolder.format,
            context
        );
        expect(applyFormat.applyFormat).toHaveBeenCalledWith(
            parent.firstChild as HTMLElement,
            context.formatAppliers.listItem,
            listItem.levels[0],
            context
        );
        expect(handleBlockGroupChildren).toHaveBeenCalledTimes(1);
        expect(handleBlockGroupChildren).toHaveBeenCalledWith(
            document,
            parent.firstChild as HTMLElement,
            listItem,
            context
        );
    });

    it('UL with refNode', () => {
        const listItem = createListItem([{ listType: 'UL' }]);
        const br = document.createElement('br');
        const parent = document.createElement('div');

        parent.appendChild(br);

        const result = handleListItem(document, parent, listItem, context, br);

        expect(parent.outerHTML).toBe('<div><ul><li></li></ul><br></div>');
        expect(handleList).toHaveBeenCalledTimes(1);
        expect(handleList).toHaveBeenCalledWith(document, parent, listItem, context, br);
        expect(applyFormat.applyFormat).toHaveBeenCalled();
        expect(handleBlockGroupChildren).toHaveBeenCalledTimes(1);
        expect(handleBlockGroupChildren).toHaveBeenCalledWith(
            document,
            parent.firstChild!.firstChild as HTMLElement,
            listItem,
            context
        );
        expect(result).toBe(br);
    });

    it('With onNodeCreated', () => {
        const listLevel0: ContentModelListItemLevelFormat = {
            listType: 'OL',
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
            levels: [listLevel0],
        };
        const parent = document.createElement('div');

        const onNodeCreated = jasmine.createSpy('onNodeCreated');

        context.onNodeCreated = onNodeCreated;

        handleListItem(document, parent, listItem, context, null);

        expect(
            ['<ol start="1"><li></li></ol>', '<ol start="1"><li></li></ol>'].indexOf(
                parent.innerHTML
            ) >= 0
        ).toBeTrue();
        expect(onNodeCreated).toHaveBeenCalledTimes(2);
        expect(onNodeCreated.calls.argsFor(0)[0]).toBe(listLevel0);
        expect(onNodeCreated.calls.argsFor(0)[1]).toBe(parent.querySelector('ol'));
        expect(onNodeCreated.calls.argsFor(1)[0]).toBe(listItem);
        expect(onNodeCreated.calls.argsFor(1)[1]).toBe(parent.querySelector('li'));
    });
});
