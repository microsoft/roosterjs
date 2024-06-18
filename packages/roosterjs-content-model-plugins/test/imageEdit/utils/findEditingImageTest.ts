import { ContentModelDocument } from 'roosterjs-content-model-types';
import { EditableImageFormat } from '../../../lib/imageEdit/types/EditableImageFormat';
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
                                isEditing: true,
                            } as EditableImageFormat,
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
                    isEditing: true,
                } as EditableImageFormat,
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
                            isEditing: true,
                        } as EditableImageFormat,
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
