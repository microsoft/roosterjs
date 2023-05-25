import { commitEntity } from 'roosterjs-editor-dom';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { entityProcessor } from '../../../lib/domToModel/processors/entityProcessor';

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
                    id: undefined,
                    type: undefined,
                    isReadonly: true,
                    wrapper: div,
                },
            ],
        });
    });

    it('Block element entity', () => {
        const group = createContentModelDocument();
        const div = document.createElement('div');

        commitEntity(div, 'entity', true, 'entity_1');

        entityProcessor(group, div, context);

        expect(group).toEqual({
            blockGroupType: 'Document',

            blocks: [
                {
                    blockType: 'Entity',
                    segmentType: 'Entity',
                    format: {},
                    id: 'entity_1',
                    type: 'entity',
                    isReadonly: true,
                    wrapper: div,
                },
            ],
        });
    });

    it('Inline element entity', () => {
        const group = createContentModelDocument();
        const span = document.createElement('span');

        commitEntity(span, 'entity', true, 'entity_1');

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
                            id: 'entity_1',
                            type: 'entity',
                            isReadonly: true,
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
                            id: undefined,
                            type: undefined,
                            isReadonly: true,
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

        commitEntity(span, 'entity', true, 'entity_1');
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
                            id: 'entity_1',
                            type: 'entity',
                            isReadonly: true,
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

        commitEntity(div, 'entity', true, 'entity_1');
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
                    id: 'entity_1',
                    type: 'entity',
                    isReadonly: true,
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

    it('Block element entity, clone element', () => {
        const group = createContentModelDocument();
        const div = document.createElement('div');

        const clonedDiv = div.cloneNode(true /* deep */) as HTMLDivElement;
        spyOn(Node.prototype, 'cloneNode').and.returnValue(clonedDiv);
        context.allowCacheElement = false;

        commitEntity(div, 'entity', true, 'entity_1');

        entityProcessor(group, div, context);

        expect(group).toEqual({
            blockGroupType: 'Document',

            blocks: [
                {
                    blockType: 'Entity',
                    segmentType: 'Entity',
                    format: {},
                    id: 'entity_1',
                    type: 'entity',
                    isReadonly: true,
                    wrapper: clonedDiv,
                },
            ],
        });
    });

    it('Inline element entity, clone entity element', () => {
        const group = createContentModelDocument();
        const span = document.createElement('span');

        const clonedSpan = span.cloneNode(true /* deep */) as HTMLDivElement;
        spyOn(Node.prototype, 'cloneNode').and.returnValue(clonedSpan);
        context.allowCacheElement = false;

        commitEntity(span, 'entity', true, 'entity_1');

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
                            id: 'entity_1',
                            type: 'entity',
                            isReadonly: true,
                            wrapper: clonedSpan,
                        },
                    ],
                    format: {},
                },
            ],
        });
    });
});
