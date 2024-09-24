import { ContentModelDocument } from 'roosterjs-content-model-types';
import { findEditingImage } from '../../../lib/imageEdit/utils/findEditingImage';

describe('findEditingImage', () => {
    it('no image', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: {},
                        },
                    ],
                    format: {},
                    segmentFormat: {},
                },
            ],
            format: {},
        };

        const image = findEditingImage(model);
        expect(image).toBeNull();
    });

    it('editing image', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Image',
                            src: 'test',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: 'rgb(0, 0, 0)',
                                id: 'image_0',
                                maxWidth: '1800px',
                            },
                            dataset: {
                                isEditing: 'true',
                            },
                        },
                    ],
                    format: {},
                    segmentFormat: {
                        fontFamily: 'Calibri',
                        fontSize: '11pt',
                        textColor: 'rgb(0, 0, 0)',
                    },
                },
            ],
            format: {
                fontFamily: 'Calibri',
                fontSize: '11pt',
                textColor: '#000000',
            },
        };

        const image = findEditingImage(model);
        expect(image).toEqual({
            image: {
                segmentType: 'Image',
                src: 'test',
                format: {
                    fontFamily: 'Calibri',
                    fontSize: '11pt',
                    textColor: 'rgb(0, 0, 0)',
                    id: 'image_0',
                    maxWidth: '1800px',
                },
                dataset: {
                    isEditing: 'true',
                },
            },
            paragraph: {
                blockType: 'Paragraph',
                segments: [
                    {
                        segmentType: 'Image',
                        src: 'test',
                        format: {
                            fontFamily: 'Calibri',
                            fontSize: '11pt',
                            textColor: 'rgb(0, 0, 0)',
                            id: 'image_0',
                            maxWidth: '1800px',
                        },
                        dataset: {
                            isEditing: 'true',
                        },
                    },
                ],
                format: {},
                segmentFormat: {
                    fontFamily: 'Calibri',
                    fontSize: '11pt',
                    textColor: 'rgb(0, 0, 0)',
                },
            },
        });
    });

    it('editing image in table', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    widths: [153, 120],
                    rows: [
                        {
                            height: 157,
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
                                                    src:
                                                        'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAsJCQcJCQcJCQkJCwkJCQkJCQsJCwsMCwsLDA0QDB...',
                                                    isSelectedAsImageSelection: true,
                                                    segmentType: 'Image',
                                                    isSelected: true,
                                                    format: {
                                                        fontFamily: 'Calibri',
                                                        fontSize: '11pt',
                                                        textColor: 'rgb(0, 0, 0)',
                                                        id: 'image_0',
                                                        maxWidth: '773px',
                                                    },
                                                    dataset: {
                                                        isEditing: 'true',
                                                    },
                                                },
                                            ],
                                            segmentFormat: {
                                                fontFamily: 'Calibri',
                                                fontSize: '11pt',
                                                textColor: 'rgb(0, 0, 0)',
                                            },
                                            blockType: 'Paragraph',
                                            format: {},
                                        },
                                    ],
                                    format: {
                                        borderTop: '1px solid rgb(171, 171, 171)',
                                        borderRight: '1px solid rgb(171, 171, 171)',
                                        borderBottom: '1px solid rgb(171, 171, 171)',
                                        borderLeft: '1px solid rgb(171, 171, 171)',
                                        verticalAlign: 'top',
                                        width: '120px',
                                        height: '22px',
                                        useBorderBox: true,
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
                                                    segmentType: 'Br',
                                                    format: {
                                                        fontFamily: 'Calibri',
                                                        fontSize: '11pt',
                                                        textColor: 'rgb(0, 0, 0)',
                                                    },
                                                },
                                            ],
                                            segmentFormat: {
                                                fontFamily: 'Calibri',
                                                fontSize: '11pt',
                                                textColor: 'rgb(0, 0, 0)',
                                            },
                                            blockType: 'Paragraph',
                                            format: {},
                                        },
                                    ],
                                    format: {
                                        borderTop: '1px solid rgb(171, 171, 171)',
                                        borderRight: '1px solid rgb(171, 171, 171)',
                                        borderBottom: '1px solid rgb(171, 171, 171)',
                                        borderLeft: '1px solid rgb(171, 171, 171)',
                                        verticalAlign: 'top',
                                        width: '120px',
                                        height: '22px',
                                        useBorderBox: true,
                                    },
                                    dataset: {},
                                },
                            ],
                            format: {},
                        },
                        {
                            height: 22,
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
                                                    segmentType: 'Br',
                                                    format: {
                                                        fontFamily: 'Calibri',
                                                        fontSize: '11pt',
                                                        textColor: 'rgb(0, 0, 0)',
                                                    },
                                                },
                                            ],
                                            segmentFormat: {
                                                fontFamily: 'Calibri',
                                                fontSize: '11pt',
                                                textColor: 'rgb(0, 0, 0)',
                                            },
                                            blockType: 'Paragraph',
                                            format: {},
                                        },
                                    ],
                                    format: {
                                        borderTop: '1px solid rgb(171, 171, 171)',
                                        borderRight: '1px solid rgb(171, 171, 171)',
                                        borderBottom: '1px solid rgb(171, 171, 171)',
                                        borderLeft: '1px solid rgb(171, 171, 171)',
                                        verticalAlign: 'top',
                                        width: '120px',
                                        height: '22px',
                                        useBorderBox: true,
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
                                                    segmentType: 'Br',
                                                    format: {
                                                        fontFamily: 'Calibri',
                                                        fontSize: '11pt',
                                                        textColor: 'rgb(0, 0, 0)',
                                                    },
                                                },
                                            ],
                                            segmentFormat: {
                                                fontFamily: 'Calibri',
                                                fontSize: '11pt',
                                                textColor: 'rgb(0, 0, 0)',
                                            },
                                            blockType: 'Paragraph',
                                            format: {},
                                        },
                                    ],
                                    format: {
                                        borderTop: '1px solid rgb(171, 171, 171)',
                                        borderRight: '1px solid rgb(171, 171, 171)',
                                        borderBottom: '1px solid rgb(171, 171, 171)',
                                        borderLeft: '1px solid rgb(171, 171, 171)',
                                        verticalAlign: 'top',
                                        width: '120px',
                                        height: '22px',
                                        useBorderBox: true,
                                    },
                                    dataset: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    blockType: 'Table',
                    format: {
                        useBorderBox: true,
                        borderCollapse: true,
                    },
                    dataset: {
                        editingInfo:
                            '{"topBorderColor":"#ABABAB","bottomBorderColor":"#ABABAB","verticalBorderColor":"#ABABAB","hasHeaderRow":false,"hasFirstColumn":false,"hasBandedRows":false,"hasBandedColumns":false,"bgColorEven":null,"bgColorOdd":"#ABABAB20","headerRowColor":"#ABABAB","tableBorderFormat":0,"verticalAlign":"top"}',
                    },
                },
                {
                    segments: [
                        {
                            segmentType: 'Br',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                    ],
                    segmentFormat: {
                        fontFamily: 'Calibri',
                        fontSize: '11pt',
                        textColor: 'rgb(0, 0, 0)',
                    },
                    blockType: 'Paragraph',
                    format: {},
                },
            ],
            format: {
                fontFamily: 'Calibri',
                fontSize: '11pt',
                textColor: '#000000',
            },
        };

        const image = findEditingImage(model);
        expect(image).toEqual({
            image: {
                src:
                    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAsJCQcJCQcJCQkJCwkJCQkJCQsJCwsMCwsLDA0QDB...',
                isSelectedAsImageSelection: true,
                segmentType: 'Image',
                isSelected: true,
                format: {
                    fontFamily: 'Calibri',
                    fontSize: '11pt',
                    textColor: 'rgb(0, 0, 0)',
                    id: 'image_0',
                    maxWidth: '773px',
                },
                dataset: {
                    isEditing: 'true',
                },
            },
            paragraph: {
                segments: [
                    {
                        src:
                            'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAsJCQcJCQcJCQkJCwkJCQkJCQsJCwsMCwsLDA0QDB...',
                        isSelectedAsImageSelection: true,
                        segmentType: 'Image',
                        isSelected: true,
                        format: {
                            fontFamily: 'Calibri',
                            fontSize: '11pt',
                            textColor: 'rgb(0, 0, 0)',
                            id: 'image_0',
                            maxWidth: '773px',
                        },
                        dataset: {
                            isEditing: 'true',
                        },
                    },
                ],
                segmentFormat: {
                    fontFamily: 'Calibri',
                    fontSize: '11pt',
                    textColor: 'rgb(0, 0, 0)',
                },
                blockType: 'Paragraph',
                format: {},
            },
        });
    });

    it('editing image | by Id', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Image',
                            src: 'test',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: 'rgb(0, 0, 0)',
                                id: 'image_0',
                                maxWidth: '1800px',
                            },
                            dataset: {},
                        },
                    ],
                    format: {},
                    segmentFormat: {
                        fontFamily: 'Calibri',
                        fontSize: '11pt',
                        textColor: 'rgb(0, 0, 0)',
                    },
                },
            ],
            format: {
                fontFamily: 'Calibri',
                fontSize: '11pt',
                textColor: '#000000',
            },
        };

        const image = findEditingImage(model, 'image_0');
        expect(image).toEqual({
            image: {
                segmentType: 'Image',
                src: 'test',
                format: {
                    fontFamily: 'Calibri',
                    fontSize: '11pt',
                    textColor: 'rgb(0, 0, 0)',
                    id: 'image_0',
                    maxWidth: '1800px',
                },
                dataset: {},
            },
            paragraph: {
                blockType: 'Paragraph',
                segments: [
                    {
                        segmentType: 'Image',
                        src: 'test',
                        format: {
                            fontFamily: 'Calibri',
                            fontSize: '11pt',
                            textColor: 'rgb(0, 0, 0)',
                            id: 'image_0',
                            maxWidth: '1800px',
                        },
                        dataset: {},
                    },
                ],
                format: {},
                segmentFormat: {
                    fontFamily: 'Calibri',
                    fontSize: '11pt',
                    textColor: 'rgb(0, 0, 0)',
                },
            },
        });
    });

    it('editing image - no id - no editing image | by Id', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Image',
                            src: 'test',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: 'rgb(0, 0, 0)',
                                maxWidth: '1800px',
                            },
                            dataset: {},
                        },
                    ],
                    format: {},
                    segmentFormat: {
                        fontFamily: 'Calibri',
                        fontSize: '11pt',
                        textColor: 'rgb(0, 0, 0)',
                    },
                },
            ],
            format: {
                fontFamily: 'Calibri',
                fontSize: '11pt',
                textColor: '#000000',
            },
        };

        const image = findEditingImage(model);
        expect(image).toEqual(null);
    });

    it('editing image - no id - editing image', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Image',
                            src: 'test',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: 'rgb(0, 0, 0)',
                                maxWidth: '1800px',
                            },
                            dataset: {},
                        },
                    ],
                    format: {},
                    segmentFormat: {
                        fontFamily: 'Calibri',
                        fontSize: '11pt',
                        textColor: 'rgb(0, 0, 0)',
                    },
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'second line',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                    ],
                    format: {},
                    segmentFormat: {
                        fontFamily: 'Calibri',
                        fontSize: '11pt',
                        textColor: 'rgb(0, 0, 0)',
                    },
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Image',
                            src: 'second-Image',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: 'rgb(0, 0, 0)',
                                maxWidth: '1800px',
                            },
                            dataset: {
                                isEditing: 'true',
                            },
                        },
                    ],
                    format: {},
                    segmentFormat: {
                        fontFamily: 'Calibri',
                        fontSize: '11pt',
                        textColor: 'rgb(0, 0, 0)',
                    },
                },
            ],
            format: {
                fontFamily: 'Calibri',
                fontSize: '11pt',
                textColor: '#000000',
            },
        };

        const image = findEditingImage(model);
        expect(image).toEqual({
            image: {
                segmentType: 'Image',
                src: 'second-Image',
                format: {
                    fontFamily: 'Calibri',
                    fontSize: '11pt',
                    textColor: 'rgb(0, 0, 0)',
                    maxWidth: '1800px',
                },
                dataset: {
                    isEditing: 'true',
                },
            },
            paragraph: {
                blockType: 'Paragraph',
                segments: [
                    {
                        segmentType: 'Image',
                        src: 'second-Image',
                        format: {
                            fontFamily: 'Calibri',
                            fontSize: '11pt',
                            textColor: 'rgb(0, 0, 0)',
                            maxWidth: '1800px',
                        },
                        dataset: {
                            isEditing: 'true',
                        },
                    },
                ],
                format: {},
                segmentFormat: {
                    fontFamily: 'Calibri',
                    fontSize: '11pt',
                    textColor: 'rgb(0, 0, 0)',
                },
            },
        });
    });

    it('editing image - with id - editing image', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Image',
                            src: 'test',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: 'rgb(0, 0, 0)',
                                maxWidth: '1800px',
                                id: 'testId',
                            },
                            dataset: {},
                        },
                    ],
                    format: {},
                    segmentFormat: {
                        fontFamily: 'Calibri',
                        fontSize: '11pt',
                        textColor: 'rgb(0, 0, 0)',
                    },
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'second line',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: 'rgb(0, 0, 0)',
                            },
                        },
                    ],
                    format: {},
                    segmentFormat: {
                        fontFamily: 'Calibri',
                        fontSize: '11pt',
                        textColor: 'rgb(0, 0, 0)',
                    },
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Image',
                            src: 'second-Image',
                            format: {
                                fontFamily: 'Calibri',
                                fontSize: '11pt',
                                textColor: 'rgb(0, 0, 0)',
                                maxWidth: '1800px',
                            },
                            dataset: {
                                isEditing: 'true',
                            },
                        },
                    ],
                    format: {},
                    segmentFormat: {
                        fontFamily: 'Calibri',
                        fontSize: '11pt',
                        textColor: 'rgb(0, 0, 0)',
                    },
                },
            ],
            format: {
                fontFamily: 'Calibri',
                fontSize: '11pt',
                textColor: '#000000',
            },
        };

        const image = findEditingImage(model, 'testId');
        expect(image).toEqual({
            image: {
                segmentType: 'Image',
                src: 'test',
                format: {
                    fontFamily: 'Calibri',
                    fontSize: '11pt',
                    textColor: 'rgb(0, 0, 0)',
                    maxWidth: '1800px',
                    id: 'testId',
                },
                dataset: {},
            },
            paragraph: {
                blockType: 'Paragraph',
                segments: [
                    {
                        segmentType: 'Image',
                        src: 'test',
                        format: {
                            fontFamily: 'Calibri',
                            fontSize: '11pt',
                            textColor: 'rgb(0, 0, 0)',
                            maxWidth: '1800px',
                            id: 'testId',
                        },
                        dataset: {},
                    },
                ],
                format: {},
                segmentFormat: {
                    fontFamily: 'Calibri',
                    fontSize: '11pt',
                    textColor: 'rgb(0, 0, 0)',
                },
            },
        });
    });
});
