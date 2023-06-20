import * as applyFormat from '../../../lib/modelToDom/utils/applyFormat';
import { ContentModelBlock } from '../../../lib/publicTypes/block/ContentModelBlock';
import { ContentModelBlockGroup } from '../../../lib/publicTypes/group/ContentModelBlockGroup';
import { ContentModelDivider } from '../../../lib/publicTypes/block/ContentModelDivider';
import { ContentModelEntity } from '../../../lib/publicTypes/entity/ContentModelEntity';
import { ContentModelFormatContainer } from '../../../lib/publicTypes/group/ContentModelFormatContainer';
import { ContentModelGeneralBlock } from '../../../lib/publicTypes/group/ContentModelGeneralBlock';
import { ContentModelGeneralSegment } from '../../../lib/publicTypes/segment/ContentModelGeneralSegment';
import { ContentModelListItem } from '../../../lib/publicTypes/group/ContentModelListItem';
import { ContentModelParagraph } from '../../../lib/publicTypes/block/ContentModelParagraph';
import { createGeneralBlock } from '../../../lib/modelApi/creators/createGeneralBlock';
import { createListItem } from '../../../lib/modelApi/creators/createListItem';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { createQuote } from '../../../lib/modelApi/creators/createQuote';
import { handleBlock } from '../../../lib/modelToDom/handlers/handleBlock';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';
import {
    ContentModelBlockHandler,
    ContentModelHandler,
} from '../../../lib/publicTypes/context/ContentModelHandler';

describe('handleBlock', () => {
    let parent: HTMLElement;
    let context: ModelToDomContext;
    let handleEntity: jasmine.Spy<ContentModelBlockHandler<ContentModelEntity>>;
    let handleParagraph: jasmine.Spy<ContentModelBlockHandler<ContentModelParagraph>>;
    let handleDivider: jasmine.Spy<ContentModelBlockHandler<ContentModelDivider>>;

    beforeEach(() => {
        handleEntity = jasmine.createSpy('handleEntity');
        handleParagraph = jasmine.createSpy('handleParagraph');
        handleDivider = jasmine.createSpy('handleDivider');

        context = createModelToDomContext(undefined, {
            modelHandlerOverride: {
                entity: handleEntity,
                paragraph: handleParagraph,
                divider: handleDivider,
            },
        });
    });

    function runTest(block: ContentModelBlock, expectedInnerHTML: string) {
        parent = document.createElement('div');

        handleBlock(document, parent, block, context, null);
    }

    function runTestWithRefNode(block: ContentModelBlock, expectedInnerHTML: string) {
        const br = document.createElement('br');

        parent = document.createElement('div');
        parent.appendChild(br);

        handleBlock(document, parent, block, context, br);

        expect(parent.innerHTML).toBe(expectedInnerHTML);
    }

    it('Paragraph', () => {
        const paragraph: ContentModelBlock = {
            blockType: 'Paragraph',
            segments: [],
            format: {},
        };

        runTest(paragraph, '');

        expect(handleParagraph).toHaveBeenCalledTimes(1);
        expect(handleParagraph).toHaveBeenCalledWith(document, parent, paragraph, context, null);

        runTestWithRefNode(paragraph, '<br>');
    });

    it('General block without child', () => {
        const element = document.createElement('span');
        const block: ContentModelBlock = {
            blockType: 'BlockGroup',
            blockGroupType: 'General',
            blocks: [],
            element: element,
            format: {},
        };

        runTest(block, '<span></span>');

        expect(handleParagraph).toHaveBeenCalledTimes(0);

        runTestWithRefNode(block, '<span></span><br>');
    });

    it('General block with 1 child', () => {
        const element = document.createElement('span');
        const paragraph: ContentModelBlock = {
            blockType: 'Paragraph',
            segments: [],
            format: {},
        };
        const block: ContentModelBlock = {
            blockType: 'BlockGroup',
            blockGroupType: 'General',
            blocks: [paragraph],
            element: element,
            format: {},
        };

        runTest(block, '<span></span>');

        expect(handleParagraph).toHaveBeenCalledTimes(1);
        expect(handleParagraph).toHaveBeenCalledWith(document, element, paragraph, context, null);

        runTestWithRefNode(block, '<span></span><br>');
    });

    it('General segment', () => {
        const element = document.createElement('span');
        const block: ContentModelGeneralSegment = {
            blockType: 'BlockGroup',
            blockGroupType: 'General',
            segmentType: 'General',
            blocks: [],
            element: element,
            format: {},
        };

        parent = document.createElement('div');

        spyOn(applyFormat, 'applyFormat');
        handleBlock(document, parent, block, context, null);

        expect(parent.innerHTML).toBe('<span><span></span></span>');
        expect(parent.firstChild).not.toBe(element);
        expect(context.regularSelection.current.segment).toBe(parent.firstChild!.firstChild);
        expect(applyFormat.applyFormat).toHaveBeenCalled();

        runTestWithRefNode(block, '<span><span></span></span><br>');
    });

    it('Entity block', () => {
        const element = document.createElement('div');
        const block: ContentModelEntity = {
            blockType: 'Entity',
            segmentType: 'Entity',
            format: {},
            wrapper: element,
            type: 'entity',
            id: 'entity_1',
            isReadonly: true,
        };

        parent = document.createElement('div');

        handleBlock(document, parent, block, context, null);

        expect(handleEntity).toHaveBeenCalledWith(document, parent, block, context, null);

        runTestWithRefNode(block, '<br>');
    });

    it('HR block', () => {
        const block: ContentModelDivider = {
            blockType: 'Divider',
            tagName: 'hr',
            format: {},
        };

        parent = document.createElement('div');

        handleBlock(document, parent, block, context, null);

        expect(handleDivider).toHaveBeenCalledWith(document, parent, block, context, null);

        runTestWithRefNode(block, '<br>');
    });
});

describe('handleBlockGroup', () => {
    let context: ModelToDomContext;
    let parent: HTMLDivElement;
    let handleBlockGroupChildren: jasmine.Spy<ContentModelHandler<ContentModelBlockGroup>>;
    let handleListItem: jasmine.Spy<ContentModelBlockHandler<ContentModelListItem>>;
    let handleQuote: jasmine.Spy<ContentModelBlockHandler<ContentModelFormatContainer>>;
    let handleGeneralModel: jasmine.Spy<ContentModelBlockHandler<ContentModelGeneralBlock>>;

    beforeEach(() => {
        handleBlockGroupChildren = jasmine.createSpy('handleBlockGroupChildren');
        handleListItem = jasmine.createSpy('handleListItem');
        handleQuote = jasmine.createSpy('handleQuote');
        handleGeneralModel = jasmine.createSpy('handleGeneralModel');

        context = createModelToDomContext(undefined, {
            modelHandlerOverride: {
                blockGroupChildren: handleBlockGroupChildren,
                listItem: handleListItem,
                formatContainer: handleQuote,
                general: handleGeneralModel,
            },
        });
        parent = document.createElement('div');
    });

    function runTestWithRefNode(block: ContentModelBlock, expectedInnerHTML: string) {
        const br = document.createElement('br');

        parent = document.createElement('div');
        parent.appendChild(br);

        const result = handleBlock(document, parent, block, context, br);

        expect(parent.innerHTML).toBe(expectedInnerHTML);
        expect(result).toBe(br);
    }

    it('General block', () => {
        const clonedChild = document.createElement('span');
        const childMock = ({
            cloneNode: () => clonedChild,
        } as any) as HTMLElement;
        const group = createGeneralBlock(childMock);

        handleBlock(document, parent, group, context, null);

        expect(parent.outerHTML).toBe('<div></div>');
        expect(handleGeneralModel).toHaveBeenCalledTimes(1);
        expect(handleGeneralModel).toHaveBeenCalledWith(document, parent, group, context, null);

        handleGeneralModel.and.callFake((doc, parent, model, context, refNode) => {
            parent.insertBefore(doc.createTextNode('test'), refNode);
            return refNode;
        });

        runTestWithRefNode(group, 'test<br>');
    });

    it('Quote', () => {
        const group = createQuote();

        handleBlock(document, parent, group, context, null);

        expect(parent.outerHTML).toBe('<div></div>');
        expect(handleQuote).toHaveBeenCalledTimes(1);
        expect(handleQuote).toHaveBeenCalledWith(document, parent, group, context, null);

        handleQuote.and.callFake((doc, parent, model, context, refNode) => {
            parent.insertBefore(doc.createTextNode('test'), refNode);
            return refNode;
        });

        runTestWithRefNode(group, 'test<br>');
    });

    it('ListItem', () => {
        const group = createListItem([]);

        handleBlock(document, parent, group, context, null);

        expect(parent.outerHTML).toBe('<div></div>');
        expect(handleListItem).toHaveBeenCalledTimes(1);
        expect(handleListItem).toHaveBeenCalledWith(document, parent, group, context, null);

        handleListItem.and.callFake((doc, parent, model, context, refNode) => {
            parent.insertBefore(doc.createTextNode('test'), refNode);
            return refNode;
        });

        runTestWithRefNode(group, 'test<br>');
    });
});
