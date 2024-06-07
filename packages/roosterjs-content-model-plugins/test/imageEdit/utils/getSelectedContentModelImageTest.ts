import { ContentModelDocument } from 'roosterjs-content-model-types';
import { getSelectedContentModelImage } from '../../../lib/imageEdit/utils/getSelectedContentModelImage';

describe('getSelectedContentModelImage', () => {
    it('should return image model', () => {
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
        const result = getSelectedContentModelImage(model);
        expect(result).toEqual({
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
        });
    });

    it('should not return image model', () => {
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
                            isSelectedAsImageSelection: false,
                            isSelected: false,
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
        const result = getSelectedContentModelImage(model);
        expect(result).toEqual(null);
    });
});
