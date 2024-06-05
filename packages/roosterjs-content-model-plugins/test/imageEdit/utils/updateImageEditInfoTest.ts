import * as updateImageMetadata from 'roosterjs-content-model-dom/lib/modelApi/metadata/updateImageMetadata';
import { ContentModelDocument } from 'roosterjs-content-model-types';
import { createImage } from 'roosterjs-content-model-dom';
import { initEditor } from '../../TestHelper';
import {
    getSelectedImageMetadata,
    updateImageEditInfo,
} from '../../../lib/imageEdit/utils/updateImageEditInfo';

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
                        editingInfo: JSON.stringify({
                            src: 'test',
                        }),
                    },
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

describe('updateImageEditInfo', () => {
    it('update image edit info', () => {
        const updateImageMetadataSpy = spyOn(updateImageMetadata, 'updateImageMetadata');
        const contentModelImage = createImage('test');
        updateImageEditInfo(contentModelImage, {
            widthPx: 10,
            heightPx: 10,
        });
        expect(updateImageMetadataSpy).toHaveBeenCalled();
    });
});

describe('getSelectedImageMetadata', () => {
    it('get image edit info', () => {
        const editor = initEditor('updateImageEditInfo', [], model);
        const image = new Image(10, 10);
        const metadata = getSelectedImageMetadata(editor, image);
        const expected = {
            src: '',
            widthPx: 0,
            heightPx: 0,
            naturalWidth: 0,
            naturalHeight: 0,
            leftPercent: 0,
            rightPercent: 0,
            topPercent: 0,
            bottomPercent: 0,
            angleRad: 0,
            editingInfo: '{"src":"test"}',
        };
        expect(metadata).toEqual(expected);
    });
});
