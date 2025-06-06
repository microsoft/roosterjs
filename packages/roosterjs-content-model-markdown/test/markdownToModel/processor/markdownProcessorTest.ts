import { ContentModelDocument } from 'roosterjs-content-model-types';
import { markdownProcessor } from '../../../lib/markdownToModel/processor/markdownProcessor';
import {
    createContentModelDocument,
    createFormatContainer,
    createParagraph,
    createText,
} from 'roosterjs-content-model-dom';

describe('markdownProcessor', () => {
    function runTest(test: string, expected: ContentModelDocument) {
        // Act
        const result = markdownProcessor(test, /\r\n|\r|\\n|\n/);

        // Assert
        expect(result).toEqual(expected);
    }

    it('should return document with paragraph for text', () => {
        const document: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            text: 'text',
                            format: {},
                            segmentType: 'Text',
                        },
                    ],

                    format: {},
                },
            ],
        };
        runTest('text', document);
    });

    it('should return document with paragraph for text and image', () => {
        const document: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            text: 'text and image ',
                            format: {},
                            segmentType: 'Text',
                        },
                        {
                            alt: 'image of a dog',
                            src: 'https://www.example.com/image',
                            format: {},
                            segmentType: 'Image',
                            dataset: {},
                        },
                    ],

                    format: {},
                },
            ],
        };
        runTest('text and image ![image of a dog](https://www.example.com/image) ', document);
    });

    it('should return document with paragraph for text and link', () => {
        const document: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            text: 'text ',
                            format: {},
                            segmentType: 'Text',
                        },
                        {
                            text: 'link',
                            format: {},
                            link: {
                                dataset: {},
                                format: {
                                    href: 'https://www.example.com',
                                    underline: true,
                                },
                            },
                            segmentType: 'Text',
                        },
                    ],

                    format: {},
                },
            ],
        };
        runTest('text [link](https://www.example.com) ', document);
    });

    it('should return document with paragraph for text and bold', () => {
        const document: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            text: 'text ',
                            format: {},
                            segmentType: 'Text',
                        },
                        {
                            text: 'bold ',
                            format: {
                                fontWeight: 'bold',
                            },
                            segmentType: 'Text',
                        },
                    ],

                    format: {},
                },
            ],
        };
        runTest('text **bold** ', document);
    });

    it('should return document with paragraph for text and italic', () => {
        const document: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            text: 'text ',
                            format: {},
                            segmentType: 'Text',
                        },
                        {
                            text: 'italic ',
                            format: {
                                italic: true,
                            },
                            segmentType: 'Text',
                        },
                    ],

                    format: {},
                },
            ],
        };
        runTest('text *italic* ', document);
    });

    it('should return document with paragraph for text, link and image', () => {
        const document: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            text: 'text ',
                            format: {},
                            segmentType: 'Text',
                        },
                        {
                            text: 'link',
                            format: {},
                            link: {
                                dataset: {},
                                format: {
                                    href: 'https://www.example.com',
                                    underline: true,
                                },
                            },
                            segmentType: 'Text',
                        },
                        {
                            alt: 'image of a dog',
                            src: 'https://www.example.com/image',
                            format: {},
                            segmentType: 'Image',
                            dataset: {},
                        },
                    ],

                    format: {},
                },
            ],
        };
        runTest(
            'text [link](https://www.example.com) ![image of a dog](https://www.example.com/image) ',
            document
        );
    });

    it('should return document with list item for ordered_list', () => {
        const document: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    text: 'text',
                                    format: {},
                                    segmentType: 'Text',
                                },
                            ],

                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            dataset: {},
                            format: {},
                        },
                    ],
                    format: {},
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        format: {},
                        isSelected: false,
                    },
                },
            ],
        };
        runTest('1. text', document);
    });

    it('should return document with list item for unordered_list | *', () => {
        const document: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    text: 'text',
                                    format: {},
                                    segmentType: 'Text',
                                },
                            ],

                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'UL',
                            dataset: {},
                            format: {},
                        },
                    ],
                    format: {},
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        format: {},
                        isSelected: false,
                    },
                },
            ],
        };
        runTest('* text', document);
    });

    it('should return document with list item for unordered_list | -', () => {
        const document: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    text: 'text',
                                    format: {},
                                    segmentType: 'Text',
                                },
                            ],

                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'UL',
                            dataset: {},
                            format: {},
                        },
                    ],
                    format: {},
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        format: {},
                        isSelected: false,
                    },
                },
            ],
        };
        runTest('- text', document);
    });

    it('should return document with list item for unordered_list | +', () => {
        const document: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    text: 'text',
                                    format: {},
                                    segmentType: 'Text',
                                },
                            ],

                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'UL',
                            dataset: {},
                            format: {},
                        },
                    ],
                    format: {},
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        format: {},
                        isSelected: false,
                    },
                },
            ],
        };
        runTest('+ text', document);
    });

    it('should return document with list item for ordered_list with Heading 1 | +', () => {
        const document: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    text: 'text',
                                    format: {},
                                    segmentType: 'Text',
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
                    ],
                    levels: [
                        {
                            listType: 'UL',
                            dataset: {},
                            format: {},
                        },
                    ],
                    format: {},
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        format: {},
                        isSelected: false,
                    },
                },
            ],
        };
        runTest('+ # text', document);
    });

    it(' should return a document with a table with two rows and one column', () => {
        const document: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    widths: [],
                    blockType: 'Table',
                    rows: [
                        {
                            cells: [
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    dataset: {},
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            segments: [
                                                {
                                                    text: 'text1',
                                                    format: {},
                                                    segmentType: 'Text',
                                                },
                                            ],
                                            format: {},
                                            blockType: 'Paragraph',
                                        },
                                    ],
                                    format: {
                                        textAlign: 'start',
                                        borderTop: '1px solid #ABABAB',
                                        borderRight: '1px solid #ABABAB',
                                        borderBottom: '1px solid #ABABAB',
                                        borderLeft: '1px solid #ABABAB',
                                        backgroundColor: '#ABABAB',
                                        fontWeight: 'bold',
                                    },
                                    isHeader: true,
                                },
                            ],
                            height: 0,
                            format: {},
                        },
                        {
                            cells: [
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    dataset: {},
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            segments: [
                                                {
                                                    text: 'text2',
                                                    format: {},
                                                    segmentType: 'Text',
                                                },
                                            ],
                                            format: {},
                                            blockType: 'Paragraph',
                                        },
                                    ],
                                    isHeader: false,
                                    format: {
                                        textAlign: 'start',
                                        borderTop: '1px solid #ABABAB',
                                        borderRight: '1px solid #ABABAB',
                                        borderBottom: '1px solid #ABABAB',
                                        borderLeft: '1px solid #ABABAB',
                                    },
                                },
                            ],
                            height: 0,
                            format: {},
                        },
                    ],
                    format: {
                        borderCollapse: true,
                    },
                    dataset: {
                        editingInfo:
                            '{"topBorderColor":"#ABABAB","bottomBorderColor":"#ABABAB","verticalBorderColor":"#ABABAB","hasHeaderRow":true,"hasFirstColumn":false,"hasBandedRows":false,"hasBandedColumns":false,"bgColorEven":null,"bgColorOdd":"#ABABAB20","headerRowColor":"#ABABAB","tableBorderFormat":0,"verticalAlign":null}',
                    },
                },
            ],
        };
        runTest('|text1|\n|----|\n|text2|', document);
    });

    it('should return a table with two rows and two columns', () => {
        const document: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    widths: [],
                    blockType: 'Table',
                    rows: [
                        {
                            cells: [
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    dataset: {},
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            segments: [
                                                {
                                                    text: 'text1',
                                                    format: {},
                                                    segmentType: 'Text',
                                                },
                                            ],
                                            format: {},
                                            blockType: 'Paragraph',
                                        },
                                    ],
                                    format: {
                                        textAlign: 'start',
                                        borderTop: '1px solid #ABABAB',
                                        borderRight: '1px solid #ABABAB',
                                        borderBottom: '1px solid #ABABAB',
                                        borderLeft: '1px solid #ABABAB',
                                        backgroundColor: '#ABABAB',
                                        fontWeight: 'bold',
                                    },
                                    isHeader: true,
                                },
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    dataset: {},
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            segments: [
                                                {
                                                    text: 'text2',
                                                    format: {},
                                                    segmentType: 'Text',
                                                },
                                            ],
                                            format: {},
                                            blockType: 'Paragraph',
                                        },
                                    ],
                                    format: {
                                        textAlign: 'start',
                                        borderTop: '1px solid #ABABAB',
                                        borderRight: '1px solid #ABABAB',
                                        borderBottom: '1px solid #ABABAB',
                                        borderLeft: '1px solid #ABABAB',
                                        backgroundColor: '#ABABAB',
                                        fontWeight: 'bold',
                                    },
                                    isHeader: true,
                                },
                            ],
                            height: 0,
                            format: {},
                        },
                        {
                            cells: [
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    dataset: {},
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            segments: [
                                                {
                                                    text: 'text3',
                                                    format: {},
                                                    segmentType: 'Text',
                                                },
                                            ],
                                            format: {},
                                            blockType: 'Paragraph',
                                        },
                                    ],
                                    format: {
                                        textAlign: 'start',
                                        borderTop: '1px solid #ABABAB',
                                        borderRight: '1px solid #ABABAB',
                                        borderBottom: '1px solid #ABABAB',
                                        borderLeft: '1px solid #ABABAB',
                                    },
                                    isHeader: false,
                                },
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    dataset: {},
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            segments: [
                                                {
                                                    text: 'text4',
                                                    format: {},
                                                    segmentType: 'Text',
                                                },
                                            ],
                                            format: {},
                                            blockType: 'Paragraph',
                                        },
                                    ],
                                    format: {
                                        textAlign: 'start',
                                        borderTop: '1px solid #ABABAB',
                                        borderRight: '1px solid #ABABAB',
                                        borderBottom: '1px solid #ABABAB',
                                        borderLeft: '1px solid #ABABAB',
                                    },
                                    isHeader: false,
                                },
                            ],
                            height: 0,
                            format: {},
                        },
                    ],
                    format: {
                        borderCollapse: true,
                    },
                    dataset: {
                        editingInfo:
                            '{"topBorderColor":"#ABABAB","bottomBorderColor":"#ABABAB","verticalBorderColor":"#ABABAB","hasHeaderRow":true,"hasFirstColumn":false,"hasBandedRows":false,"hasBandedColumns":false,"bgColorEven":null,"bgColorOdd":"#ABABAB20","headerRowColor":"#ABABAB","tableBorderFormat":0,"verticalAlign":null}',
                    },
                },
            ],
        };
        runTest('|text1|text2|\n|----|----|\n|text3|text4|', document);
    });

    it('paragraph after list', () => {
        const document: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    text: 'text',
                                    format: {},
                                    segmentType: 'Text',
                                },
                            ],

                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'UL',
                            dataset: {},
                            format: {},
                        },
                    ],
                    format: {},
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        format: {},
                        isSelected: false,
                    },
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    text: 'text',
                                    format: {},
                                    segmentType: 'Text',
                                },
                            ],

                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'UL',
                            dataset: {},
                            format: {
                                displayForDummyItem: 'block',
                            },
                        },
                    ],
                    format: {},
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        format: {},
                        isSelected: false,
                    },
                },
                {
                    blockType: 'Paragraph',
                    segments: [{ segmentType: 'Text', text: 'paragraph', format: {} }],
                    format: {},
                },
            ],
        };
        runTest('- text\ntext\n\nparagraph', document);
    });

    it('paragraph after blockquote ', () => {
        const doc = createContentModelDocument();
        const blockquote = createFormatContainer('blockquote');
        const paragraph1 = createParagraph();
        blockquote.format = {
            borderLeft: '3px solid rgb(200, 200, 200)',
            textColor: 'rgb(102, 102, 102)',
            marginTop: '1em',
            marginBottom: '1em',
            marginLeft: '40px',
            marginRight: '40px',
            paddingLeft: '10px',
        };
        const text1 = createText(' text');
        const paragraph2 = createParagraph();
        const text2 = createText('text');
        paragraph1.segments.push(text1);
        paragraph2.segments.push(text2);
        blockquote.blocks.push(paragraph1, paragraph2);
        doc.blocks.push(blockquote);
        const paragraph3 = createParagraph();
        const text3 = createText('paragraph');
        paragraph3.segments.push(text3);
        doc.blocks.push(paragraph3);
        runTest('> text\ntext\n\nparagraph', doc);
    });

    it('should return a table with two rows and two columns with alignment', () => {
        const document: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    widths: [],
                    blockType: 'Table',
                    rows: [
                        {
                            cells: [
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    dataset: {},
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            segments: [
                                                {
                                                    text: 'text1',
                                                    format: {},
                                                    segmentType: 'Text',
                                                },
                                            ],
                                            format: {},
                                            blockType: 'Paragraph',
                                        },
                                    ],
                                    format: {
                                        textAlign: 'center',
                                        borderTop: '1px solid #ABABAB',
                                        borderRight: '1px solid #ABABAB',
                                        borderBottom: '1px solid #ABABAB',
                                        borderLeft: '1px solid #ABABAB',
                                        backgroundColor: '#ABABAB',
                                        fontWeight: 'bold',
                                    },
                                    isHeader: true,
                                },
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    dataset: {},
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            segments: [
                                                {
                                                    text: 'text2',
                                                    format: {},
                                                    segmentType: 'Text',
                                                },
                                            ],
                                            format: {},
                                            blockType: 'Paragraph',
                                        },
                                    ],
                                    format: {
                                        textAlign: 'end',
                                        borderTop: '1px solid #ABABAB',
                                        borderRight: '1px solid #ABABAB',
                                        borderBottom: '1px solid #ABABAB',
                                        borderLeft: '1px solid #ABABAB',
                                        backgroundColor: '#ABABAB',
                                        fontWeight: 'bold',
                                    },
                                    isHeader: true,
                                },
                            ],
                            height: 0,
                            format: {},
                        },
                        {
                            cells: [
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    dataset: {},
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            segments: [
                                                {
                                                    text: 'text3',
                                                    format: {},
                                                    segmentType: 'Text',
                                                },
                                            ],
                                            format: {},
                                            blockType: 'Paragraph',
                                        },
                                    ],
                                    format: {
                                        textAlign: 'center',
                                        borderTop: '1px solid #ABABAB',
                                        borderRight: '1px solid #ABABAB',
                                        borderBottom: '1px solid #ABABAB',
                                        borderLeft: '1px solid #ABABAB',
                                    },
                                    isHeader: false,
                                },
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    dataset: {},
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            segments: [
                                                {
                                                    text: 'text4',
                                                    format: {},
                                                    segmentType: 'Text',
                                                },
                                            ],
                                            format: {},
                                            blockType: 'Paragraph',
                                        },
                                    ],
                                    format: {
                                        textAlign: 'end',
                                        borderTop: '1px solid #ABABAB',
                                        borderRight: '1px solid #ABABAB',
                                        borderBottom: '1px solid #ABABAB',
                                        borderLeft: '1px solid #ABABAB',
                                    },
                                    isHeader: false,
                                },
                            ],
                            height: 0,
                            format: {},
                        },
                    ],
                    format: {
                        borderCollapse: true,
                    },
                    dataset: {
                        editingInfo:
                            '{"topBorderColor":"#ABABAB","bottomBorderColor":"#ABABAB","verticalBorderColor":"#ABABAB","hasHeaderRow":true,"hasFirstColumn":false,"hasBandedRows":false,"hasBandedColumns":false,"bgColorEven":null,"bgColorOdd":"#ABABAB20","headerRowColor":"#ABABAB","tableBorderFormat":0,"verticalAlign":null}',
                    },
                },
            ],
        };
        runTest('|text1|text2|\n|:----:|----:|\n|text3|text4|', document);
    });
});
