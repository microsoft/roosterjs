import * as applyFormat from '../../../lib/modelToDom/utils/applyFormat';
import * as handleBlockGroupChildren from '../../../lib/modelToDom/handlers/handleBlockGroupChildren';
import * as handleList from '../../../lib/modelToDom/handlers/handleList';
import { createListItem } from '../../../lib/modelApi/creators/createListItem';
import { createListLevel } from '../../../lib/modelApi/creators/createListLevel';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';
import { createText } from '../../../lib';
import { handleListItem } from '../../../lib/modelToDom/handlers/handleListItem';
import {
    ContentModelBlockGroup,
    ContentModelListItem,
    ModelToDomContext,
    ContentModelBlockHandler,
    ContentModelHandler,
    ListMetadataFormat,
    ContentModelListItemFormat,
    ApplyMetadata,
} from 'roosterjs-content-model-types';

describe('handleListItem without format handler', () => {
    let context: ModelToDomContext;
    let handleBlockGroupChildrenSpy: jasmine.Spy<ContentModelHandler<ContentModelBlockGroup>>;
    let handleListSpy: jasmine.Spy<ContentModelBlockHandler<ContentModelListItem>>;
    let listItemMetadataApplier: jasmine.Spy<ApplyMetadata<
        ListMetadataFormat,
        ContentModelListItemFormat
    >>;

    beforeEach(() => {
        handleBlockGroupChildrenSpy = spyOn(handleBlockGroupChildren, 'handleBlockGroupChildren');
        handleListSpy = spyOn(handleList, 'handleList').and.callThrough();
        listItemMetadataApplier = jasmine.createSpy('listItemMetadataApplier');

        context = createModelToDomContext(undefined, {
            modelHandlerOverride: {
                blockGroupChildren: handleBlockGroupChildrenSpy,
                list: handleListSpy,
            },
            formatApplierOverride: {
                listItemThread: null,
            },
            metadataAppliers: {
                listItem: { applierFunction: listItemMetadataApplier },
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
        expect(handleListSpy).toHaveBeenCalledTimes(1);
        expect(handleListSpy).toHaveBeenCalledWith(document, parent, listItem, context, null);
        expect(applyFormat.applyFormat).not.toHaveBeenCalledTimes(1);
        expect(handleBlockGroupChildrenSpy).toHaveBeenCalledTimes(1);
        expect(handleBlockGroupChildrenSpy).toHaveBeenCalledWith(
            document,
            document.createElement('li'),
            listItem,
            context
        );
        expect(paragraph.isImplicit).toBeFalse();
        expect(context.domModification).toEqual({
            addedBlockElements: [document.createElement('li')],
            removedBlockElements: [],
        });
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
        expect(handleListSpy).toHaveBeenCalledTimes(1);
        expect(handleListSpy).toHaveBeenCalledWith(document, parent, listItem, context, null);
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
            context.formatAppliers.listItemThread,
            listItem.levels[0].format,
            context
        );
        expect(listItemMetadataApplier).toHaveBeenCalledWith(null, listItem.format, context);
        expect(handleBlockGroupChildrenSpy).toHaveBeenCalledTimes(1);
        expect(handleBlockGroupChildrenSpy).toHaveBeenCalledWith(
            document,
            parent.firstChild as HTMLElement,
            listItem,
            context
        );
        expect(context.domModification).toEqual({
            addedBlockElements: [document.createElement('li')],
            removedBlockElements: [],
        });
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
        expect(handleListSpy).toHaveBeenCalledTimes(1);
        expect(handleListSpy).toHaveBeenCalledWith(document, parent, listItem, context, null);
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
            context.formatAppliers.listItemThread,
            listItem.levels[0].format,
            context
        );
        expect(listItemMetadataApplier).toHaveBeenCalledWith(null, listItem.format, context);
        expect(handleBlockGroupChildrenSpy).toHaveBeenCalledTimes(1);
        expect(handleBlockGroupChildrenSpy).toHaveBeenCalledWith(
            document,
            parent.firstChild as HTMLElement,
            listItem,
            context
        );
        expect(context.domModification).toEqual({
            addedBlockElements: [document.createElement('li')],
            removedBlockElements: [],
        });
    });

    it('UL with refNode', () => {
        const listItem = createListItem([createListLevel('UL')]);
        const br = document.createElement('br');
        const parent = document.createElement('div');

        parent.appendChild(br);

        const result = handleListItem(document, parent, listItem, context, br);

        expect(parent.outerHTML).toBe('<div><ul><li></li></ul><br></div>');
        expect(handleListSpy).toHaveBeenCalledTimes(1);
        expect(handleListSpy).toHaveBeenCalledWith(document, parent, listItem, context, br);
        expect(applyFormat.applyFormat).toHaveBeenCalled();
        expect(handleBlockGroupChildrenSpy).toHaveBeenCalledTimes(1);
        expect(handleBlockGroupChildrenSpy).toHaveBeenCalledWith(
            document,
            parent.firstChild!.firstChild as HTMLElement,
            listItem,
            context
        );
        expect(result).toBe(br);
        expect(context.domModification).toEqual({
            addedBlockElements: [document.createElement('li')],
            removedBlockElements: [],
        });
    });

    it('UL with same format on list and segment', () => {
        const listItem = createListItem([createListLevel('UL')], {
            fontFamily: 'Arial',
            fontSize: '10pt',
            textColor: 'red',
        });
        const para = createParagraph();
        const text = createText('test', {
            fontFamily: 'Arial',
            fontSize: '10pt',
            textColor: 'red',
        });

        para.segments.push(text);
        listItem.blocks.push(para);

        handleBlockGroupChildrenSpy.and.callThrough();

        const parent = document.createElement('div');
        const result = handleListItem(document, parent, listItem, context, null);

        expect(parent.outerHTML).toBe(
            '<div><ul><li style="font-family: Arial; font-size: 10pt; color: red;"><div>test</div></li></ul></div>'
        );
        expect(handleListSpy).toHaveBeenCalledTimes(1);
        expect(handleListSpy).toHaveBeenCalledWith(document, parent, listItem, context, null);
        expect(applyFormat.applyFormat).toHaveBeenCalled();
        expect(handleBlockGroupChildrenSpy).toHaveBeenCalledTimes(1);
        expect(handleBlockGroupChildrenSpy).toHaveBeenCalledWith(
            document,
            parent.firstChild!.firstChild as HTMLElement,
            listItem,
            context
        );
        expect(result).toBe(null);

        const li = parent.firstChild!.firstChild as HTMLElement;

        expect(li.tagName).toBe('LI');

        expect(context.domModification).toEqual({
            addedBlockElements: [li, li.firstChild as HTMLElement],
            removedBlockElements: [],
        });
    });

    it('UL with different format on list and segment', () => {
        const listItem = createListItem([createListLevel('UL')], {
            fontFamily: 'Arial',
            fontSize: '10pt',
            textColor: 'red',
        });
        const para = createParagraph();
        const text = createText('test', {
            fontFamily: 'Arial',
            fontSize: '12pt',
            textColor: 'green',
        });

        para.segments.push(text);
        listItem.blocks.push(para);

        handleBlockGroupChildrenSpy.and.callThrough();

        const parent = document.createElement('div');
        const result = handleListItem(document, parent, listItem, context, null);

        expect(parent.outerHTML).toBe(
            '<div><ul><li style="font-family: Arial; font-size: 10pt; color: red;"><div><span style="font-size: 12pt; color: green;">test</span></div></li></ul></div>'
        );
        expect(handleListSpy).toHaveBeenCalledTimes(1);
        expect(handleListSpy).toHaveBeenCalledWith(document, parent, listItem, context, null);
        expect(applyFormat.applyFormat).toHaveBeenCalled();
        expect(handleBlockGroupChildrenSpy).toHaveBeenCalledTimes(1);
        expect(handleBlockGroupChildrenSpy).toHaveBeenCalledWith(
            document,
            parent.firstChild!.firstChild as HTMLElement,
            listItem,
            context
        );
        expect(result).toBe(null);

        const li = parent.firstChild!.firstChild as HTMLElement;

        expect(li.tagName).toBe('LI');

        expect(context.domModification).toEqual({
            addedBlockElements: [li, li.firstChild as HTMLElement],
            removedBlockElements: [],
        });
    });

    it('With onNodeCreated', () => {
        const listLevel0 = createListLevel('OL');
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
        expect(context.domModification).toEqual({
            addedBlockElements: [document.createElement('li')],
            removedBlockElements: [],
        });
    });
});
