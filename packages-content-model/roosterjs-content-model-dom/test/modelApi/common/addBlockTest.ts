import { addBlock } from '../../../lib/modelApi/common/addBlock';
import { ContentModelBlock } from 'roosterjs-content-model-types';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';

describe('addBlock', () => {
    it('add simple block', () => {
        const doc = createContentModelDocument();
        const block: ContentModelBlock = {
            blockType: 'Paragraph',
            segments: [],
            format: {},
        };

        addBlock(doc, block);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [block],
        });
    });
});
