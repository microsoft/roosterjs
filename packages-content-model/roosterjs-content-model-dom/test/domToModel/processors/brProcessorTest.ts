import { brProcessor } from '../../../lib/domToModel/processors/brProcessor';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import {
    ContentModelBr,
    ContentModelDomIndexer,
    ContentModelParagraph,
    DomToModelContext,
} from 'roosterjs-content-model-types';

describe('brProcessor', () => {
    let context: DomToModelContext;

    beforeEach(() => {
        context = createDomToModelContext();
    });

    it('Regular Br', () => {
        const doc = createContentModelDocument();
        const br = document.createElement('br');

        brProcessor(doc, br, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    isImplicit: true,
                    segments: [
                        {
                            segmentType: 'Br',
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
        });
    });

    it('Br with format', () => {
        const doc = createContentModelDocument();
        const br = document.createElement('br');

        context.segmentFormat = { a: 'b' } as any;

        brProcessor(doc, br, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    isImplicit: true,
                    segments: [
                        {
                            segmentType: 'Br',
                            format: { a: 'b' } as any,
                        },
                    ],
                    format: {},
                },
            ],
        });
    });

    it('Br with domIndexer', () => {
        const doc = createContentModelDocument();
        const br = document.createElement('br');
        const onSegmentSpy = jasmine.createSpy('onSegment');
        const domIndexer: ContentModelDomIndexer = {
            onParagraph: null!,
            onSegment: onSegmentSpy,
            onTable: null!,
            reconcileSelection: null!,
        };

        context.domIndexer = domIndexer;

        brProcessor(doc, br, context);

        const brModel: ContentModelBr = {
            segmentType: 'Br',
            format: {},
        };
        const paragraphModel: ContentModelParagraph = {
            blockType: 'Paragraph',
            isImplicit: true,
            segments: [brModel],
            format: {},
        };

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [paragraphModel],
        });
        expect(onSegmentSpy).toHaveBeenCalledWith(br, paragraphModel, [brModel]);
    });
});
