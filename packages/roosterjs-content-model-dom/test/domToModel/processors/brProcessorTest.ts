import { brProcessor } from '../../../lib/domToModel/processors/brProcessor';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import {
    ContentModelBr,
    DomIndexer,
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
        const domIndexer: DomIndexer = {
            onParagraph: null!,
            onSegment: onSegmentSpy,
            onTable: null!,
            reconcileSelection: null!,
            reconcileChildList: null!,
            onBlockEntity: null!,
            reconcileElementId: null!,
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

    it('Selection starts in BR', () => {
        const doc = createContentModelDocument();
        const div = document.createElement('div');
        const br = document.createElement('br');
        const range = document.createRange();

        div.appendChild(br);
        range.setStart(br, 0);
        range.setEnd(div, 1);
        context.selection = {
            type: 'range',
            range: range,
            isReverted: false,
        };

        brProcessor(doc, br, context);

        const brModel: ContentModelBr = {
            segmentType: 'Br',
            format: {},
            isSelected: true,
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
        expect(context.isInSelection).toBeTrue();
    });

    it('Selection ends in BR', () => {
        const doc = createContentModelDocument();
        const br = document.createElement('br');
        const range = document.createRange();

        range.setEnd(br, 0);
        context.selection = {
            type: 'range',
            range: range,
            isReverted: false,
        };
        context.isInSelection = true;

        brProcessor(doc, br, context);

        const brModel: ContentModelBr = {
            segmentType: 'Br',
            format: {},
            isSelected: true,
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
        expect(context.isInSelection).toBeFalse();
    });
});
