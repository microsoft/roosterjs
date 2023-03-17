import * as applyFormat from '../../../lib/modelToDom/utils/applyFormat';
import { ContentModelBlockGroup } from '../../../lib/publicTypes/group/ContentModelBlockGroup';
import { ContentModelListItem } from '../../../lib/publicTypes/group/ContentModelListItem';
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
        expect(applyFormat.applyFormat).toHaveBeenCalledTimes(2);
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
        expect(applyFormat.applyFormat).toHaveBeenCalledTimes(2);
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
        expect(applyFormat.applyFormat).toHaveBeenCalledTimes(2);
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
        expect(applyFormat.applyFormat).toHaveBeenCalledTimes(2);
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
});
