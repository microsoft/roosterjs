import { addBlock } from '../../../lib/modelApi/common/addBlock';
import { ContentModelBlock } from '../../../lib/publicTypes/block/ContentModelBlock';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';

describe('addBlock', () => {
    it('add simple block', () => {
        const doc = createContentModelDocument(document);
        const block: ContentModelBlock = {
            blockType: 'Paragraph',
            segments: [],
        };

        addBlock(doc, block);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [block],
            document: document,
        });
    });
});
