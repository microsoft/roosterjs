import { addSelectionMarker } from '../../../lib/domToModel/utils/addSelectionMarker';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createParagraph } from '../../../lib';

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
                    segmentFormat: { fontWeight: 'bold' },
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

    it('add marker with selection info', () => {
        const mockedContainer = 'CONTAINER' as any;
        const mockedOffset = 'OFFSET' as any;
        const doc = createContentModelDocument();
        const context = createDomToModelContext({
            defaultFormat: {
                a: 'a',
                b: 'b',
                c: 'c',
            } as any,
            pendingFormat: {
                format: {
                    c: 'c3',
                    e: 'e',
                } as any,
                posContainer: mockedContainer,
                posOffset: mockedOffset,
            },
        });

        context.segmentFormat = {
            b: 'b2',
            c: 'c2',
            d: 'd',
        } as any;
        doc.blocks.push(createParagraph());

        addSelectionMarker(doc, context, mockedContainer, mockedOffset);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {
                                a: 'a',
                                b: 'b2',
                                c: 'c3',
                                d: 'd',
                                e: 'e',
                            } as any,
                        },
                    ],
                },
            ],
        });
    });
});
