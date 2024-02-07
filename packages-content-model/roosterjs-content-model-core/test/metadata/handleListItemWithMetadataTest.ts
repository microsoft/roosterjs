import * as applyFormat from 'roosterjs-content-model-dom/lib/modelToDom/utils/applyFormat';
import { expectHtml } from 'roosterjs-content-model-dom/test/testUtils';
import { handleList as originalHandleList } from 'roosterjs-content-model-dom/lib/modelToDom/handlers/handleList';
import { handleListItem } from 'roosterjs-content-model-dom/lib/modelToDom/handlers/handleListItem';
import {
    createListItem,
    createListLevel,
    createModelToDomContext,
    createParagraph,
} from 'roosterjs-content-model-dom';
import {
    ContentModelBlockGroup,
    ContentModelBlockHandler,
    ContentModelHandler,
    ContentModelListItem,
    ModelToDomContext,
} from 'roosterjs-content-model-types';
import {
    listItemMetadataApplier,
    listLevelMetadataApplier,
} from '../../lib/metadata/updateListMetadata';

describe('handleListItem with metadata', () => {
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
            metadataAppliers: {
                listItem: listItemMetadataApplier,
                listLevel: listLevelMetadataApplier,
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
        const listItem = createListItem([createListLevel('OL')]);

        fragment.appendChild(parent);
        context.listFormat.threadItemCounts = [0];
        context.listFormat.nodeStack = [
            {
                node: fragment,
            },
            {
                node: parent,
                listType: 'OL',
                dataset: {},
                format: {},
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
                    format: {},
                    dataset: {},
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
            context.formatAppliers.listItemThread,
            listItem.levels[0].format,
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
        const listItem = createListItem([createListLevel('UL')]);

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
            context.formatAppliers.listItemThread,
            listItem.levels[0].format,
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
        const listItem = createListItem([createListLevel('OL')]);

        listItem.format.textAlign = 'center';

        handleListItem(document, parent, listItem, context, null);

        const expectedResult = [
            '<div><ol start="1" style="flex-direction: column; display: flex;"><li style="align-self: center;"></li></ol></div>',
        ];

        expectHtml(parent.outerHTML, expectedResult);
        expect(context.listFormat).toEqual({
            threadItemCounts: [1],
            nodeStack: [
                {
                    node: parent,
                },
                {
                    node: parent.firstChild as HTMLOListElement,
                    listType: 'OL',
                    format: {},
                    dataset: {},
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
