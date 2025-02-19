import { ContentModelDocument } from 'roosterjs-content-model-types';
import { convertMarkdownToContentModel } from '../../lib/markdownToModel/convertMarkdownToContentModel';
import { initEditor } from '../TestHelper';

describe('convertMarkdownToContentModel', () => {
    function runTest(markdown: string, expectedContentModel: ContentModelDocument) {
        const editor = initEditor('markdownTest');
        convertMarkdownToContentModel(editor, markdown);
        const actualContentModel = editor.getContentModelCopy('disconnected');
        actualContentModel.blocks.forEach(block => {
            if (
                block.blockType === 'Paragraph' &&
                block.segments.length > 0 &&
                block.segments.some(segment => segment.segmentType === 'Image')
            ) {
                block.segments.forEach(segment => {
                    if (segment.segmentType == 'Image') {
                        segment.format.maxWidth = '100px';
                    }
                });
            }
        });
        expect(actualContentModel).toEqual(expectedContentModel);
        editor.dispose();
    }

    it('should convert markdown to content model', () => {
        const markdown =
            '# Header 1\n## Header 2\n### Header 3\n#### Header 4\n##### Header 5\n###### Header 6';

        const expectedContentModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            isSelected: undefined,
                            text: 'Header 1',
                            format: {},
                        },
                    ],
                    format: {},
                    decorator: {
                        tagName: 'h1',
                        format: {
                            fontSize: '2em',
                            fontWeight: 'bold',
                        },
                    },
                    segmentFormat: undefined,
                    cachedElement: undefined,
                    isImplicit: undefined,
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            isSelected: undefined,
                            text: 'Header 2',
                            format: {},
                        },
                    ],
                    format: {},
                    decorator: {
                        tagName: 'h2',
                        format: {
                            fontSize: '1.5em',
                            fontWeight: 'bold',
                        },
                    },
                    segmentFormat: undefined,
                    cachedElement: undefined,
                    isImplicit: undefined,
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            isSelected: undefined,
                            text: 'Header 3',
                            format: {},
                        },
                    ],
                    format: {},
                    decorator: {
                        tagName: 'h3',
                        format: {
                            fontSize: '1.17em',
                            fontWeight: 'bold',
                        },
                    },
                    segmentFormat: undefined,
                    cachedElement: undefined,
                    isImplicit: undefined,
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            isSelected: undefined,
                            text: 'Header 4',
                            format: {},
                        },
                    ],
                    format: {},
                    decorator: {
                        tagName: 'h4',
                        format: {
                            fontWeight: 'bold',
                        },
                    },
                    segmentFormat: undefined,
                    cachedElement: undefined,
                    isImplicit: undefined,
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            isSelected: undefined,
                            text: 'Header 5',
                            format: {},
                        },
                    ],
                    format: {},
                    decorator: {
                        tagName: 'h5',
                        format: {
                            fontSize: '0.83em',
                            fontWeight: 'bold',
                        },
                    },
                    segmentFormat: undefined,
                    cachedElement: undefined,
                    isImplicit: undefined,
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            isSelected: undefined,
                            text: 'Header 6',
                            format: {},
                        },
                    ],
                    format: {},
                    decorator: {
                        tagName: 'h6',
                        format: {
                            fontSize: '0.67em',
                            fontWeight: 'bold',
                        },
                    },
                    segmentFormat: undefined,
                    cachedElement: undefined,
                    isImplicit: undefined,
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Br',
                            format: {},
                            isSelected: undefined,
                        },
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        {
                            segmentType: 'Br',
                            format: {},
                            isSelected: undefined,
                        },
                    ],
                    format: {},
                    segmentFormat: undefined,
                    cachedElement: undefined,
                    isImplicit: undefined,
                },
            ],
            format: {},
        };
        runTest(markdown, expectedContentModel);
    });

    it('should convert markdown to content model with link', () => {
        const markdown = `[link](https://www.example.com)`;
        const expectedContentModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            isSelected: undefined,
                            text: 'link',
                            format: {},
                            link: {
                                dataset: {},
                                format: {
                                    href: 'https://www.example.com',
                                    underline: true,
                                },
                            },
                        },
                    ],
                    cachedElement: undefined,
                    isImplicit: undefined,
                    segmentFormat: undefined,
                    format: {},
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Br',
                            format: {},
                            isSelected: undefined,
                        },
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        {
                            segmentType: 'Br',
                            format: {},
                            isSelected: undefined,
                        },
                    ],
                    format: {},
                    segmentFormat: undefined,
                    cachedElement: undefined,
                    isImplicit: undefined,
                },
            ],
            format: {},
        };
        runTest(markdown, expectedContentModel);
    });

    it('should convert markdown to content model with table', () => {
        const markdown = `| Header 1 | Header 2 | Header 3 |\n| -------- | -------- | -------- |\n| Cell 1   | Cell 2   | Cell 3   |\n| Cell 4   | Cell 5   | Cell 6   |`;

        const expectedContentModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    widths: [65.359375, 65.359375, 65.359375],
                    format: {
                        borderCollapse: true,
                        useBorderBox: true,
                    },
                    dataset: {
                        editingInfo:
                            '{"topBorderColor":"#ABABAB","bottomBorderColor":"#ABABAB","verticalBorderColor":"#ABABAB","hasHeaderRow":true,"hasFirstColumn":false,"hasBandedRows":false,"hasBandedColumns":false,"bgColorEven":null,"bgColorOdd":"#ABABAB20","headerRowColor":"#ABABAB","tableBorderFormat":0,"verticalAlign":null}',
                    },
                    blockType: 'Table',
                    rows: [
                        {
                            height: 21,
                            format: {},
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Text',
                                                    isSelected: undefined,
                                                    text: 'Header 1',
                                                    format: {
                                                        fontWeight: 'bold',
                                                    },
                                                },
                                            ],
                                            format: {
                                                textAlign: 'start',
                                            },
                                            cachedElement: undefined,
                                            isImplicit: undefined,
                                            segmentFormat: undefined,
                                        },
                                    ],
                                    spanAbove: false,
                                    spanLeft: false,
                                    format: {
                                        textAlign: 'start',
                                        borderTop: '1px solid rgb(171, 171, 171)',
                                        borderRight: '1px solid rgb(171, 171, 171)',
                                        borderBottom: '1px solid rgb(171, 171, 171)',
                                        borderLeft: '1px solid rgb(171, 171, 171)',
                                        backgroundColor: 'rgb(171, 171, 171)',
                                    },
                                    dataset: {},
                                    isHeader: true,
                                    cachedElement: undefined,
                                    isSelected: undefined,
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Text',
                                                    isSelected: undefined,
                                                    text: 'Header 2',
                                                    format: {
                                                        fontWeight: 'bold',
                                                    },
                                                },
                                            ],
                                            format: {
                                                textAlign: 'start',
                                            },
                                            cachedElement: undefined,
                                            isImplicit: undefined,
                                            segmentFormat: undefined,
                                        },
                                    ],
                                    spanAbove: false,
                                    spanLeft: false,
                                    format: {
                                        textAlign: 'start',
                                        borderTop: '1px solid rgb(171, 171, 171)',
                                        borderRight: '1px solid rgb(171, 171, 171)',
                                        borderBottom: '1px solid rgb(171, 171, 171)',
                                        borderLeft: '1px solid rgb(171, 171, 171)',
                                        backgroundColor: 'rgb(171, 171, 171)',
                                    },
                                    dataset: {},
                                    isHeader: true,
                                    cachedElement: undefined,
                                    isSelected: undefined,
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Text',
                                                    isSelected: undefined,
                                                    text: 'Header 3',
                                                    format: {
                                                        fontWeight: 'bold',
                                                    },
                                                },
                                            ],
                                            format: {
                                                textAlign: 'start',
                                            },
                                            cachedElement: undefined,
                                            isImplicit: undefined,
                                            segmentFormat: undefined,
                                        },
                                    ],
                                    spanAbove: false,
                                    spanLeft: false,
                                    format: {
                                        textAlign: 'start',
                                        borderTop: '1px solid rgb(171, 171, 171)',
                                        borderRight: '1px solid rgb(171, 171, 171)',
                                        borderBottom: '1px solid rgb(171, 171, 171)',
                                        borderLeft: '1px solid rgb(171, 171, 171)',
                                        backgroundColor: 'rgb(171, 171, 171)',
                                    },
                                    dataset: {},
                                    isHeader: true,
                                    cachedElement: undefined,
                                    isSelected: undefined,
                                },
                            ],
                            cachedElement: undefined,
                        },
                        {
                            height: 21,
                            format: {},
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Text',
                                                    isSelected: undefined,
                                                    text: 'Cell 1',
                                                    format: {},
                                                },
                                            ],
                                            format: {
                                                textAlign: 'start',
                                            },
                                            cachedElement: undefined,
                                            isImplicit: undefined,
                                            segmentFormat: undefined,
                                        },
                                    ],
                                    spanAbove: false,
                                    spanLeft: false,
                                    format: {
                                        textAlign: 'start',
                                        borderTop: '1px solid rgb(171, 171, 171)',
                                        borderRight: '1px solid rgb(171, 171, 171)',
                                        borderBottom: '1px solid rgb(171, 171, 171)',
                                        borderLeft: '1px solid rgb(171, 171, 171)',
                                    },
                                    dataset: {},
                                    isHeader: false,
                                    cachedElement: undefined,
                                    isSelected: undefined,
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Text',
                                                    isSelected: undefined,
                                                    text: 'Cell 2',
                                                    format: {},
                                                },
                                            ],
                                            format: {
                                                textAlign: 'start',
                                            },
                                            cachedElement: undefined,
                                            isImplicit: undefined,
                                            segmentFormat: undefined,
                                        },
                                    ],
                                    spanAbove: false,
                                    spanLeft: false,
                                    format: {
                                        textAlign: 'start',
                                        borderTop: '1px solid rgb(171, 171, 171)',
                                        borderRight: '1px solid rgb(171, 171, 171)',
                                        borderBottom: '1px solid rgb(171, 171, 171)',
                                        borderLeft: '1px solid rgb(171, 171, 171)',
                                    },
                                    dataset: {},
                                    isHeader: false,
                                    cachedElement: undefined,
                                    isSelected: undefined,
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Text',
                                                    isSelected: undefined,
                                                    text: 'Cell 3',
                                                    format: {},
                                                },
                                            ],
                                            format: {
                                                textAlign: 'start',
                                            },
                                            cachedElement: undefined,
                                            isImplicit: undefined,
                                            segmentFormat: undefined,
                                        },
                                    ],
                                    spanAbove: false,
                                    spanLeft: false,
                                    format: {
                                        textAlign: 'start',
                                        borderTop: '1px solid rgb(171, 171, 171)',
                                        borderRight: '1px solid rgb(171, 171, 171)',
                                        borderBottom: '1px solid rgb(171, 171, 171)',
                                        borderLeft: '1px solid rgb(171, 171, 171)',
                                    },
                                    dataset: {},
                                    isHeader: false,
                                    cachedElement: undefined,
                                    isSelected: undefined,
                                },
                            ],
                            cachedElement: undefined,
                        },
                        {
                            height: 21,
                            format: {},
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Text',
                                                    isSelected: undefined,
                                                    text: 'Cell 4',
                                                    format: {},
                                                },
                                            ],
                                            format: {
                                                textAlign: 'start',
                                            },
                                            cachedElement: undefined,
                                            isImplicit: undefined,
                                            segmentFormat: undefined,
                                        },
                                    ],
                                    spanAbove: false,
                                    spanLeft: false,
                                    format: {
                                        textAlign: 'start',
                                        borderTop: '1px solid rgb(171, 171, 171)',
                                        borderRight: '1px solid rgb(171, 171, 171)',
                                        borderBottom: '1px solid rgb(171, 171, 171)',
                                        borderLeft: '1px solid rgb(171, 171, 171)',
                                    },
                                    dataset: {},
                                    isHeader: false,
                                    cachedElement: undefined,
                                    isSelected: undefined,
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Text',
                                                    isSelected: undefined,
                                                    text: 'Cell 5',
                                                    format: {},
                                                },
                                            ],
                                            format: {
                                                textAlign: 'start',
                                            },
                                            cachedElement: undefined,
                                            isImplicit: undefined,
                                            segmentFormat: undefined,
                                        },
                                    ],
                                    spanAbove: false,
                                    spanLeft: false,
                                    format: {
                                        textAlign: 'start',
                                        borderTop: '1px solid rgb(171, 171, 171)',
                                        borderRight: '1px solid rgb(171, 171, 171)',
                                        borderBottom: '1px solid rgb(171, 171, 171)',
                                        borderLeft: '1px solid rgb(171, 171, 171)',
                                    },
                                    dataset: {},
                                    isHeader: false,
                                    cachedElement: undefined,
                                    isSelected: undefined,
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Text',
                                                    isSelected: undefined,
                                                    text: 'Cell 6',
                                                    format: {},
                                                },
                                            ],
                                            format: {
                                                textAlign: 'start',
                                            },
                                            cachedElement: undefined,
                                            isImplicit: undefined,
                                            segmentFormat: undefined,
                                        },
                                    ],
                                    spanAbove: false,
                                    spanLeft: false,
                                    format: {
                                        textAlign: 'start',
                                        borderTop: '1px solid rgb(171, 171, 171)',
                                        borderRight: '1px solid rgb(171, 171, 171)',
                                        borderBottom: '1px solid rgb(171, 171, 171)',
                                        borderLeft: '1px solid rgb(171, 171, 171)',
                                    },
                                    dataset: {},
                                    isHeader: false,
                                    cachedElement: undefined,
                                    isSelected: undefined,
                                },
                            ],
                            cachedElement: undefined,
                        },
                    ],
                    cachedElement: undefined,
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Br',
                            format: {},
                            isSelected: undefined,
                        },
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        {
                            segmentType: 'Br',
                            format: {},
                            isSelected: undefined,
                        },
                    ],
                    format: {},
                    segmentFormat: undefined,
                    cachedElement: undefined,
                    isImplicit: undefined,
                },
            ],
            format: {},
        };
        runTest(markdown, expectedContentModel);
    });

    it('should convert markdown to content model with table with alignment', () => {
        const markdown = `|  Header 1 | Header 2 | Header 3 |\n|:--------:| --------:|:--------|\n| Cell 1   | Cell 2   | Cell 3   |`;

        const expectedContentModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    widths: [65.359375, 65.359375, 65.359375],
                    format: {
                        borderCollapse: true,
                        useBorderBox: true,
                    },
                    dataset: {
                        editingInfo:
                            '{"topBorderColor":"#ABABAB","bottomBorderColor":"#ABABAB","verticalBorderColor":"#ABABAB","hasHeaderRow":true,"hasFirstColumn":false,"hasBandedRows":false,"hasBandedColumns":false,"bgColorEven":null,"bgColorOdd":"#ABABAB20","headerRowColor":"#ABABAB","tableBorderFormat":0,"verticalAlign":null}',
                    },
                    blockType: 'Table',
                    rows: [
                        {
                            height: 21,
                            format: {},
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Text',
                                                    isSelected: undefined,
                                                    text: 'Header 1',
                                                    format: {
                                                        fontWeight: 'bold',
                                                    },
                                                },
                                            ],
                                            format: {
                                                textAlign: 'center',
                                            },
                                            cachedElement: undefined,
                                            isImplicit: undefined,
                                            segmentFormat: undefined,
                                        },
                                    ],
                                    spanAbove: false,
                                    spanLeft: false,
                                    format: {
                                        textAlign: 'center',
                                        borderTop: '1px solid rgb(171, 171, 171)',
                                        borderRight: '1px solid rgb(171, 171, 171)',
                                        borderBottom: '1px solid rgb(171, 171, 171)',
                                        borderLeft: '1px solid rgb(171, 171, 171)',
                                        backgroundColor: 'rgb(171, 171, 171)',
                                    },
                                    dataset: {},
                                    isHeader: true,
                                    cachedElement: undefined,
                                    isSelected: undefined,
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Text',
                                                    isSelected: undefined,
                                                    text: 'Header 2',
                                                    format: {
                                                        fontWeight: 'bold',
                                                    },
                                                },
                                            ],
                                            format: {
                                                textAlign: 'end',
                                            },
                                            cachedElement: undefined,
                                            isImplicit: undefined,
                                            segmentFormat: undefined,
                                        },
                                    ],
                                    spanAbove: false,
                                    spanLeft: false,
                                    format: {
                                        textAlign: 'end',
                                        borderTop: '1px solid rgb(171, 171, 171)',
                                        borderRight: '1px solid rgb(171, 171, 171)',
                                        borderBottom: '1px solid rgb(171, 171, 171)',
                                        borderLeft: '1px solid rgb(171, 171, 171)',
                                        backgroundColor: 'rgb(171, 171, 171)',
                                    },
                                    dataset: {},
                                    isHeader: true,
                                    cachedElement: undefined,
                                    isSelected: undefined,
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Text',
                                                    isSelected: undefined,
                                                    text: 'Header 3',
                                                    format: {
                                                        fontWeight: 'bold',
                                                    },
                                                },
                                            ],
                                            format: {
                                                textAlign: 'start',
                                            },
                                            cachedElement: undefined,
                                            isImplicit: undefined,
                                            segmentFormat: undefined,
                                        },
                                    ],
                                    spanAbove: false,
                                    spanLeft: false,
                                    format: {
                                        textAlign: 'start',
                                        borderTop: '1px solid rgb(171, 171, 171)',
                                        borderRight: '1px solid rgb(171, 171, 171)',
                                        borderBottom: '1px solid rgb(171, 171, 171)',
                                        borderLeft: '1px solid rgb(171, 171, 171)',
                                        backgroundColor: 'rgb(171, 171, 171)',
                                    },
                                    dataset: {},
                                    isHeader: true,
                                    cachedElement: undefined,
                                    isSelected: undefined,
                                },
                            ],
                            cachedElement: undefined,
                        },
                        {
                            height: 21,
                            format: {},
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Text',
                                                    isSelected: undefined,
                                                    text: 'Cell 1',
                                                    format: {},
                                                },
                                            ],
                                            format: {
                                                textAlign: 'center',
                                            },
                                            cachedElement: undefined,
                                            isImplicit: undefined,
                                            segmentFormat: undefined,
                                        },
                                    ],
                                    spanAbove: false,
                                    spanLeft: false,
                                    format: {
                                        textAlign: 'center',
                                        borderTop: '1px solid rgb(171, 171, 171)',
                                        borderRight: '1px solid rgb(171, 171, 171)',
                                        borderBottom: '1px solid rgb(171, 171, 171)',
                                        borderLeft: '1px solid rgb(171, 171, 171)',
                                    },
                                    dataset: {},
                                    isHeader: false,
                                    cachedElement: undefined,
                                    isSelected: undefined,
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Text',
                                                    isSelected: undefined,
                                                    text: 'Cell 2',
                                                    format: {},
                                                },
                                            ],
                                            format: {
                                                textAlign: 'end',
                                            },
                                            cachedElement: undefined,
                                            isImplicit: undefined,
                                            segmentFormat: undefined,
                                        },
                                    ],
                                    spanAbove: false,
                                    spanLeft: false,
                                    format: {
                                        textAlign: 'end',
                                        borderTop: '1px solid rgb(171, 171, 171)',
                                        borderRight: '1px solid rgb(171, 171, 171)',
                                        borderBottom: '1px solid rgb(171, 171, 171)',
                                        borderLeft: '1px solid rgb(171, 171, 171)',
                                    },
                                    dataset: {},
                                    isHeader: false,
                                    cachedElement: undefined,
                                    isSelected: undefined,
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Text',
                                                    isSelected: undefined,
                                                    text: 'Cell 3',
                                                    format: {},
                                                },
                                            ],
                                            format: {
                                                textAlign: 'start',
                                            },
                                            cachedElement: undefined,
                                            isImplicit: undefined,
                                            segmentFormat: undefined,
                                        },
                                    ],
                                    spanAbove: false,
                                    spanLeft: false,
                                    format: {
                                        textAlign: 'start',
                                        borderTop: '1px solid rgb(171, 171, 171)',
                                        borderRight: '1px solid rgb(171, 171, 171)',
                                        borderBottom: '1px solid rgb(171, 171, 171)',
                                        borderLeft: '1px solid rgb(171, 171, 171)',
                                    },
                                    dataset: {},
                                    isHeader: false,
                                    cachedElement: undefined,
                                    isSelected: undefined,
                                },
                            ],
                            cachedElement: undefined,
                        },
                    ],
                    cachedElement: undefined,
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Br',
                            format: {},
                            isSelected: undefined,
                        },
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        {
                            segmentType: 'Br',
                            format: {},
                            isSelected: undefined,
                        },
                    ],
                    format: {},
                    segmentFormat: undefined,
                    cachedElement: undefined,
                    isImplicit: undefined,
                },
            ],
            format: {},
        };
        runTest(markdown, expectedContentModel);
    });

    it('should covert markdown with a list to content model', () => {
        const list = '* Item 1\n* Item 2\n* Item 3';
        const expectedContentModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockGroupType: 'ListItem',
                    blockType: 'BlockGroup',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    isSelected: undefined,
                                    text: 'Item 1',
                                    format: {},
                                },
                            ],
                            format: {},
                            segmentFormat: undefined,
                            cachedElement: undefined,
                            isImplicit: undefined,
                        },
                    ],
                    format: {},
                    levels: [
                        {
                            listType: 'UL',
                            dataset: {},
                            format: {},
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    cachedElement: undefined,
                },
                {
                    blockGroupType: 'ListItem',
                    blockType: 'BlockGroup',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    isSelected: undefined,
                                    text: 'Item 2',
                                    format: {},
                                },
                            ],
                            format: {},
                            segmentFormat: undefined,
                            cachedElement: undefined,
                            isImplicit: undefined,
                        },
                    ],
                    format: {},
                    levels: [
                        {
                            listType: 'UL',
                            dataset: {},
                            format: {},
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    cachedElement: undefined,
                },
                {
                    blockGroupType: 'ListItem',
                    blockType: 'BlockGroup',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    isSelected: undefined,
                                    text: 'Item 3',
                                    format: {},
                                },
                            ],
                            format: {},
                            segmentFormat: undefined,
                            cachedElement: undefined,
                            isImplicit: undefined,
                        },
                    ],
                    format: {},
                    levels: [
                        {
                            listType: 'UL',
                            dataset: {},
                            format: {},
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    cachedElement: undefined,
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Br',
                            format: {},
                            isSelected: undefined,
                        },
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        {
                            segmentType: 'Br',
                            format: {},
                            isSelected: undefined,
                        },
                    ],
                    format: {},
                    segmentFormat: undefined,
                    cachedElement: undefined,
                    isImplicit: undefined,
                },
            ],
            format: {},
        };
        runTest(list, expectedContentModel);
    });

    it('should convert sample doc', () => {
        const markdown = `# Sample Markdown Document\rThis document showcases basic Markdown syntax.\n## Paragraphs\nThis is a paragraph. It can span multiple lines and is rendered as a single block of text.\nHere's another paragraph, separated by a blank line.\n## Emphasis\n*Italic text* (using asterisks)\n**Bold text** (using double asterisks)\n***Bold and italic*** (using triple asterisks)\n## Lists\n### Unordered List\n- First item\n- Second item\n- Third item\n  - Second level list item\n### Ordered List\n1. First item\n2. Second item\n3. Third item\n  1. Second level list item\n## Tables\n| Header 1 | Header 2 | Header 3 |\n|----------|----------|----------|\n| Row 1    | Data 1   | Data 1   |\n| Row 2    | Data 2   | Data 2   |\n| Row 3    | Data 3   | Data 3   |\n## Links and Images\nHere is a [link to Markdown documentation](https://commonmark.org).\n![Markdown Logo](https://markdown-here.com/img/icon256.png)\n## Blockquotes\n> This is a quote.\n> It can span multiple lines.\n`;
        const sample: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                //0
                {
                    segments: [
                        {
                            text: 'Sample Markdown Document',
                            segmentType: 'Text',
                            isSelected: undefined,
                            format: {},
                        },
                    ],
                    blockType: 'Paragraph',
                    format: {},
                    decorator: {
                        tagName: 'h1',
                        format: {
                            fontWeight: 'bold',
                            fontSize: '2em',
                        },
                    },
                    cachedElement: undefined,
                    isImplicit: undefined,
                    segmentFormat: undefined,
                },
                //1
                {
                    segments: [
                        {
                            text: 'This document showcases basic Markdown syntax.',
                            segmentType: 'Text',
                            isSelected: undefined,
                            format: {},
                        },
                    ],
                    segmentFormat: undefined,
                    blockType: 'Paragraph',
                    format: {},
                    cachedElement: undefined,
                    isImplicit: undefined,
                },
                //2
                {
                    segments: [
                        {
                            text: 'Paragraphs',
                            segmentType: 'Text',
                            isSelected: undefined,
                            format: {},
                        },
                    ],
                    blockType: 'Paragraph',
                    format: {},
                    decorator: {
                        tagName: 'h2',
                        format: {
                            fontWeight: 'bold',
                            fontSize: '1.5em',
                        },
                    },
                    cachedElement: undefined,
                    isImplicit: undefined,
                    segmentFormat: undefined,
                },
                //3
                {
                    segments: [
                        {
                            text:
                                'This is a paragraph. It can span multiple lines and is rendered as a single block of text.',
                            segmentType: 'Text',
                            isSelected: undefined,
                            format: {},
                        },
                    ],
                    segmentFormat: undefined,
                    blockType: 'Paragraph',
                    format: {},
                    cachedElement: undefined,
                    isImplicit: undefined,
                },
                //4
                {
                    segments: [
                        {
                            text: "Here's another paragraph, separated by a blank line.",
                            segmentType: 'Text',
                            isSelected: undefined,
                            format: {},
                        },
                    ],
                    segmentFormat: undefined,
                    blockType: 'Paragraph',
                    format: {},
                    cachedElement: undefined,
                    isImplicit: undefined,
                },
                //5
                {
                    segments: [
                        {
                            text: 'Emphasis',
                            segmentType: 'Text',
                            isSelected: undefined,
                            format: {},
                        },
                    ],
                    blockType: 'Paragraph',
                    format: {},
                    decorator: {
                        tagName: 'h2',
                        format: {
                            fontWeight: 'bold',
                            fontSize: '1.5em',
                        },
                    },
                    cachedElement: undefined,
                    isImplicit: undefined,
                    segmentFormat: undefined,
                },
                //6
                {
                    segments: [
                        {
                            text: 'Italic text ',
                            segmentType: 'Text',
                            isSelected: undefined,
                            format: {
                                italic: true,
                            },
                        },
                        {
                            text: '(using asterisks)',
                            segmentType: 'Text',
                            isSelected: undefined,
                            format: {},
                        },
                    ],
                    segmentFormat: undefined,
                    blockType: 'Paragraph',
                    format: {},
                    cachedElement: undefined,
                    isImplicit: undefined,
                },
                //7
                {
                    segments: [
                        {
                            text: 'Bold text ',
                            segmentType: 'Text',
                            isSelected: undefined,
                            format: {
                                fontWeight: 'bold',
                            },
                        },
                        {
                            text: '(using double asterisks)',
                            segmentType: 'Text',
                            isSelected: undefined,
                            format: {},
                        },
                    ],
                    segmentFormat: undefined,
                    blockType: 'Paragraph',
                    format: {},
                    cachedElement: undefined,
                    isImplicit: undefined,
                },
                //8
                {
                    segments: [
                        {
                            text: 'Bold and italic ',
                            segmentType: 'Text',
                            isSelected: undefined,
                            format: {
                                fontWeight: 'bold',
                                italic: true,
                            },
                        },
                        {
                            text: '(using triple asterisks)',
                            segmentType: 'Text',
                            isSelected: undefined,
                            format: {},
                        },
                    ],
                    segmentFormat: undefined,
                    blockType: 'Paragraph',
                    format: {},
                    cachedElement: undefined,
                    isImplicit: undefined,
                },
                //9
                {
                    segments: [
                        {
                            text: 'Lists',
                            segmentType: 'Text',
                            isSelected: undefined,
                            format: {},
                        },
                    ],
                    blockType: 'Paragraph',
                    format: {},
                    decorator: {
                        tagName: 'h2',
                        format: {
                            fontWeight: 'bold',
                            fontSize: '1.5em',
                        },
                    },
                    cachedElement: undefined,
                    isImplicit: undefined,
                    segmentFormat: undefined,
                },
                //10
                {
                    segments: [
                        {
                            text: 'Unordered List',
                            segmentType: 'Text',
                            isSelected: undefined,
                            format: {},
                        },
                    ],
                    blockType: 'Paragraph',
                    format: {},
                    decorator: {
                        tagName: 'h3',
                        format: {
                            fontWeight: 'bold',
                            fontSize: '1.17em',
                        },
                    },
                    cachedElement: undefined,
                    isImplicit: undefined,
                    segmentFormat: undefined,
                },
                //11
                {
                    formatHolder: {
                        isSelected: false,
                        segmentType: 'SelectionMarker',
                        format: {},
                    },
                    levels: [
                        {
                            listType: 'UL',
                            format: {},
                            dataset: {},
                        },
                    ],
                    blockType: 'BlockGroup',
                    format: {},
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            segments: [
                                {
                                    text: 'First item',
                                    segmentType: 'Text',
                                    isSelected: undefined,
                                    format: {},
                                },
                            ],
                            segmentFormat: undefined,
                            blockType: 'Paragraph',
                            format: {},
                            cachedElement: undefined,
                            isImplicit: undefined,
                        },
                    ],
                    cachedElement: undefined,
                },
                //12
                {
                    formatHolder: {
                        isSelected: false,
                        segmentType: 'SelectionMarker',
                        format: {},
                    },
                    levels: [
                        {
                            listType: 'UL',
                            format: {},
                            dataset: {},
                        },
                    ],
                    blockType: 'BlockGroup',
                    format: {},
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            segments: [
                                {
                                    text: 'Second item',
                                    segmentType: 'Text',
                                    isSelected: undefined,
                                    format: {},
                                },
                            ],
                            segmentFormat: undefined,
                            blockType: 'Paragraph',
                            format: {},
                            isImplicit: undefined,
                            cachedElement: undefined,
                        },
                    ],
                    cachedElement: undefined,
                },
                //13
                {
                    formatHolder: {
                        isSelected: false,
                        segmentType: 'SelectionMarker',
                        format: {},
                    },
                    levels: [
                        {
                            listType: 'UL',
                            format: {},
                            dataset: {},
                        },
                    ],
                    blockType: 'BlockGroup',
                    format: {},
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            segments: [
                                {
                                    text: 'Third item',
                                    segmentType: 'Text',
                                    isSelected: undefined,
                                    format: {},
                                },
                            ],
                            segmentFormat: undefined,
                            blockType: 'Paragraph',
                            format: {},
                            isImplicit: undefined,
                            cachedElement: undefined,
                        },
                    ],
                    cachedElement: undefined,
                },
                //14
                {
                    formatHolder: {
                        isSelected: false,
                        segmentType: 'SelectionMarker',
                        format: {},
                    },
                    levels: [
                        {
                            listType: 'UL',
                            format: {},
                            dataset: {},
                        },
                        {
                            listType: 'UL',
                            format: {},
                            dataset: {},
                        },
                    ],
                    blockType: 'BlockGroup',
                    format: {},
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            segments: [
                                {
                                    text: 'Second level list item',
                                    segmentType: 'Text',
                                    isSelected: undefined,
                                    format: {},
                                },
                            ],
                            segmentFormat: undefined,
                            blockType: 'Paragraph',
                            isImplicit: undefined,
                            cachedElement: undefined,
                            format: {},
                        },
                    ],
                    cachedElement: undefined,
                },
                //15
                {
                    segments: [
                        {
                            text: 'Ordered List',
                            segmentType: 'Text',
                            isSelected: undefined,
                            format: {},
                        },
                    ],
                    blockType: 'Paragraph',
                    format: {},
                    decorator: {
                        tagName: 'h3',
                        format: {
                            fontWeight: 'bold',
                            fontSize: '1.17em',
                        },
                    },
                    isImplicit: undefined,
                    segmentFormat: undefined,
                    cachedElement: undefined,
                },
                //16
                {
                    formatHolder: {
                        isSelected: false,
                        segmentType: 'SelectionMarker',
                        format: {},
                    },
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                startNumberOverride: 1,
                            },
                            dataset: {},
                        },
                    ],
                    blockType: 'BlockGroup',
                    format: {},
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            segments: [
                                {
                                    text: 'First item',
                                    segmentType: 'Text',
                                    isSelected: undefined,
                                    format: {},
                                },
                            ],
                            segmentFormat: undefined,
                            blockType: 'Paragraph',
                            format: {},
                            cachedElement: undefined,
                            isImplicit: undefined,
                        },
                    ],
                    cachedElement: undefined,
                },
                //17
                {
                    formatHolder: {
                        isSelected: false,
                        segmentType: 'SelectionMarker',
                        format: {},
                    },
                    levels: [
                        {
                            listType: 'OL',
                            format: {},
                            dataset: {},
                        },
                    ],
                    blockType: 'BlockGroup',
                    format: {},
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            segments: [
                                {
                                    text: 'Second item',
                                    segmentType: 'Text',
                                    isSelected: undefined,
                                    format: {},
                                },
                            ],
                            segmentFormat: undefined,
                            blockType: 'Paragraph',
                            format: {},
                            isImplicit: undefined,
                            cachedElement: undefined,
                        },
                    ],
                    cachedElement: undefined,
                },
                //18
                {
                    formatHolder: {
                        isSelected: false,
                        segmentType: 'SelectionMarker',
                        format: {},
                    },
                    levels: [
                        {
                            listType: 'OL',
                            format: {},
                            dataset: {},
                        },
                    ],
                    blockType: 'BlockGroup',
                    format: {},
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            segments: [
                                {
                                    text: 'Third item',
                                    segmentType: 'Text',
                                    isSelected: undefined,
                                    format: {},
                                },
                            ],
                            segmentFormat: undefined,
                            blockType: 'Paragraph',
                            format: {},
                            isImplicit: undefined,
                            cachedElement: undefined,
                        },
                    ],
                    cachedElement: undefined,
                },
                //19
                {
                    formatHolder: {
                        isSelected: false,
                        segmentType: 'SelectionMarker',
                        format: {},
                    },
                    levels: [
                        {
                            listType: 'OL',
                            format: {},
                            dataset: {},
                        },
                        {
                            listType: 'OL',
                            format: {
                                startNumberOverride: 1,
                            },
                            dataset: {},
                        },
                    ],
                    blockType: 'BlockGroup',
                    format: {},
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            segments: [
                                {
                                    text: 'Second level list item',
                                    segmentType: 'Text',
                                    isSelected: undefined,
                                    format: {},
                                },
                            ],
                            segmentFormat: undefined,
                            blockType: 'Paragraph',
                            format: {},
                            isImplicit: undefined,
                            cachedElement: undefined,
                        },
                    ],
                    cachedElement: undefined,
                },
                //20
                {
                    segments: [
                        {
                            text: 'Tables',
                            segmentType: 'Text',
                            isSelected: undefined,
                            format: {},
                        },
                    ],
                    blockType: 'Paragraph',
                    format: {},
                    decorator: {
                        tagName: 'h2',
                        format: {
                            fontWeight: 'bold',
                            fontSize: '1.5em',
                        },
                    },
                    cachedElement: undefined,
                    isImplicit: undefined,
                    segmentFormat: undefined,
                },
                //21
                {
                    widths: [65.359375, 65.359375, 65.359375],
                    rows: [
                        {
                            height: 21,
                            cells: [
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: true,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            segments: [
                                                {
                                                    text: 'Header 1',
                                                    segmentType: 'Text',
                                                    isSelected: undefined,
                                                    format: {
                                                        fontWeight: 'bold',
                                                    },
                                                },
                                            ],
                                            segmentFormat: undefined,
                                            blockType: 'Paragraph',
                                            format: {
                                                textAlign: 'start',
                                            },
                                            cachedElement: undefined,
                                            isImplicit: undefined,
                                        },
                                    ],
                                    isSelected: undefined,
                                    format: {
                                        textAlign: 'start',
                                        borderTop: '1px solid rgb(171, 171, 171)',
                                        borderRight: '1px solid rgb(171, 171, 171)',
                                        borderBottom: '1px solid rgb(171, 171, 171)',
                                        borderLeft: '1px solid rgb(171, 171, 171)',
                                        backgroundColor: 'rgb(171, 171, 171)',
                                    },
                                    cachedElement: undefined,
                                    dataset: {},
                                },
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: true,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            segments: [
                                                {
                                                    text: 'Header 2',
                                                    segmentType: 'Text',
                                                    isSelected: undefined,
                                                    format: {
                                                        fontWeight: 'bold',
                                                    },
                                                },
                                            ],
                                            segmentFormat: undefined,
                                            blockType: 'Paragraph',
                                            format: {
                                                textAlign: 'start',
                                            },
                                            cachedElement: undefined,
                                            isImplicit: undefined,
                                        },
                                    ],
                                    isSelected: undefined,
                                    format: {
                                        textAlign: 'start',
                                        borderTop: '1px solid rgb(171, 171, 171)',
                                        borderRight: '1px solid rgb(171, 171, 171)',
                                        borderBottom: '1px solid rgb(171, 171, 171)',
                                        borderLeft: '1px solid rgb(171, 171, 171)',
                                        backgroundColor: 'rgb(171, 171, 171)',
                                    },
                                    dataset: {},
                                    cachedElement: undefined,
                                },
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: true,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            segments: [
                                                {
                                                    text: 'Header 3',
                                                    segmentType: 'Text',
                                                    isSelected: undefined,
                                                    format: {
                                                        fontWeight: 'bold',
                                                    },
                                                },
                                            ],
                                            segmentFormat: undefined,
                                            blockType: 'Paragraph',
                                            format: {
                                                textAlign: 'start',
                                            },
                                            cachedElement: undefined,
                                            isImplicit: undefined,
                                        },
                                    ],
                                    isSelected: undefined,
                                    format: {
                                        textAlign: 'start',
                                        borderTop: '1px solid rgb(171, 171, 171)',
                                        borderRight: '1px solid rgb(171, 171, 171)',
                                        borderBottom: '1px solid rgb(171, 171, 171)',
                                        borderLeft: '1px solid rgb(171, 171, 171)',
                                        backgroundColor: 'rgb(171, 171, 171)',
                                    },
                                    dataset: {},
                                    cachedElement: undefined,
                                },
                            ],
                            format: {},
                            cachedElement: undefined,
                        },
                        {
                            height: 21,
                            cells: [
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            segments: [
                                                {
                                                    text: 'Row 1',
                                                    segmentType: 'Text',
                                                    isSelected: undefined,
                                                    format: {},
                                                },
                                            ],
                                            segmentFormat: undefined,
                                            blockType: 'Paragraph',
                                            format: {
                                                textAlign: 'start',
                                            },
                                            cachedElement: undefined,
                                            isImplicit: undefined,
                                        },
                                    ],
                                    isSelected: undefined,
                                    format: {
                                        textAlign: 'start',
                                        borderTop: '1px solid rgb(171, 171, 171)',
                                        borderRight: '1px solid rgb(171, 171, 171)',
                                        borderBottom: '1px solid rgb(171, 171, 171)',
                                        borderLeft: '1px solid rgb(171, 171, 171)',
                                    },
                                    dataset: {},
                                    cachedElement: undefined,
                                },
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            segments: [
                                                {
                                                    text: 'Data 1',
                                                    segmentType: 'Text',
                                                    isSelected: undefined,
                                                    format: {},
                                                },
                                            ],
                                            segmentFormat: undefined,
                                            blockType: 'Paragraph',
                                            format: {
                                                textAlign: 'start',
                                            },
                                            cachedElement: undefined,
                                            isImplicit: undefined,
                                        },
                                    ],
                                    isSelected: undefined,
                                    format: {
                                        textAlign: 'start',
                                        borderTop: '1px solid rgb(171, 171, 171)',
                                        borderRight: '1px solid rgb(171, 171, 171)',
                                        borderBottom: '1px solid rgb(171, 171, 171)',
                                        borderLeft: '1px solid rgb(171, 171, 171)',
                                    },
                                    dataset: {},
                                    cachedElement: undefined,
                                },
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            segments: [
                                                {
                                                    text: 'Data 1',
                                                    segmentType: 'Text',
                                                    isSelected: undefined,
                                                    format: {},
                                                },
                                            ],
                                            segmentFormat: undefined,
                                            blockType: 'Paragraph',
                                            format: {
                                                textAlign: 'start',
                                            },
                                            cachedElement: undefined,
                                            isImplicit: undefined,
                                        },
                                    ],
                                    isSelected: undefined,
                                    format: {
                                        textAlign: 'start',
                                        borderTop: '1px solid rgb(171, 171, 171)',
                                        borderRight: '1px solid rgb(171, 171, 171)',
                                        borderBottom: '1px solid rgb(171, 171, 171)',
                                        borderLeft: '1px solid rgb(171, 171, 171)',
                                    },
                                    dataset: {},
                                    cachedElement: undefined,
                                },
                            ],
                            format: {},
                            cachedElement: undefined,
                        },
                        {
                            height: 21,
                            cells: [
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            segments: [
                                                {
                                                    text: 'Row 2',
                                                    segmentType: 'Text',
                                                    isSelected: undefined,
                                                    format: {},
                                                },
                                            ],
                                            segmentFormat: undefined,
                                            cachedElement: undefined,
                                            isImplicit: undefined,
                                            blockType: 'Paragraph',
                                            format: {
                                                textAlign: 'start',
                                            },
                                        },
                                    ],
                                    isSelected: undefined,
                                    format: {
                                        textAlign: 'start',
                                        borderTop: '1px solid rgb(171, 171, 171)',
                                        borderRight: '1px solid rgb(171, 171, 171)',
                                        borderBottom: '1px solid rgb(171, 171, 171)',
                                        borderLeft: '1px solid rgb(171, 171, 171)',
                                    },
                                    dataset: {},
                                    cachedElement: undefined,
                                },
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            segments: [
                                                {
                                                    text: 'Data 2',
                                                    segmentType: 'Text',
                                                    isSelected: undefined,
                                                    format: {},
                                                },
                                            ],
                                            segmentFormat: undefined,
                                            blockType: 'Paragraph',
                                            format: {
                                                textAlign: 'start',
                                            },
                                            cachedElement: undefined,
                                            isImplicit: undefined,
                                        },
                                    ],
                                    isSelected: undefined,
                                    format: {
                                        textAlign: 'start',
                                        borderTop: '1px solid rgb(171, 171, 171)',
                                        borderRight: '1px solid rgb(171, 171, 171)',
                                        borderBottom: '1px solid rgb(171, 171, 171)',
                                        borderLeft: '1px solid rgb(171, 171, 171)',
                                    },
                                    dataset: {},
                                    cachedElement: undefined,
                                },
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            segments: [
                                                {
                                                    text: 'Data 2',
                                                    segmentType: 'Text',
                                                    isSelected: undefined,
                                                    format: {},
                                                },
                                            ],
                                            segmentFormat: undefined,
                                            blockType: 'Paragraph',
                                            format: {
                                                textAlign: 'start',
                                            },
                                            cachedElement: undefined,
                                            isImplicit: undefined,
                                        },
                                    ],
                                    isSelected: undefined,
                                    format: {
                                        textAlign: 'start',
                                        borderTop: '1px solid rgb(171, 171, 171)',
                                        borderRight: '1px solid rgb(171, 171, 171)',
                                        borderBottom: '1px solid rgb(171, 171, 171)',
                                        borderLeft: '1px solid rgb(171, 171, 171)',
                                    },
                                    dataset: {},
                                    cachedElement: undefined,
                                },
                            ],
                            format: {},
                            cachedElement: undefined,
                        },
                        {
                            height: 21,
                            cells: [
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            segments: [
                                                {
                                                    text: 'Row 3',
                                                    segmentType: 'Text',
                                                    isSelected: undefined,
                                                    format: {},
                                                },
                                            ],
                                            segmentFormat: undefined,
                                            blockType: 'Paragraph',
                                            format: {
                                                textAlign: 'start',
                                            },
                                            cachedElement: undefined,
                                            isImplicit: undefined,
                                        },
                                    ],
                                    isSelected: undefined,
                                    format: {
                                        textAlign: 'start',
                                        borderTop: '1px solid rgb(171, 171, 171)',
                                        borderRight: '1px solid rgb(171, 171, 171)',
                                        borderBottom: '1px solid rgb(171, 171, 171)',
                                        borderLeft: '1px solid rgb(171, 171, 171)',
                                    },
                                    dataset: {},
                                    cachedElement: undefined,
                                },
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            segments: [
                                                {
                                                    text: 'Data 3',
                                                    segmentType: 'Text',
                                                    isSelected: undefined,
                                                    format: {},
                                                },
                                            ],
                                            segmentFormat: undefined,
                                            blockType: 'Paragraph',
                                            cachedElement: undefined,
                                            isImplicit: undefined,
                                            format: {
                                                textAlign: 'start',
                                            },
                                        },
                                    ],
                                    isSelected: undefined,
                                    format: {
                                        textAlign: 'start',
                                        borderTop: '1px solid rgb(171, 171, 171)',
                                        borderRight: '1px solid rgb(171, 171, 171)',
                                        borderBottom: '1px solid rgb(171, 171, 171)',
                                        borderLeft: '1px solid rgb(171, 171, 171)',
                                    },
                                    dataset: {},
                                    cachedElement: undefined,
                                },
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            segments: [
                                                {
                                                    text: 'Data 3',
                                                    segmentType: 'Text',
                                                    isSelected: undefined,
                                                    format: {},
                                                },
                                            ],
                                            segmentFormat: undefined,
                                            blockType: 'Paragraph',
                                            format: {
                                                textAlign: 'start',
                                            },
                                            cachedElement: undefined,
                                            isImplicit: undefined,
                                        },
                                    ],
                                    isSelected: undefined,
                                    format: {
                                        textAlign: 'start',
                                        borderTop: '1px solid rgb(171, 171, 171)',
                                        borderRight: '1px solid rgb(171, 171, 171)',
                                        borderBottom: '1px solid rgb(171, 171, 171)',
                                        borderLeft: '1px solid rgb(171, 171, 171)',
                                    },
                                    dataset: {},
                                    cachedElement: undefined,
                                },
                            ],
                            format: {},
                            cachedElement: undefined,
                        },
                    ],
                    blockType: 'Table',
                    format: {
                        borderCollapse: true,

                        useBorderBox: true,
                    },
                    dataset: {
                        editingInfo:
                            '{"topBorderColor":"#ABABAB","bottomBorderColor":"#ABABAB","verticalBorderColor":"#ABABAB","hasHeaderRow":true,"hasFirstColumn":false,"hasBandedRows":false,"hasBandedColumns":false,"bgColorEven":null,"bgColorOdd":"#ABABAB20","headerRowColor":"#ABABAB","tableBorderFormat":0,"verticalAlign":null}',
                    },
                    cachedElement: undefined,
                },
                //22
                {
                    segments: [
                        {
                            text: 'Links and Images',
                            segmentType: 'Text',
                            isSelected: undefined,
                            format: {},
                        },
                    ],
                    blockType: 'Paragraph',
                    format: {},
                    decorator: {
                        tagName: 'h2',
                        format: {
                            fontWeight: 'bold',
                            fontSize: '1.5em',
                        },
                    },
                    cachedElement: undefined,
                    isImplicit: undefined,
                    segmentFormat: undefined,
                },
                //23
                {
                    segments: [
                        {
                            text: 'Here is a ',
                            segmentType: 'Text',
                            isSelected: undefined,
                            format: {},
                        },
                        {
                            text: 'link to Markdown documentation',
                            segmentType: 'Text',
                            isSelected: undefined,
                            format: {},
                            link: {
                                format: {
                                    href: 'https://commonmark.org',
                                    underline: true,
                                },
                                dataset: {},
                            },
                        },
                        {
                            text: '.',
                            segmentType: 'Text',
                            isSelected: undefined,
                            format: {},
                        },
                    ],
                    segmentFormat: undefined,
                    blockType: 'Paragraph',
                    format: {},
                    cachedElement: undefined,
                    isImplicit: undefined,
                },
                //24
                {
                    segments: [
                        {
                            src: 'https://markdown-here.com/img/icon256.png',
                            alt: 'Markdown Logo',
                            segmentType: 'Image',
                            format: {
                                maxWidth: '100px',
                            },
                            dataset: {},
                            title: undefined,
                            isSelectedAsImageSelection: undefined,
                            isSelected: undefined,
                        },
                    ],
                    segmentFormat: undefined,
                    blockType: 'Paragraph',
                    format: {},
                    cachedElement: undefined,
                    isImplicit: undefined,
                },
                //25
                {
                    segments: [
                        {
                            text: 'Blockquotes',
                            segmentType: 'Text',
                            isSelected: undefined,
                            format: {},
                        },
                    ],
                    blockType: 'Paragraph',
                    format: {},
                    decorator: {
                        tagName: 'h2',
                        format: {
                            fontWeight: 'bold',
                            fontSize: '1.5em',
                        },
                    },
                    segmentFormat: undefined,
                    cachedElement: undefined,
                    isImplicit: undefined,
                },
                //26
                {
                    tagName: 'blockquote',
                    blockType: 'BlockGroup',
                    format: {
                        borderLeft: '3px solid rgb(200, 200, 200)',
                        marginTop: '1em',
                        marginBottom: '1em',
                        marginLeft: '40px',
                        marginRight: '40px',
                        paddingLeft: '10px',
                    },
                    blockGroupType: 'FormatContainer',
                    blocks: [
                        {
                            segments: [
                                {
                                    text: 'This is a quote.',
                                    segmentType: 'Text',
                                    isSelected: undefined,
                                    format: {
                                        textColor: 'rgb(102, 102, 102)',
                                    },
                                },
                            ],
                            segmentFormat: {
                                textColor: 'rgb(102, 102, 102)',
                            },
                            blockType: 'Paragraph',
                            isImplicit: undefined,
                            cachedElement: undefined,
                            format: {},
                        },
                        {
                            segments: [
                                {
                                    text: 'It can span multiple lines.',
                                    segmentType: 'Text',
                                    isSelected: undefined,
                                    format: {
                                        textColor: 'rgb(102, 102, 102)',
                                    },
                                },
                            ],
                            segmentFormat: {
                                textColor: 'rgb(102, 102, 102)',
                            },
                            blockType: 'Paragraph',
                            format: {},
                            cachedElement: undefined,
                            isImplicit: undefined,
                        },
                    ],
                    cachedElement: undefined,
                },
                //27
                {
                    segments: [
                        {
                            segmentType: 'Br',
                            format: {},
                            isSelected: undefined,
                        },
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        {
                            segmentType: 'Br',
                            format: {},
                            isSelected: undefined,
                        },
                    ],
                    blockType: 'Paragraph',
                    isImplicit: undefined,
                    cachedElement: undefined,
                    format: {},
                    segmentFormat: undefined,
                },
            ],
            format: {},
        };

        runTest(markdown, sample);
    });
});
