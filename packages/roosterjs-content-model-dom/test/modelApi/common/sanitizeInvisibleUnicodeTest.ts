import { sanitizeInvisibleUnicode } from '../../../lib/modelApi/common/sanitizeInvisibleUnicode';
import { ContentModelDocument } from 'roosterjs-content-model-types';

describe('sanitizeInvisibleUnicode', () => {
    it('should not modify model with no invisible characters', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'Hello World',
                        },
                    ],
                },
            ],
        };

        sanitizeInvisibleUnicode(model);

        expect(model.blocks[0]).toEqual({
            blockType: 'Paragraph',
            format: {},
            segments: [
                {
                    segmentType: 'Text',
                    format: {},
                    text: 'Hello World',
                },
            ],
        });
    });

    it('should strip invisible Unicode from text segments', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'Hello\u200B\u200CWorld',
                        },
                    ],
                },
            ],
        };

        sanitizeInvisibleUnicode(model);

        expect((model.blocks[0] as any).segments[0].text).toBe('HelloWorld');
    });

    it('should strip invisible Unicode from link href', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'Click here',
                            link: {
                                format: {
                                    href: 'mailto:\u200Buser@example.com',
                                    underline: true,
                                },
                                dataset: {},
                            },
                        },
                    ],
                },
            ],
        };

        sanitizeInvisibleUnicode(model);

        expect((model.blocks[0] as any).segments[0].link.format.href).toBe(
            'mailto:user@example.com'
        );
    });

    it('should strip invisible Unicode from text inside table cells', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Table',
                    format: {},
                    widths: [100],
                    rows: [
                        {
                            format: {},
                            height: 0,
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    format: {},
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    dataset: {},
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            format: {},
                                            segments: [
                                                {
                                                    segmentType: 'Text',
                                                    format: {},
                                                    text: 'Cell\u200BText',
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                    dataset: {},
                },
            ],
        };

        sanitizeInvisibleUnicode(model);

        const cell = (model.blocks[0] as any).rows[0].cells[0];
        expect(cell.blocks[0].segments[0].text).toBe('CellText');
    });

    it('should sanitize text nodes in General segment element', () => {
        const element = document.createElement('div');
        element.innerHTML = 'Hello\u200B <span>World\u200C</span>';

        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'General',
                            blockGroupType: 'General',
                            blockType: 'BlockGroup',
                            format: {},
                            element: element,
                            blocks: [],
                        },
                    ],
                },
            ],
        };

        sanitizeInvisibleUnicode(model);

        expect(element.textContent).toBe('Hello World');
    });

    it('should handle empty model', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [],
        };

        sanitizeInvisibleUnicode(model);

        expect(model.blocks.length).toBe(0);
    });

    it('should not modify URL-encoded sequences in link href', () => {
        const href = 'mailto:%E2%80%8Buser@example.com';
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'Click',
                            link: {
                                format: {
                                    href: href,
                                    underline: true,
                                },
                                dataset: {},
                            },
                        },
                    ],
                },
            ],
        };

        sanitizeInvisibleUnicode(model);

        expect((model.blocks[0] as any).segments[0].link.format.href).toBe(href);
    });

    it('should handle nested block groups (e.g. list items)', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    format: {},
                    formatHolder: { segmentType: 'SelectionMarker', format: {}, isSelected: false },
                    levels: [{ listType: 'UL', format: {}, dataset: {} }],
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            format: {},
                            segments: [
                                {
                                    segmentType: 'Text',
                                    format: {},
                                    text: 'Item\u200BOne',
                                },
                            ],
                        },
                    ],
                },
            ],
        };

        sanitizeInvisibleUnicode(model);

        expect((model.blocks[0] as any).blocks[0].segments[0].text).toBe('ItemOne');
    });

    it('should not modify Br or SelectionMarker segments', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Br',
                            format: {},
                        },
                        {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: true,
                        },
                    ],
                },
            ],
        };

        sanitizeInvisibleUnicode(model);

        expect(model.blocks[0]).toEqual({
            blockType: 'Paragraph',
            format: {},
            segments: [
                {
                    segmentType: 'Br',
                    format: {},
                },
                {
                    segmentType: 'SelectionMarker',
                    format: {},
                    isSelected: true,
                },
            ],
        });
    });
});
