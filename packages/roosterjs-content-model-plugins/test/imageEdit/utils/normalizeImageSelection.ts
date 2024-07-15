import { ImageAndParagraph } from '../../../lib/imageEdit/types/ImageAndParagraph';
import { normalizeImageSelection } from '../../../lib/imageEdit/utils/normalizeImageSelection';
import type { ReadonlyContentModelImage } from 'roosterjs-content-model-types';

describe('normalizeImageSelection', () => {
    it('normalize image selection', () => {
        const image: ReadonlyContentModelImage = {
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
        };
        const imageAndParagraph: ImageAndParagraph = {
            paragraph: {
                blockType: 'Paragraph',
                segments: [
                    {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
                        format: {},
                    },
                    image,
                    {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
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
            image: image,
        };

        const result = normalizeImageSelection(imageAndParagraph);
        expect(result?.paragraph).toEqual({
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
        });
    });

    it('normalize image selection', () => {
        const imageAndParagraph: ImageAndParagraph = {
            paragraph: {
                blockType: 'Paragraph',
                segments: [
                    {
                        segmentType: 'SelectionMarker',
                        format: {},
                    },
                    {
                        segmentType: 'Text',
                        text: 'test',
                        format: {},
                    },
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
                    {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
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
        };

        const result = normalizeImageSelection(imageAndParagraph);
        expect(result).toBeUndefined();
    });
});
