import * as applyFormat from '../../../lib/modelToDom/utils/applyFormat';
import { ContentModelBlock } from '../../../lib/publicTypes/block/ContentModelBlock';
import { ContentModelEntity } from '../../../lib/publicTypes/entity/ContentModelEntity';
import { ContentModelGeneralSegment } from '../../../lib/publicTypes/segment/ContentModelGeneralSegment';
import { ContentModelHandler } from '../../../lib/publicTypes/context/ContentModelHandler';
import { ContentModelParagraph } from '../../../lib/publicTypes/block/ContentModelParagraph';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { handleBlock } from '../../../lib/modelToDom/handlers/handleBlock';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';

describe('handleBlock', () => {
    let parent: HTMLElement;
    let context: ModelToDomContext;
    let handleEntity: jasmine.Spy<ContentModelHandler<ContentModelEntity>>;
    let handleParagraph: jasmine.Spy<ContentModelHandler<ContentModelParagraph>>;

    beforeEach(() => {
        handleEntity = jasmine.createSpy('handleEntity');
        handleParagraph = jasmine.createSpy('handleParagraph');
        context = createModelToDomContext(undefined, {
            modelHandlerOverride: {
                entity: handleEntity,
                paragraph: handleParagraph,
            },
        });
    });

    function runTest(block: ContentModelBlock, expectedInnerHTML: string) {
        parent = document.createElement('div');

        handleBlock(document, parent, block, context);

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
        expect(handleParagraph).toHaveBeenCalledWith(document, parent, paragraph, context);
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
        expect(handleParagraph).toHaveBeenCalledWith(document, element, paragraph, context);
    });

    it('General block and segment', () => {
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
        handleBlock(document, parent, block, context);

        expect(parent.innerHTML).toBe('<span></span>');
        expect(parent.firstChild).not.toBe(element);
        expect(context.regularSelection.current.segment).toBe(parent.firstChild);
        expect(applyFormat.applyFormat).toHaveBeenCalledWith(
            parent.firstChild as HTMLElement,
            context.formatAppliers.segment,
            block.format,
            context
        );
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

        handleBlock(document, parent, block, context);

        expect(handleEntity).toHaveBeenCalledWith(document, parent, block, context);
    });
});
