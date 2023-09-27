import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { entityProcessor } from '../../../lib/domToModel/processors/entityProcessor';
import { setEntityElementClasses } from '../../domUtils/setEntityElementClasses';
import {
    ContentModelDomIndexer,
    ContentModelEntity,
    ContentModelParagraph,
    DomToModelContext,
} from 'roosterjs-content-model-types';

describe('entityProcessor', () => {
    let context: DomToModelContext;

    beforeEach(() => {
        context = createDomToModelContext();
    });

    it('Not an entity', () => {
        const group = createContentModelDocument();
        const div = document.createElement('div');

        entityProcessor(group, div, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                // We now treat everything as entity as long as it is passed into entity processor
                {
                    blockType: 'Entity',
                    segmentType: 'Entity',
                    format: {},
                    entityFormat: {
                        isFakeEntity: true,
                        id: undefined,
                        type: undefined,
                        isReadonly: true,
                    },
                    wrapper: div,
                },
            ],
        });
    });

    it('Block element entity', () => {
        const group = createContentModelDocument();
        const div = document.createElement('div');

        setEntityElementClasses(div, 'entity', true, 'entity_1');

        entityProcessor(group, div, context);

        expect(group).toEqual({
            blockGroupType: 'Document',

            blocks: [
                {
                    blockType: 'Entity',
                    segmentType: 'Entity',
                    format: {},
                    entityFormat: {
                        id: 'entity_1',
                        type: 'entity',
                        isReadonly: true,
                    },
                    wrapper: div,
                },
            ],
        });
    });

    it('Inline element entity', () => {
        const group = createContentModelDocument();
        const span = document.createElement('span');

        setEntityElementClasses(span, 'entity', true, 'entity_1');

        entityProcessor(group, span, context);

        expect(group).toEqual({
            blockGroupType: 'Document',

            blocks: [
                {
                    blockType: 'Paragraph',
                    isImplicit: true,
                    segments: [
                        {
                            blockType: 'Entity',
                            segmentType: 'Entity',
                            format: {},
                            entityFormat: {
                                id: 'entity_1',
                                type: 'entity',
                                isReadonly: true,
                            },
                            wrapper: span,
                        },
                    ],
                    format: {},
                },
            ],
        });
    });

    it('Readonly element (fake entity)', () => {
        const group = createContentModelDocument();
        const span = document.createElement('span');

        span.contentEditable = 'false';

        entityProcessor(group, span, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    isImplicit: true,
                    segments: [
                        {
                            blockType: 'Entity',
                            segmentType: 'Entity',
                            format: {},
                            entityFormat: {
                                isFakeEntity: true,
                                id: undefined,
                                type: undefined,
                                isReadonly: true,
                            },
                            wrapper: span,
                        },
                    ],
                    format: {},
                },
            ],
        });
    });

    it('Readonly element (editable fake entity)', () => {
        const group = createContentModelDocument();
        const span = document.createElement('span');

        span.contentEditable = 'true';

        entityProcessor(group, span, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    isImplicit: true,
                    segments: [
                        {
                            blockType: 'Entity',
                            segmentType: 'Entity',
                            format: {},
                            entityFormat: {
                                isFakeEntity: true,
                                id: undefined,
                                type: undefined,
                                isReadonly: false,
                            },
                            wrapper: span,
                        },
                    ],
                    format: {},
                },
            ],
        });
    });

    it('Entity in selection', () => {
        const group = createContentModelDocument();
        const span = document.createElement('span');

        setEntityElementClasses(span, 'entity', true, 'entity_1');
        context.isInSelection = true;

        entityProcessor(group, span, context);

        expect(group).toEqual({
            blockGroupType: 'Document',

            blocks: [
                {
                    blockType: 'Paragraph',
                    isImplicit: true,
                    segments: [
                        {
                            blockType: 'Entity',
                            segmentType: 'Entity',
                            format: {},
                            entityFormat: { id: 'entity_1', type: 'entity', isReadonly: true },
                            wrapper: span,
                            isSelected: true,
                        },
                    ],
                    format: {},
                },
            ],
        });
    });

    it('Clear format for block entity', () => {
        const group = createContentModelDocument();
        const div = document.createElement('div');

        setEntityElementClasses(div, 'entity', true, 'entity_1');
        context.isInSelection = true;
        context.segmentFormat = {
            fontFamily: 'Arial',
            fontSize: '10px',
        };
        context.blockFormat = {
            lineHeight: '20px',
        };

        entityProcessor(group, div, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    segmentType: 'Entity',
                    blockType: 'Entity',
                    format: {},
                    entityFormat: { id: 'entity_1', type: 'entity', isReadonly: true },
                    wrapper: div,
                    isSelected: true,
                },
            ],
        });

        expect(context.segmentFormat).toEqual({
            fontFamily: 'Arial',
            fontSize: '10px',
        });
        expect(context.blockFormat).toEqual({
            lineHeight: '20px',
        });
    });

    it('Inline Entity with domIndexer', () => {
        const group = createContentModelDocument();
        const span = document.createElement('span');

        setEntityElementClasses(span, 'entity', true, 'entity_1');

        const onSegmentSpy = jasmine.createSpy('onSegment');
        const domIndexer: ContentModelDomIndexer = {
            onParagraph: null!,
            onSegment: onSegmentSpy,
            onTable: null!,
            reconcileSelection: null!,
        };

        context.domIndexer = domIndexer;

        entityProcessor(group, span, context);

        const entityModel: ContentModelEntity = {
            segmentType: 'Entity',
            blockType: 'Entity',
            format: {},
            wrapper: span,
            entityFormat: { type: 'entity', id: 'entity_1', isReadonly: true },
        };
        const paragraphModel: ContentModelParagraph = {
            blockType: 'Paragraph',
            isImplicit: true,
            segments: [entityModel],
            format: {},
        };

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [paragraphModel],
        });
        expect(onSegmentSpy).toHaveBeenCalledWith(span, paragraphModel, [entityModel]);
    });
});
