import * as containerProcessor from '../../../lib/domToModel/processors/containerProcessor';
import * as createGeneralBlock from '../../../lib/modelApi/creators/createGeneralBlock';
import * as createGeneralSegment from '../../../lib/modelApi/creators/createGeneralSegment';
import { ContentModelGeneralBlock } from '../../../lib/publicTypes/block/group/ContentModelGeneralBlock';
import { ContentModelGeneralSegment } from '../../../lib/publicTypes/segment/ContentModelGeneralSegment';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { generalProcessor } from '../../../lib/domToModel/processors/generalProcessor';

describe('generalProcessor', () => {
    let context: DomToModelContext;

    beforeEach(() => {
        spyOn(containerProcessor, 'containerProcessor');
        context = createDomToModelContext();
    });

    it('Process a DIV element', () => {
        const doc = createContentModelDocument(document);
        const div = document.createElement('div');
        const block: ContentModelGeneralBlock = {
            blockType: 'BlockGroup',
            blockGroupType: 'General',
            element: div,
            blocks: [],
        };

        spyOn(createGeneralBlock, 'createGeneralBlock').and.returnValue(block);
        generalProcessor(doc, div, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [block],
            document: document,
        });
        expect(createGeneralBlock.createGeneralBlock).toHaveBeenCalledTimes(1);
        expect(createGeneralBlock.createGeneralBlock).toHaveBeenCalledWith(div);
        expect(containerProcessor.containerProcessor).toHaveBeenCalledTimes(1);
        expect(containerProcessor.containerProcessor).toHaveBeenCalledWith(block, div, context);
    });

    it('Process a SPAN element', () => {
        const doc = createContentModelDocument(document);
        const span = document.createElement('span');
        const segment: ContentModelGeneralSegment = {
            segmentType: 'General',
            blockType: 'BlockGroup',
            blockGroupType: 'General',
            element: span,
            blocks: [],
            format: {},
        };

        spyOn(createGeneralSegment, 'createGeneralSegment').and.returnValue(segment);

        generalProcessor(doc, span, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    isImplicit: true,
                    segments: [segment],
                },
            ],
            document: document,
        });
        expect(createGeneralSegment.createGeneralSegment).toHaveBeenCalledTimes(1);
        expect(createGeneralSegment.createGeneralSegment).toHaveBeenCalledWith(span, {});
        expect(containerProcessor.containerProcessor).toHaveBeenCalledTimes(1);
        expect(containerProcessor.containerProcessor).toHaveBeenCalledWith(segment, span, context);
    });

    it('Process a SPAN element with format', () => {
        const doc = createContentModelDocument(document);
        const span = document.createElement('span');
        context.segmentFormat = { a: 'b' } as any;

        generalProcessor(doc, span, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    isImplicit: true,
                    segments: [
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'General',
                            segmentType: 'General',
                            format: { a: 'b' } as any,
                            blocks: [],
                            element: span,
                        },
                    ],
                },
            ],
            document: document,
        });
    });
});
