import { ContentModelDocument } from 'roosterjs-content-model-types';
import { markdownProcessor } from '../../../lib/markdownToModel/processor/markdownProcessor';

describe('markdownProcessor', () => {
    function runTest(test: string, expected: ContentModelDocument) {
        // Act
        const result = markdownProcessor(test);

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
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            format: {},
                            segmentType: 'Br',
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
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            format: {},
                            segmentType: 'Br',
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
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            format: {},
                            segmentType: 'Br',
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
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            format: {},
                            segmentType: 'Br',
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
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            format: {},
                            segmentType: 'Br',
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
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            format: {},
                            segmentType: 'Br',
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
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            format: {},
                            segmentType: 'Br',
                        },
                    ],

                    format: {},
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
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            format: {},
                            segmentType: 'Br',
                        },
                    ],

                    format: {},
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
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            format: {},
                            segmentType: 'Br',
                        },
                    ],

                    format: {},
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
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            format: {},
                            segmentType: 'Br',
                        },
                    ],

                    format: {},
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
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            format: {},
                            segmentType: 'Br',
                        },
                    ],

                    format: {},
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
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            format: {},
                            segmentType: 'Br',
                        },
                    ],
                    format: {},
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
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            format: {},
                            segmentType: 'Br',
                        },
                    ],
                    format: {},
                },
            ],
        };
        runTest('|text1|text2|\n|----|----|\n|text3|text4|', document);
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
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            format: {},
                            segmentType: 'Br',
                        },
                    ],
                    format: {},
                },
            ],
        };
        runTest('|text1|text2|\n|:----:|----:|\n|text3|text4|', document);
    });
});
