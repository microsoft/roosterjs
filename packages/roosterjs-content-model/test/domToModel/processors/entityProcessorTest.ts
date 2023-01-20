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
        const group = createContentModelDocument(document);
        const div = document.createElement('div');

        entityProcessor(group, div, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            document: document,
            blocks: [],
        });
    });

    it('Block element entity', () => {
        const group = createContentModelDocument(document);
        const div = document.createElement('div');

        commitEntity(div, 'entity', true, 'entity_1');

        entityProcessor(group, div, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            document: document,
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
        const group = createContentModelDocument(document);
        const span = document.createElement('span');

        commitEntity(span, 'entity', true, 'entity_1');

        entityProcessor(group, span, context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            document: document,
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
                            isReadonly: undefined,
                            wrapper: span,
                        },
                    ],
                    format: {},
                },
            ],
        });
    });
});
