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
    ContentModelSegmentHandler,
    ContentModelBlockAndSegmentHandler,
} from 'roosterjs-content-model-types';

describe('handleSegment', () => {
    let parent: HTMLElement;
    let context: ModelToDomContext;
    let handleBr: jasmine.Spy<ContentModelSegmentHandler<ContentModelBr>>;
    let handleText: jasmine.Spy<ContentModelSegmentHandler<ContentModelText>>;
    let handleGeneralModel: jasmine.Spy<ContentModelBlockAndSegmentHandler<
        ContentModelGeneralBlock
    >>;
    let handleEntity: jasmine.Spy<ContentModelBlockAndSegmentHandler<ContentModelEntity>>;
    let handleImage: jasmine.Spy<ContentModelSegmentHandler<ContentModelImage>>;

    beforeEach(() => {
        parent = document.createElement('div');
        handleBr = jasmine.createSpy('handleBr');
        handleText = jasmine.createSpy('handleText');
        handleGeneralModel = jasmine.createSpy('handleGeneralModel');
        handleEntity = jasmine.createSpy('handleEntity');
        handleImage = jasmine.createSpy('handleImage');

        context = createModelToDomContext(undefined, {
            modelHandlerOverride: {
                br: handleBr,
                text: handleText,
                general: handleGeneralModel,
                entity: handleEntity,
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
        const mockedParagraph = 'PARAGRAPH' as any;

        handleSegment(document, parent, text, context, mockedParagraph);

        expect(handleText).toHaveBeenCalledWith(document, parent, text, context, mockedParagraph);
        expect(parent.innerHTML).toBe('');
    });

    it('Br segment', () => {
        const br: ContentModelBr = {
            segmentType: 'Br',
            format: {},
        };
        const mockedParagraph = 'PARAGRAPH' as any;

        handleSegment(document, parent, br, context, mockedParagraph);

        expect(parent.innerHTML).toBe('');
        expect(handleBr).toHaveBeenCalledWith(document, parent, br, context, mockedParagraph);
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
        const mockedParagraph = 'PARAGRAPH' as any;

        handleSegment(document, parent, segment, context, mockedParagraph);
        expect(parent.innerHTML).toBe('');
        expect(handleGeneralModel).toHaveBeenCalledWith(
            document,
            parent,
            segment,
            context,
            mockedParagraph,
            null
        );
    });

    it('entity segment', () => {
        const div = document.createElement('div');
        const segment: ContentModelSegment = {
            segmentType: 'Entity',
            blockType: 'Entity',
            format: {},
            type: 'entity',
            id: 'entity_1',
            wrapper: div,
            isReadonly: true,
        };
        const mockedParagraph = 'PARAGRAPH' as any;

        handleSegment(document, parent, segment, context, mockedParagraph);
        expect(parent.innerHTML).toBe('');
        expect(handleEntity).toHaveBeenCalledWith(
            document,
            parent,
            segment,
            context,
            mockedParagraph,
            null
        );
    });

    it('image segment', () => {
        const segment: ContentModelSegment = {
            segmentType: 'Image',
            src: 'test',
            format: {},
            dataset: {},
        };
        const mockedParagraph = 'PARAGRAPH' as any;

        handleSegment(document, parent, segment, context, mockedParagraph);
        expect(parent.innerHTML).toBe('');
        expect(handleImage).toHaveBeenCalledWith(
            document,
            parent,
            segment,
            context,
            mockedParagraph
        );
    });
});
