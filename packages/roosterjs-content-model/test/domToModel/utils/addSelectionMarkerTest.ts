import { addSelectionMarker } from '../../../lib/domToModel/utils/addSelectionMarker';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';

describe('addSelectionMarker', () => {
    it('add marker', () => {
        const doc = createContentModelDocument();
        const context = createDomToModelContext();

        addSelectionMarker(doc, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    isImplicit: true,
                    format: {},
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                    ],
                },
            ],
        });
    });

    it('add marker with segment format', () => {
        const doc = createContentModelDocument();
        const context = createDomToModelContext();

        context.segmentFormat = {
            fontWeight: 'bold',
        };

        addSelectionMarker(doc, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    isImplicit: true,
                    format: {},
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: { fontWeight: 'bold' },
                        },
                    ],
                },
            ],
        });
    });

    it('add marker with block format', () => {
        const doc = createContentModelDocument();
        const context = createDomToModelContext();

        context.blockFormat = {
            backgroundColor: 'black',
        };

        addSelectionMarker(doc, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    isImplicit: true,
                    format: { backgroundColor: 'black' },
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                    ],
                },
            ],
        });
    });

    it('add marker with link format', () => {
        const doc = createContentModelDocument();
        const context = createDomToModelContext();

        context.link = {
            format: { href: '/test' },
            dataset: {},
        };

        addSelectionMarker(doc, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    isImplicit: true,
                    format: {},
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                            link: { format: { href: '/test' }, dataset: {} },
                        },
                    ],
                },
            ],
        });
    });
});
