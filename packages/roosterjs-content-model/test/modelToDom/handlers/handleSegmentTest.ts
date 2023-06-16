import { ContentModelBr } from '../../../lib/publicTypes/segment/ContentModelBr';
import { ContentModelEntity } from '../../../lib/publicTypes/entity/ContentModelEntity';
import { ContentModelGeneralBlock } from '../../../lib/publicTypes/group/ContentModelGeneralBlock';
import { ContentModelImage } from '../../../lib/publicTypes/segment/ContentModelImage';
import { ContentModelSegment } from '../../../lib/publicTypes/segment/ContentModelSegment';
import { ContentModelText } from '../../../lib/publicTypes/segment/ContentModelText';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { handleSegment } from '../../../lib/modelToDom/handlers/handleSegment';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';
import {
    ContentModelBlockHandler,
    ContentModelHandler,
} from '../../../lib/publicTypes/context/ContentModelHandler';

describe('handleSegment', () => {
    let parent: HTMLElement;
    let context: ModelToDomContext;
    let handleBr: jasmine.Spy<ContentModelHandler<ContentModelBr>>;
    let handleText: jasmine.Spy<ContentModelHandler<ContentModelText>>;
    let handleGeneralModel: jasmine.Spy<ContentModelBlockHandler<ContentModelGeneralBlock>>;
    let handleEntity: jasmine.Spy<ContentModelBlockHandler<ContentModelEntity>>;
    let handleImage: jasmine.Spy<ContentModelHandler<ContentModelImage>>;

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

        handleSegment(document, parent, text, context);

        expect(handleText).toHaveBeenCalledWith(document, parent, text, context);
        expect(parent.innerHTML).toBe('');
    });

    it('Br segment', () => {
        const br: ContentModelBr = {
            segmentType: 'Br',
            format: {},
        };
        handleSegment(document, parent, br, context);

        expect(parent.innerHTML).toBe('');
        expect(handleBr).toHaveBeenCalledWith(document, parent, br, context);
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

        handleSegment(document, parent, segment, context);
        expect(parent.innerHTML).toBe('');
        expect(handleGeneralModel).toHaveBeenCalledWith(document, parent, segment, context, null);
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

        handleSegment(document, parent, segment, context);
        expect(parent.innerHTML).toBe('');
        expect(handleEntity).toHaveBeenCalledWith(document, parent, segment, context, null);
    });

    it('image segment', () => {
        const segment: ContentModelSegment = {
            segmentType: 'Image',
            src: 'test',
            format: {},
            dataset: {},
        };

        handleSegment(document, parent, segment, context);
        expect(parent.innerHTML).toBe('');
        expect(handleImage).toHaveBeenCalledWith(document, parent, segment, context);
    });
});
