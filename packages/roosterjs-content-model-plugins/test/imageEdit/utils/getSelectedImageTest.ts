import { ContentModelDocument } from 'roosterjs-content-model-types';
import { getSelectedImage } from '../../../lib/imageEdit/utils/getSelectedImage';

describe('getSelectedImage', () => {
    it('get selected image', () => {
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
                            isSelectedAsImageSelection: true,
                            isSelected: true,
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

        const selections = getSelectedImage(model);
        expect(selections).toEqual({
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
                isSelectedAsImageSelection: true,
                isSelected: true,
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
                        isSelectedAsImageSelection: true,
                        isSelected: true,
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

    it('no image selected', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            format: {},
                            text: 'test',
                        },
                        {
                            segmentType: 'SelectionMarker',
                            format: {},
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

        const selections = getSelectedImage(model);
        expect(selections).toEqual(null);
    });
});
