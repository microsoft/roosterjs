import * as applyFormat from '../../../lib/modelToDom/utils/applyFormat';
import * as handleBlockGroupChildren from '../../../lib/modelToDom/handlers/handleBlockGroupChildren';
import * as handleList from '../../../lib/modelToDom/handlers/handleList';
import { createListItem } from '../../../lib/modelApi/creators/createListItem';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';
import { handleListItem } from '../../../lib/modelToDom/handlers/handleListItem';
import { ListItemFormatHandlers } from '../../../lib/formatHandlers/ListItemFormatHandlers';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';
import { SegmentFormatHandlers } from '../../../lib/formatHandlers/SegmentFormatHandlers';

describe('handleListItem', () => {
    let context: ModelToDomContext;

    beforeEach(() => {
        context = createModelToDomContext();

        spyOn(handleBlockGroupChildren, 'handleBlockGroupChildren');
        spyOn(handleList, 'handleList');
        spyOn(applyFormat, 'applyFormat').and.callThrough();
    });

    it('not an OL or UL', () => {
        const parent = document.createElement('div');
        const listItem = createListItem(undefined, [{ listType: 'OL' }]);
        const paragraph = createParagraph(true /*isImplicit*/);

        listItem.blocks.push(paragraph);

        handleListItem(document, parent, listItem, context);

        expect(parent.outerHTML).toBe('<div></div>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [],
            nodeStack: [],
        });
        expect(handleList.handleList).toHaveBeenCalledTimes(1);
        expect(handleList.handleList).toHaveBeenCalledWith(document, parent, listItem, context);
        expect(applyFormat.applyFormat).not.toHaveBeenCalled();
        expect(handleBlockGroupChildren.handleBlockGroupChildren).toHaveBeenCalledTimes(1);
        expect(handleBlockGroupChildren.handleBlockGroupChildren).toHaveBeenCalledWith(
            document,
            parent,
            listItem,
            context
        );
        expect(paragraph.isImplicit).toBeFalse();
    });

    it('OL parent', () => {
        const fragment = document.createDocumentFragment();
        const parent = document.createElement('ol');
        const listItem = createListItem(undefined, [{ listType: 'OL' }]);

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

        handleListItem(document, parent, listItem, context);

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
        expect(handleList.handleList).toHaveBeenCalledTimes(1);
        expect(handleList.handleList).toHaveBeenCalledWith(document, parent, listItem, context);
        expect(applyFormat.applyFormat).toHaveBeenCalledTimes(2);
        expect(applyFormat.applyFormat).toHaveBeenCalledWith(
            parent.firstChild as HTMLElement,
            SegmentFormatHandlers,
            listItem.formatHolder.format,
            context
        );
        expect(applyFormat.applyFormat).toHaveBeenCalledWith(
            parent.firstChild as HTMLElement,
            ListItemFormatHandlers,
            listItem.levels[0],
            context
        );
        expect(handleBlockGroupChildren.handleBlockGroupChildren).toHaveBeenCalledTimes(1);
        expect(handleBlockGroupChildren.handleBlockGroupChildren).toHaveBeenCalledWith(
            document,
            parent.firstChild as HTMLElement,
            listItem,
            context
        );
    });

    it('UL parent', () => {
        const fragment = document.createDocumentFragment();
        const parent = document.createElement('ul');
        const listItem = createListItem(undefined, [{ listType: 'UL' }]);

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

        handleListItem(document, parent, listItem, context);

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
        expect(handleList.handleList).toHaveBeenCalledTimes(1);
        expect(handleList.handleList).toHaveBeenCalledWith(document, parent, listItem, context);
        expect(applyFormat.applyFormat).toHaveBeenCalledTimes(2);
        expect(applyFormat.applyFormat).toHaveBeenCalledWith(
            parent.firstChild as HTMLElement,
            SegmentFormatHandlers,
            listItem.formatHolder.format,
            context
        );
        expect(applyFormat.applyFormat).toHaveBeenCalledWith(
            parent.firstChild as HTMLElement,
            ListItemFormatHandlers,
            listItem.levels[0],
            context
        );
        expect(handleBlockGroupChildren.handleBlockGroupChildren).toHaveBeenCalledTimes(1);
        expect(handleBlockGroupChildren.handleBlockGroupChildren).toHaveBeenCalledWith(
            document,
            parent.firstChild as HTMLElement,
            listItem,
            context
        );
    });
});

describe('handleListItem without format handler', () => {
    let context: ModelToDomContext;

    beforeEach(() => {
        context = createModelToDomContext(undefined, {
            formatApplierOverride: {
                listItemThread: null,
                listItemMetadata: null,
            },
        });

        spyOn(handleBlockGroupChildren, 'handleBlockGroupChildren');
        spyOn(handleList, 'handleList');
        spyOn(applyFormat, 'applyFormat').and.callThrough();
    });

    it('not an OL or UL', () => {
        const parent = document.createElement('div');
        const listItem = createListItem(undefined, [{ listType: 'OL' }]);
        const paragraph = createParagraph(true /*isImplicit*/);

        listItem.blocks.push(paragraph);

        handleListItem(document, parent, listItem, context);

        expect(parent.outerHTML).toBe('<div></div>');
        expect(context.listFormat).toEqual({
            threadItemCounts: [],
            nodeStack: [],
        });
        expect(handleList.handleList).toHaveBeenCalledTimes(1);
        expect(handleList.handleList).toHaveBeenCalledWith(document, parent, listItem, context);
        expect(applyFormat.applyFormat).not.toHaveBeenCalled();
        expect(handleBlockGroupChildren.handleBlockGroupChildren).toHaveBeenCalledTimes(1);
        expect(handleBlockGroupChildren.handleBlockGroupChildren).toHaveBeenCalledWith(
            document,
            parent,
            listItem,
            context
        );
        expect(paragraph.isImplicit).toBeFalse();
    });

    it('OL parent', () => {
        const fragment = document.createDocumentFragment();
        const parent = document.createElement('ol');
        const listItem = createListItem(undefined, [{ listType: 'OL' }]);

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

        handleListItem(document, parent, listItem, context);

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
        expect(handleList.handleList).toHaveBeenCalledTimes(1);
        expect(handleList.handleList).toHaveBeenCalledWith(document, parent, listItem, context);
        expect(applyFormat.applyFormat).toHaveBeenCalledTimes(2);
        expect(applyFormat.applyFormat).toHaveBeenCalledWith(
            parent.firstChild as HTMLElement,
            SegmentFormatHandlers,
            listItem.formatHolder.format,
            context
        );
        expect(applyFormat.applyFormat).toHaveBeenCalledWith(
            parent.firstChild as HTMLElement,
            ListItemFormatHandlers,
            listItem.levels[0],
            context
        );
        expect(handleBlockGroupChildren.handleBlockGroupChildren).toHaveBeenCalledTimes(1);
        expect(handleBlockGroupChildren.handleBlockGroupChildren).toHaveBeenCalledWith(
            document,
            parent.firstChild as HTMLElement,
            listItem,
            context
        );
    });

    it('UL parent', () => {
        const fragment = document.createDocumentFragment();
        const parent = document.createElement('ul');
        const listItem = createListItem(undefined, [{ listType: 'UL' }]);

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

        handleListItem(document, parent, listItem, context);

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
        expect(handleList.handleList).toHaveBeenCalledTimes(1);
        expect(handleList.handleList).toHaveBeenCalledWith(document, parent, listItem, context);
        expect(applyFormat.applyFormat).toHaveBeenCalledTimes(2);
        expect(applyFormat.applyFormat).toHaveBeenCalledWith(
            parent.firstChild as HTMLElement,
            SegmentFormatHandlers,
            listItem.formatHolder.format,
            context
        );
        expect(applyFormat.applyFormat).toHaveBeenCalledWith(
            parent.firstChild as HTMLElement,
            ListItemFormatHandlers,
            listItem.levels[0],
            context
        );
        expect(handleBlockGroupChildren.handleBlockGroupChildren).toHaveBeenCalledTimes(1);
        expect(handleBlockGroupChildren.handleBlockGroupChildren).toHaveBeenCalledWith(
            document,
            parent.firstChild as HTMLElement,
            listItem,
            context
        );
    });
});
