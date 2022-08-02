import { addBlock } from '../../../lib/modelApi/common/addBlock';
import { ContentModelBlock } from '../../../lib/publicTypes/block/ContentModelBlock';
import { ContentModelBlockGroupType } from '../../../lib/publicTypes/enum/BlockGroupType';
import { ContentModelBlockType } from '../../../lib/publicTypes/enum/BlockType';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';

describe('addBlock', () => {
    it('add simple block', () => {
        const doc = createContentModelDocument(document);
        const block: ContentModelBlock = {
            blockType: ContentModelBlockType.Paragraph,
            segments: [],
        };

        addBlock(doc, block);

        expect(doc).toEqual({
            blockType: ContentModelBlockType.BlockGroup,
            blockGroupType: ContentModelBlockGroupType.Document,
            blocks: [block],
            document: document,
        });
    });
});
