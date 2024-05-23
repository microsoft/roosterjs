import { createDivider } from '../../../lib/modelApi/creators/createDivider';
import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';
import { ReadonlyContentModelParagraph } from 'roosterjs-content-model-types';
import { setParagraphNotImplicit } from '../../../lib/modelApi/block/setParagraphNotImplicit';

describe('setParagraphNotImplicit', () => {
    it('not paragraph', () => {
        const block = createDivider('hr');
        setParagraphNotImplicit(block);
        expect(block).toEqual({
            blockType: 'Divider',
            tagName: 'hr',
            format: {},
        });
    });

    it('not implicit paragraph', () => {
        const block = createParagraph();
        setParagraphNotImplicit(block);
        expect(block).toEqual({
            blockType: 'Paragraph',
            format: {},
            segments: [],
        });
    });

    it('Implicit paragraph', () => {
        const block = createParagraph(true);
        setParagraphNotImplicit(block);
        expect(block).toEqual({
            blockType: 'Paragraph',
            format: {},
            segments: [],
            isImplicit: false,
        });
    });

    it('Readonly paragraph', () => {
        const block: ReadonlyContentModelParagraph = createParagraph(true);

        block.cachedElement = {} as any;

        setParagraphNotImplicit(block);

        expect(block).toEqual({
            blockType: 'Paragraph',
            format: {},
            segments: [],
            isImplicit: false,
        });
    });
});
