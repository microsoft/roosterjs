import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { handleSegment } from '../../../lib/modelToDom/handlers/handleSegment';
import {
    ContentModelBr,
    ContentModelEntity,
    ContentModelGeneralBlock,
    ContentModelImage,
    ContentModelSegment,
    ContentModelText,
    ModelToDomContext,
    ContentModelBlockHandler,
    ContentModelSegmentHandler,
    ContentModelGeneralSegment,
} from 'roosterjs-content-model-types';

describe('handleSegment', () => {
    let parent: HTMLElement;
    let context: ModelToDomContext;
    let handleBr: jasmine.Spy<ContentModelSegmentHandler<ContentModelBr>>;
    let handleText: jasmine.Spy<ContentModelSegmentHandler<ContentModelText>>;
    let handleGeneralBlock: jasmine.Spy<ContentModelBlockHandler<ContentModelGeneralBlock>>;
    let handleGeneralSegment: jasmine.Spy<ContentModelSegmentHandler<ContentModelGeneralSegment>>;
    let handleEntityBlock: jasmine.Spy<ContentModelBlockHandler<ContentModelEntity>>;
    let handleEntitySegment: jasmine.Spy<ContentModelSegmentHandler<ContentModelEntity>>;
    let handleImage: jasmine.Spy<ContentModelSegmentHandler<ContentModelImage>>;
    let mockedSegmentNodes: any;

    beforeEach(() => {
        parent = document.createElement('div');
        handleBr = jasmine.createSpy('handleBr');
        handleText = jasmine.createSpy('handleText');
        handleGeneralBlock = jasmine.createSpy('handleGeneralBlock');
        handleEntityBlock = jasmine.createSpy('handleEntityBlock');
        handleGeneralSegment = jasmine.createSpy('handleGeneralSegment');
        handleEntitySegment = jasmine.createSpy('handleEntitySegment');
        handleImage = jasmine.createSpy('handleImage');
        mockedSegmentNodes = 'SEGMENTNODES' as any;

        context = createModelToDomContext(undefined, {
            modelHandlerOverride: {
                br: handleBr,
                text: handleText,
                generalSegment: handleGeneralSegment,
                entitySegment: handleEntitySegment,
                generalBlock: handleGeneralBlock,
                entityBlock: handleEntityBlock,
                image: handleImage,
            },
        });
    });

    it('Text segment', () => {
        const text: ContentModelText = {
            segmentType: 'Text',
            text: 'test',
            format: {},
        };

        handleSegment(document, parent, text, context, mockedSegmentNodes);

        expect(handleText).toHaveBeenCalledWith(
            document,
            parent,
            text,
            context,
            mockedSegmentNodes
        );
        expect(parent.innerHTML).toBe('');
    });

    it('Br segment', () => {
        const br: ContentModelBr = {
            segmentType: 'Br',
            format: {},
        };
        handleSegment(document, parent, br, context, mockedSegmentNodes);

        expect(parent.innerHTML).toBe('');
        expect(handleBr).toHaveBeenCalledWith(document, parent, br, context, mockedSegmentNodes);
    });

    it('general segment', () => {
        const segment: ContentModelSegment = {
            segmentType: 'General',
            blockType: 'BlockGroup',
            blockGroupType: 'General',
            blocks: [],
            element: null!,
            format: {},
        };

        handleSegment(document, parent, segment, context, mockedSegmentNodes);
        expect(parent.innerHTML).toBe('');
        expect(handleGeneralSegment).toHaveBeenCalledWith(
            document,
            parent,
            segment,
            context,
            mockedSegmentNodes
        );
        expect(handleGeneralBlock).not.toHaveBeenCalled();
    });

    it('entity segment', () => {
        const div = document.createElement('div');
        const segment: ContentModelSegment = {
            segmentType: 'Entity',
            blockType: 'Entity',
            format: {},
            entityFormat: {
                entityType: 'entity',
                id: 'entity_1',
                isReadonly: true,
            },
            wrapper: div,
        };

        handleSegment(document, parent, segment, context, mockedSegmentNodes);
        expect(parent.innerHTML).toBe('');
        expect(handleEntitySegment).toHaveBeenCalledWith(
            document,
            parent,
            segment,
            context,
            mockedSegmentNodes
        );
        expect(handleEntityBlock).not.toHaveBeenCalled();
    });

    it('image segment', () => {
        const segment: ContentModelSegment = {
            segmentType: 'Image',
            src: 'test',
            format: {},
            dataset: {},
        };

        handleSegment(document, parent, segment, context, mockedSegmentNodes);
        expect(parent.innerHTML).toBe('');
        expect(handleImage).toHaveBeenCalledWith(
            document,
            parent,
            segment,
            context,
            mockedSegmentNodes
        );
    });
});
