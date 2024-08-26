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
});
