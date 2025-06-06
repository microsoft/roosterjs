import { ContentModelDocument } from 'roosterjs-content-model-types';
import { convertMarkdownToContentModel } from '../../lib/markdownToModel/convertMarkdownToContentModel';

describe('convertMarkdownToContentModel', () => {
    function runTest(markdown: string, expectedContentModel: ContentModelDocument) {
        convertMarkdownToContentModel(markdown);
        const actualContentModel = convertMarkdownToContentModel(markdown);
        expect(actualContentModel).toEqual(expectedContentModel);
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
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',

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
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',

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
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'Header 4',
                            format: {},
                        },
                    ],
                    format: {},
                    decorator: {
                        tagName: 'h4',
                        format: {
                            fontWeight: 'bold',
                            fontSize: '1em',
                        },
                    },
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',

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
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',

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
                },
            ],
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

                    format: {},
                },
            ],
        };
        runTest(markdown, expectedContentModel);
    });

    it('should convert markdown to content model with table', () => {
        const markdown = `|Header 1|Header 2|Header 3|\n| -------- | -------- | -------- |\n|Cell 1|Cell 2|Cell 3|\n|Cell 4|Cell 5|Cell 6|`;

        const expectedContentModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    widths: [],
                    format: {
                        borderCollapse: true,
                    },
                    dataset: {
                        editingInfo:
                            '{"topBorderColor":"#ABABAB","bottomBorderColor":"#ABABAB","verticalBorderColor":"#ABABAB","hasHeaderRow":true,"hasFirstColumn":false,"hasBandedRows":false,"hasBandedColumns":false,"bgColorEven":null,"bgColorOdd":"#ABABAB20","headerRowColor":"#ABABAB","tableBorderFormat":0,"verticalAlign":null}',
                    },
                    blockType: 'Table',
                    rows: [
                        {
                            height: 0,
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

                                                    text: 'Header 1',
                                                    format: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    spanAbove: false,
                                    spanLeft: false,
                                    format: {
                                        textAlign: 'start',
                                        borderTop: '1px solid #ABABAB',
                                        borderRight: '1px solid #ABABAB',
                                        borderBottom: '1px solid #ABABAB',
                                        borderLeft: '1px solid #ABABAB',
                                        backgroundColor: '#ABABAB',
                                        fontWeight: 'bold',
                                    },
                                    dataset: {},
                                    isHeader: true,
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Text',

                                                    text: 'Header 2',
                                                    format: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    spanAbove: false,
                                    spanLeft: false,
                                    format: {
                                        textAlign: 'start',
                                        borderTop: '1px solid #ABABAB',
                                        borderRight: '1px solid #ABABAB',
                                        borderBottom: '1px solid #ABABAB',
                                        borderLeft: '1px solid #ABABAB',
                                        backgroundColor: '#ABABAB',
                                        fontWeight: 'bold',
                                    },
                                    dataset: {},
                                    isHeader: true,
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Text',

                                                    text: 'Header 3',
                                                    format: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    spanAbove: false,
                                    spanLeft: false,
                                    format: {
                                        textAlign: 'start',
                                        borderTop: '1px solid #ABABAB',
                                        borderRight: '1px solid #ABABAB',
                                        borderBottom: '1px solid #ABABAB',
                                        borderLeft: '1px solid #ABABAB',
                                        backgroundColor: '#ABABAB',
                                        fontWeight: 'bold',
                                    },
                                    dataset: {},
                                    isHeader: true,
                                },
                            ],
                        },
                        {
                            height: 0,
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

                                                    text: 'Cell 1',
                                                    format: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    spanAbove: false,
                                    spanLeft: false,
                                    format: {
                                        textAlign: 'start',
                                        borderTop: '1px solid #ABABAB',
                                        borderRight: '1px solid #ABABAB',
                                        borderBottom: '1px solid #ABABAB',
                                        borderLeft: '1px solid #ABABAB',
                                    },
                                    dataset: {},
                                    isHeader: false,
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Text',

                                                    text: 'Cell 2',
                                                    format: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    spanAbove: false,
                                    spanLeft: false,
                                    format: {
                                        textAlign: 'start',
                                        borderTop: '1px solid #ABABAB',
                                        borderRight: '1px solid #ABABAB',
                                        borderBottom: '1px solid #ABABAB',
                                        borderLeft: '1px solid #ABABAB',
                                    },
                                    dataset: {},
                                    isHeader: false,
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Text',

                                                    text: 'Cell 3',
                                                    format: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    spanAbove: false,
                                    spanLeft: false,
                                    format: {
                                        textAlign: 'start',
                                        borderTop: '1px solid #ABABAB',
                                        borderRight: '1px solid #ABABAB',
                                        borderBottom: '1px solid #ABABAB',
                                        borderLeft: '1px solid #ABABAB',
                                    },
                                    dataset: {},
                                    isHeader: false,
                                },
                            ],
                        },
                        {
                            height: 0,
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

                                                    text: 'Cell 4',
                                                    format: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    spanAbove: false,
                                    spanLeft: false,
                                    format: {
                                        textAlign: 'start',
                                        borderTop: '1px solid #ABABAB',
                                        borderRight: '1px solid #ABABAB',
                                        borderBottom: '1px solid #ABABAB',
                                        borderLeft: '1px solid #ABABAB',
                                    },
                                    dataset: {},
                                    isHeader: false,
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Text',

                                                    text: 'Cell 5',
                                                    format: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    spanAbove: false,
                                    spanLeft: false,
                                    format: {
                                        textAlign: 'start',
                                        borderTop: '1px solid #ABABAB',
                                        borderRight: '1px solid #ABABAB',
                                        borderBottom: '1px solid #ABABAB',
                                        borderLeft: '1px solid #ABABAB',
                                    },
                                    dataset: {},
                                    isHeader: false,
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Text',

                                                    text: 'Cell 6',
                                                    format: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    spanAbove: false,
                                    spanLeft: false,
                                    format: {
                                        textAlign: 'start',
                                        borderTop: '1px solid #ABABAB',
                                        borderRight: '1px solid #ABABAB',
                                        borderBottom: '1px solid #ABABAB',
                                        borderLeft: '1px solid #ABABAB',
                                    },
                                    dataset: {},
                                    isHeader: false,
                                },
                            ],
                        },
                    ],
                },
            ],
        };
        runTest(markdown, expectedContentModel);
    });

    it('should convert markdown to content model with table with alignment', () => {
        const markdown = `|Header 1|Header 2|Header 3|\n|:--------:| --------:|:--------|\n|Cell 1|Cell 2|Cell 3|`;

        const expectedContentModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    widths: [],
                    format: {
                        borderCollapse: true,
                    },
                    dataset: {
                        editingInfo:
                            '{"topBorderColor":"#ABABAB","bottomBorderColor":"#ABABAB","verticalBorderColor":"#ABABAB","hasHeaderRow":true,"hasFirstColumn":false,"hasBandedRows":false,"hasBandedColumns":false,"bgColorEven":null,"bgColorOdd":"#ABABAB20","headerRowColor":"#ABABAB","tableBorderFormat":0,"verticalAlign":null}',
                    },
                    blockType: 'Table',
                    rows: [
                        {
                            height: 0,
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

                                                    text: 'Header 1',
                                                    format: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    spanAbove: false,
                                    spanLeft: false,
                                    format: {
                                        textAlign: 'center',
                                        fontWeight: 'bold',
                                        borderTop: '1px solid #ABABAB',
                                        borderRight: '1px solid #ABABAB',
                                        borderBottom: '1px solid #ABABAB',
                                        borderLeft: '1px solid #ABABAB',
                                        backgroundColor: '#ABABAB',
                                    },
                                    dataset: {},
                                    isHeader: true,
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Text',

                                                    text: 'Header 2',
                                                    format: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    spanAbove: false,
                                    spanLeft: false,
                                    format: {
                                        fontWeight: 'bold',
                                        textAlign: 'end',
                                        borderTop: '1px solid #ABABAB',
                                        borderRight: '1px solid #ABABAB',
                                        borderBottom: '1px solid #ABABAB',
                                        borderLeft: '1px solid #ABABAB',
                                        backgroundColor: '#ABABAB',
                                    },
                                    dataset: {},
                                    isHeader: true,
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Text',

                                                    text: 'Header 3',
                                                    format: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    spanAbove: false,
                                    spanLeft: false,
                                    format: {
                                        fontWeight: 'bold',
                                        textAlign: 'start',
                                        borderTop: '1px solid #ABABAB',
                                        borderRight: '1px solid #ABABAB',
                                        borderBottom: '1px solid #ABABAB',
                                        borderLeft: '1px solid #ABABAB',
                                        backgroundColor: '#ABABAB',
                                    },
                                    dataset: {},
                                    isHeader: true,
                                },
                            ],
                        },
                        {
                            height: 0,
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

                                                    text: 'Cell 1',
                                                    format: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    spanAbove: false,
                                    spanLeft: false,
                                    format: {
                                        textAlign: 'center',
                                        borderTop: '1px solid #ABABAB',
                                        borderRight: '1px solid #ABABAB',
                                        borderBottom: '1px solid #ABABAB',
                                        borderLeft: '1px solid #ABABAB',
                                    },
                                    dataset: {},
                                    isHeader: false,
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Text',

                                                    text: 'Cell 2',
                                                    format: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    spanAbove: false,
                                    spanLeft: false,
                                    format: {
                                        textAlign: 'end',
                                        borderTop: '1px solid #ABABAB',
                                        borderRight: '1px solid #ABABAB',
                                        borderBottom: '1px solid #ABABAB',
                                        borderLeft: '1px solid #ABABAB',
                                    },
                                    dataset: {},
                                    isHeader: false,
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Text',

                                                    text: 'Cell 3',
                                                    format: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    spanAbove: false,
                                    spanLeft: false,
                                    format: {
                                        textAlign: 'start',
                                        borderTop: '1px solid #ABABAB',
                                        borderRight: '1px solid #ABABAB',
                                        borderBottom: '1px solid #ABABAB',
                                        borderLeft: '1px solid #ABABAB',
                                    },
                                    dataset: {},
                                    isHeader: false,
                                },
                            ],
                        },
                    ],
                },
            ],
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

                                    text: 'Item 1',
                                    format: {},
                                },
                            ],
                            format: {},
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

                                    text: 'Item 2',
                                    format: {},
                                },
                            ],
                            format: {},
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

                                    text: 'Item 3',
                                    format: {},
                                },
                            ],
                            format: {},
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
                },
            ],
        };
        runTest(list, expectedContentModel);
    });

    it('should convert sample doc', () => {
        const markdown = `# Sample Markdown Document\nThis document showcases basic Markdown syntax.\n## Paragraphs\nThis is a paragraph. It can span multiple lines and is rendered as a single block of text.\n\nHere's another paragraph, separated by a blank line.\n## Emphasis\n*Italic text*(using asterisks)\n**Bold text**(using double asterisks)\n***Bold and italic***(using triple asterisks)\n## Lists\n\n### Unordered List\n\n- First item\n- Second item\n- Third item\n  - Second level list item\n\n### Ordered List\n1. First item\n2. Second item\n3. Third item\n  1. Second level list item\n\n## Tables\n|Header 1|Header 2|Header 3|\n|----------|----------|----------|\n|Row 1|Data 1|Data 1|\n|Row 2|Data 2|Data 2|\n|Row 3|Data 3|Data 3|\n## Links and Images\nHere is a [link to Markdown documentation](https://commonmark.org).\n![Markdown Logo](https://markdown-here.com/img/icon256.png)\n## Blockquotes\n> This is a quote.\n> It can span multiple lines.`;
        const sample: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                //0
                {
                    segments: [
                        {
                            text: 'Sample Markdown Document',
                            segmentType: 'Text',

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
                },
                //1
                {
                    segments: [
                        {
                            text: 'This document showcases basic Markdown syntax.',
                            segmentType: 'Text',

                            format: {},
                        },
                    ],

                    blockType: 'Paragraph',
                    format: {},
                },
                //2
                {
                    segments: [
                        {
                            text: 'Paragraphs',
                            segmentType: 'Text',

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
                },
                //3
                {
                    segments: [
                        {
                            text:
                                'This is a paragraph. It can span multiple lines and is rendered as a single block of text.',
                            segmentType: 'Text',

                            format: {},
                        },
                    ],

                    blockType: 'Paragraph',
                    format: {},
                },
                //4
                {
                    segments: [
                        {
                            text: "Here's another paragraph, separated by a blank line.",
                            segmentType: 'Text',

                            format: {},
                        },
                    ],

                    blockType: 'Paragraph',
                    format: {},
                },
                //5
                {
                    segments: [
                        {
                            text: 'Emphasis',
                            segmentType: 'Text',

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
                },
                //6
                {
                    segments: [
                        {
                            text: 'Italic text ',
                            segmentType: 'Text',

                            format: {
                                italic: true,
                            },
                        },
                        {
                            text: '(using asterisks)',
                            segmentType: 'Text',

                            format: {},
                        },
                    ],

                    blockType: 'Paragraph',
                    format: {},
                },
                //7
                {
                    segments: [
                        {
                            text: 'Bold text ',
                            segmentType: 'Text',

                            format: {
                                fontWeight: 'bold',
                            },
                        },
                        {
                            text: '(using double asterisks)',
                            segmentType: 'Text',

                            format: {},
                        },
                    ],

                    blockType: 'Paragraph',
                    format: {},
                },
                //8
                {
                    segments: [
                        {
                            text: 'Bold and italic ',
                            segmentType: 'Text',

                            format: {
                                fontWeight: 'bold',
                                italic: true,
                            },
                        },
                        {
                            text: '(using triple asterisks)',
                            segmentType: 'Text',

                            format: {},
                        },
                    ],

                    blockType: 'Paragraph',
                    format: {},
                },
                //9
                {
                    segments: [
                        {
                            text: 'Lists',
                            segmentType: 'Text',

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
                },
                //10
                {
                    segments: [
                        {
                            text: 'Unordered List',
                            segmentType: 'Text',

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

                                    format: {},
                                },
                            ],

                            blockType: 'Paragraph',
                            format: {},
                        },
                    ],
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

                                    format: {},
                                },
                            ],

                            blockType: 'Paragraph',
                            format: {},
                        },
                    ],
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

                                    format: {},
                                },
                            ],

                            blockType: 'Paragraph',
                            format: {},
                        },
                    ],
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

                                    format: {},
                                },
                            ],

                            blockType: 'Paragraph',

                            format: {},
                        },
                    ],
                },
                //15
                {
                    segments: [
                        {
                            text: 'Ordered List',
                            segmentType: 'Text',

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

                                    format: {},
                                },
                            ],

                            blockType: 'Paragraph',
                            format: {},
                        },
                    ],
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

                                    format: {},
                                },
                            ],

                            blockType: 'Paragraph',
                            format: {},
                        },
                    ],
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

                                    format: {},
                                },
                            ],

                            blockType: 'Paragraph',
                            format: {},
                        },
                    ],
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

                                    format: {},
                                },
                            ],

                            blockType: 'Paragraph',
                            format: {},
                        },
                    ],
                },
                //20
                {
                    segments: [
                        {
                            text: 'Tables',
                            segmentType: 'Text',

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
                },
                //21
                {
                    widths: [],
                    rows: [
                        {
                            height: 0,
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

                                                    format: {},
                                                },
                                            ],

                                            blockType: 'Paragraph',
                                            format: {},
                                        },
                                    ],

                                    format: {
                                        textAlign: 'start',
                                        fontWeight: 'bold',
                                        borderTop: '1px solid #ABABAB',
                                        borderRight: '1px solid #ABABAB',
                                        borderBottom: '1px solid #ABABAB',
                                        borderLeft: '1px solid #ABABAB',
                                        backgroundColor: '#ABABAB',
                                    },
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

                                                    format: {},
                                                },
                                            ],

                                            blockType: 'Paragraph',
                                            format: {},
                                        },
                                    ],

                                    format: {
                                        textAlign: 'start',
                                        fontWeight: 'bold',
                                        borderTop: '1px solid #ABABAB',
                                        borderRight: '1px solid #ABABAB',
                                        borderBottom: '1px solid #ABABAB',
                                        borderLeft: '1px solid #ABABAB',
                                        backgroundColor: '#ABABAB',
                                    },
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
                                                    text: 'Header 3',
                                                    segmentType: 'Text',

                                                    format: {},
                                                },
                                            ],

                                            blockType: 'Paragraph',
                                            format: {},
                                        },
                                    ],

                                    format: {
                                        textAlign: 'start',
                                        fontWeight: 'bold',
                                        borderTop: '1px solid #ABABAB',
                                        borderRight: '1px solid #ABABAB',
                                        borderBottom: '1px solid #ABABAB',
                                        borderLeft: '1px solid #ABABAB',
                                        backgroundColor: '#ABABAB',
                                    },
                                    dataset: {},
                                },
                            ],
                            format: {},
                        },
                        {
                            height: 0,
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

                                                    format: {},
                                                },
                                            ],

                                            blockType: 'Paragraph',
                                            format: {},
                                        },
                                    ],

                                    format: {
                                        textAlign: 'start',
                                        borderTop: '1px solid #ABABAB',
                                        borderRight: '1px solid #ABABAB',
                                        borderBottom: '1px solid #ABABAB',
                                        borderLeft: '1px solid #ABABAB',
                                    },
                                    dataset: {},
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

                                                    format: {},
                                                },
                                            ],

                                            blockType: 'Paragraph',
                                            format: {},
                                        },
                                    ],

                                    format: {
                                        textAlign: 'start',
                                        borderTop: '1px solid #ABABAB',
                                        borderRight: '1px solid #ABABAB',
                                        borderBottom: '1px solid #ABABAB',
                                        borderLeft: '1px solid #ABABAB',
                                    },
                                    dataset: {},
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

                                                    format: {},
                                                },
                                            ],

                                            blockType: 'Paragraph',
                                            format: {},
                                        },
                                    ],

                                    format: {
                                        textAlign: 'start',
                                        borderTop: '1px solid #ABABAB',
                                        borderRight: '1px solid #ABABAB',
                                        borderBottom: '1px solid #ABABAB',
                                        borderLeft: '1px solid #ABABAB',
                                    },
                                    dataset: {},
                                },
                            ],
                            format: {},
                        },
                        {
                            height: 0,
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

                                                    format: {},
                                                },
                                            ],

                                            blockType: 'Paragraph',
                                            format: {},
                                        },
                                    ],

                                    format: {
                                        textAlign: 'start',
                                        borderTop: '1px solid #ABABAB',
                                        borderRight: '1px solid #ABABAB',
                                        borderBottom: '1px solid #ABABAB',
                                        borderLeft: '1px solid #ABABAB',
                                    },
                                    dataset: {},
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

                                                    format: {},
                                                },
                                            ],

                                            blockType: 'Paragraph',
                                            format: {},
                                        },
                                    ],

                                    format: {
                                        textAlign: 'start',
                                        borderTop: '1px solid #ABABAB',
                                        borderRight: '1px solid #ABABAB',
                                        borderBottom: '1px solid #ABABAB',
                                        borderLeft: '1px solid #ABABAB',
                                    },
                                    dataset: {},
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

                                                    format: {},
                                                },
                                            ],

                                            blockType: 'Paragraph',
                                            format: {},
                                        },
                                    ],

                                    format: {
                                        textAlign: 'start',
                                        borderTop: '1px solid #ABABAB',
                                        borderRight: '1px solid #ABABAB',
                                        borderBottom: '1px solid #ABABAB',
                                        borderLeft: '1px solid #ABABAB',
                                    },
                                    dataset: {},
                                },
                            ],
                            format: {},
                        },
                        {
                            height: 0,
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

                                                    format: {},
                                                },
                                            ],

                                            blockType: 'Paragraph',
                                            format: {},
                                        },
                                    ],

                                    format: {
                                        textAlign: 'start',
                                        borderTop: '1px solid #ABABAB',
                                        borderRight: '1px solid #ABABAB',
                                        borderBottom: '1px solid #ABABAB',
                                        borderLeft: '1px solid #ABABAB',
                                    },
                                    dataset: {},
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

                                                    format: {},
                                                },
                                            ],

                                            blockType: 'Paragraph',

                                            format: {},
                                        },
                                    ],

                                    format: {
                                        textAlign: 'start',
                                        borderTop: '1px solid #ABABAB',
                                        borderRight: '1px solid #ABABAB',
                                        borderBottom: '1px solid #ABABAB',
                                        borderLeft: '1px solid #ABABAB',
                                    },
                                    dataset: {},
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

                                                    format: {},
                                                },
                                            ],

                                            blockType: 'Paragraph',
                                            format: {},
                                        },
                                    ],

                                    format: {
                                        textAlign: 'start',
                                        borderTop: '1px solid #ABABAB',
                                        borderRight: '1px solid #ABABAB',
                                        borderBottom: '1px solid #ABABAB',
                                        borderLeft: '1px solid #ABABAB',
                                    },
                                    dataset: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    blockType: 'Table',
                    format: {
                        borderCollapse: true,
                    },
                    dataset: {
                        editingInfo:
                            '{"topBorderColor":"#ABABAB","bottomBorderColor":"#ABABAB","verticalBorderColor":"#ABABAB","hasHeaderRow":true,"hasFirstColumn":false,"hasBandedRows":false,"hasBandedColumns":false,"bgColorEven":null,"bgColorOdd":"#ABABAB20","headerRowColor":"#ABABAB","tableBorderFormat":0,"verticalAlign":null}',
                    },
                },
                //22
                {
                    segments: [
                        {
                            text: 'Links and Images',
                            segmentType: 'Text',

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
                },
                //23
                {
                    segments: [
                        {
                            text: 'Here is a ',
                            segmentType: 'Text',

                            format: {},
                        },
                        {
                            text: 'link to Markdown documentation',
                            segmentType: 'Text',

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

                            format: {},
                        },
                    ],

                    blockType: 'Paragraph',
                    format: {},
                },
                //24
                {
                    segments: [
                        {
                            src: 'https://markdown-here.com/img/icon256.png',
                            alt: 'Markdown Logo',
                            segmentType: 'Image',
                            format: {},
                            dataset: {},
                        },
                    ],

                    blockType: 'Paragraph',
                    format: {},
                },
                //25
                {
                    segments: [
                        {
                            text: 'Blockquotes',
                            segmentType: 'Text',

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
                        textColor: 'rgb(102, 102, 102)',
                    },
                    blockGroupType: 'FormatContainer',
                    blocks: [
                        {
                            segments: [
                                {
                                    text: ' This is a quote.',
                                    segmentType: 'Text',
                                    format: {},
                                },
                            ],
                            blockType: 'Paragraph',
                            format: {},
                        },
                        {
                            segments: [
                                {
                                    text: ' It can span multiple lines.',
                                    segmentType: 'Text',
                                    format: {},
                                },
                            ],
                            blockType: 'Paragraph',
                            format: {},
                        },
                    ],
                },
            ],
        };

        runTest(markdown, sample);
    });
});
