import { ContentModelDocument } from 'roosterjs-content-model-types';
import { getContentModelImage } from '../../lib/imageEdit/utils/getContentModelImage';
import { ImageEditPlugin } from '../../lib/imageEdit/ImageEditPlugin';
import { initEditor } from '../TestHelper';

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

describe('ImageEditPlugin', () => {
    const plugin = new ImageEditPlugin();
    const editor = initEditor('image_edit', [plugin], model);

    it('flip', () => {
        plugin.initialize(editor);
        plugin.flipImage('horizontal');
        const imageModel = getContentModelImage(editor);
        expect(imageModel!.dataset['editingInfo']).toBeTruthy();
        plugin.dispose();
    });

    it('rotate', () => {
        plugin.initialize(editor);
        plugin.rotateImage(Math.PI / 2);
        const imageModel = getContentModelImage(editor);
        expect(imageModel!.dataset['editingInfo']).toBeTruthy();
        plugin.dispose();
    });
});
