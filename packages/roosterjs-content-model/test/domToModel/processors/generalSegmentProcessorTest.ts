import * as containerProcessor from '../../../lib/domToModel/processors/containerProcessor';
import * as createGeneralSegment from '../../../lib/modelApi/creators/createGeneralSegment';
import { ContentModelBlockGroupType } from '../../../lib/publicTypes/enum/BlockGroupType';
import { ContentModelBlockType } from '../../../lib/publicTypes/enum/BlockType';
import { ContentModelGeneralSegment } from '../../../lib/publicTypes/segment/ContentModelGeneralSegment';
import { ContentModelSegmentType } from '../../../lib/publicTypes/enum/SegmentType';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { DomToModelContext } from '../../../lib/domToModel/context/DomToModelContext';
import { generalSegmentProcessor } from '../../../lib/domToModel/processors/generalSegmentProcessor';

describe('generalSegmentProcessor', () => {
    let context: DomToModelContext;

    beforeEach(() => {
        context = createDomToModelContext();
        spyOn(containerProcessor, 'containerProcessor');
    });

    it('Process a SPAN element', () => {
        const doc = createContentModelDocument(document);
        const span = document.createElement('span');
        const segment: ContentModelGeneralSegment = {
            segmentType: ContentModelSegmentType.General,
            blockType: ContentModelBlockType.BlockGroup,
            blockGroupType: ContentModelBlockGroupType.General,
            element: span,
            blocks: [],
        };

        spyOn(createGeneralSegment, 'createGeneralSegment').and.returnValue(segment);

        generalSegmentProcessor(doc, span, context);

        expect(doc).toEqual({
            blockType: ContentModelBlockType.BlockGroup,
            blockGroupType: ContentModelBlockGroupType.Document,
            blocks: [
                {
                    blockType: ContentModelBlockType.Paragraph,
                    isImplicit: true,
                    segments: [segment],
                },
            ],
            document: document,
        });
        expect(createGeneralSegment.createGeneralSegment).toHaveBeenCalledTimes(1);
        expect(createGeneralSegment.createGeneralSegment).toHaveBeenCalledWith(span);
        expect(containerProcessor.containerProcessor).toHaveBeenCalledTimes(1);
        expect(containerProcessor.containerProcessor).toHaveBeenCalledWith(segment, span, context);
    });
});
