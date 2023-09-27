import { ContentModelBlockFormat } from 'roosterjs-content-model-types';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDivider } from '../../../lib/modelApi/creators/createDivider';
import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';
import { ensureParagraph } from '../../../lib/modelApi/common/ensureParagraph';

describe('ensureParagraph', () => {
    it('Empty group', () => {
        const doc = createContentModelDocument();
        const result = ensureParagraph(doc);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [result],
        });
        expect(result).toEqual({
            blockType: 'Paragraph',
            format: {},
            segments: [],
            isImplicit: true,
        });
    });

    it('Empty group with format', () => {
        const doc = createContentModelDocument();
        const format: ContentModelBlockFormat = {
            backgroundColor: 'red',
        };
        const result = ensureParagraph(doc, format);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [result],
        });
        expect(result).toEqual({
            blockType: 'Paragraph',
            format: {
                backgroundColor: 'red',
            },
            segments: [],
            isImplicit: true,
        });
    });

    it('Last block is not paragraph', () => {
        const doc = createContentModelDocument();
        const divider = createDivider('hr');

        doc.blocks.push(divider);

        const result = ensureParagraph(doc);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [divider, result],
        });
        expect(result).toEqual({
            blockType: 'Paragraph',
            format: {},
            segments: [],
            isImplicit: true,
        });
    });

    it('Last block is paragraph', () => {
        const doc = createContentModelDocument();
        const paragraph = createParagraph();

        doc.blocks.push(paragraph);

        const result = ensureParagraph(doc);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [result],
        });
        expect(result).toBe(paragraph);
        expect(result).toEqual({
            blockType: 'Paragraph',
            format: {},
            segments: [],
        });
    });

    it('Last block is paragraph, do not overwrite format', () => {
        const doc = createContentModelDocument();
        const format: ContentModelBlockFormat = {
            backgroundColor: 'red',
        };
        const paragraph = createParagraph(false, {
            backgroundColor: 'green',
        });

        doc.blocks.push(paragraph);

        const result = ensureParagraph(doc, format);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [result],
        });
        expect(result).toBe(paragraph);
        expect(result).toEqual({
            blockType: 'Paragraph',
            format: {
                backgroundColor: 'green',
            },
            segments: [],
        });
    });
});
