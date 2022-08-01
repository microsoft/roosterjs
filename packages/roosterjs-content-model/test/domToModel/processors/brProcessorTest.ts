import { brProcessor } from '../../../lib/domToModel/processors/brProcessor';
import { ContentModelBlockGroupType } from '../../../lib/publicTypes/enum/BlockGroupType';
import { ContentModelBlockType } from '../../../lib/publicTypes/enum/BlockType';
import { ContentModelSegmentType } from '../../../lib/publicTypes/enum/SegmentType';
import { createContentModelDocument } from '../../../lib/domToModel/creators/createContentModelDocument';
import { createFormatContext } from '../../../lib/formatHandlers/createFormatContext';
import { FormatContext } from '../../../lib/formatHandlers/FormatContext';

describe('brProcessor', () => {
    let context: FormatContext;

    beforeEach(() => {
        context = createFormatContext();
    });

    it('Regular Br', () => {
        const doc = createContentModelDocument(document);
        const br = document.createElement('br');

        brProcessor(doc, br, context);

        expect(doc).toEqual({
            blockType: ContentModelBlockType.BlockGroup,
            blockGroupType: ContentModelBlockGroupType.Document,
            blocks: [
                {
                    blockType: ContentModelBlockType.Paragraph,
                    isImplicit: true,
                    segments: [
                        {
                            segmentType: ContentModelSegmentType.Br,
                        },
                    ],
                },
            ],
            document: document,
        });
    });
});
