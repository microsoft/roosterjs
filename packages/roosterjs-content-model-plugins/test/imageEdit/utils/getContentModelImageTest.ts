import { ContentModelDocument, IEditor } from 'roosterjs-content-model-types';
import { getContentModelImage } from '../../../lib/imageEdit/utils/getContentModelImage';

describe('getContentModelImage', () => {
    const createEditor = (model: ContentModelDocument) => {
        return <IEditor>{
            getContentModelCopy: (mode: 'clean' | 'disconnected') => model,
        };
    };

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
        const editor = createEditor(model);
        const result = getContentModelImage(editor);
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
        const editor = createEditor(model);
        const result = getContentModelImage(editor);
        expect(result).toEqual(null);
    });
});
