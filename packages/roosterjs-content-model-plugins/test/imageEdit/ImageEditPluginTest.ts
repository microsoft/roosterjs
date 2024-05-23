import * as formatInsertPointWithContentModel from 'roosterjs-content-model-api/lib/publicApi/utils/formatInsertPointWithContentModel';
import { ContentModelDocument, SelectionChangedEvent } from 'roosterjs-content-model-types';
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

    it('start editing', () => {
        spyOn(editor, 'getContentModelCopy').and.returnValue(model);
        plugin.initialize(editor);
        const image = document.createElement('img');
        const imageSpan = document.createElement('span');
        imageSpan.appendChild(image);
        document.body.appendChild(imageSpan);
        const selection: SelectionChangedEvent = {
            eventType: 'selectionChanged',
            newSelection: {
                type: 'image',
                image: image,
            },
        };
        plugin.onPluginEvent(selection);
        const wrapper = plugin.getWrapper();
        expect(wrapper).toBeTruthy();
        plugin.dispose();
    });

    it('remove wrapper | content changed', () => {
        spyOn(editor, 'getContentModelCopy').and.returnValue(model);
        plugin.initialize(editor);
        const image = document.createElement('img');
        const imageSpan = document.createElement('span');
        imageSpan.appendChild(image);
        document.body.appendChild(imageSpan);
        const selection: SelectionChangedEvent = {
            eventType: 'selectionChanged',
            newSelection: {
                type: 'image',
                image: image,
            },
        };
        plugin.onPluginEvent(selection);
        plugin.onPluginEvent({
            eventType: 'contentChanged',
            data: {},
            source: '',
        });
        const wrapper = plugin.getWrapper();
        expect(wrapper).toBeFalsy();
        plugin.dispose();
    });

    it('remove wrapper | key down', () => {
        spyOn(editor, 'getContentModelCopy').and.returnValue(model);
        plugin.initialize(editor);
        const image = document.createElement('img');
        const imageSpan = document.createElement('span');
        imageSpan.appendChild(image);
        document.body.appendChild(imageSpan);
        const selection: SelectionChangedEvent = {
            eventType: 'selectionChanged',
            newSelection: {
                type: 'image',
                image: image,
            },
        };
        plugin.onPluginEvent(selection);
        plugin.onPluginEvent({
            eventType: 'keyDown',
            rawEvent: {} as any,
        });
        const wrapper = plugin.getWrapper();
        expect(wrapper).toBeFalsy();
        plugin.dispose();
    });

    it('remove wrapper | mouse down', () => {
        plugin.initialize(editor);
        const formatInsertPointWithContentModelSpy = spyOn(
            formatInsertPointWithContentModel,
            'formatInsertPointWithContentModel'
        );
        spyOn(editor, 'getDOMSelection').and.returnValue({
            type: 'range',
            range: {
                startContainer: {} as any,
                endOffset: 1,
            } as any,
            isReverted: false,
        });
        const image = document.createElement('img');
        image.src = 'test';
        const imageSpan = document.createElement('span');
        imageSpan.appendChild(image);
        document.body.appendChild(imageSpan);
        const selection: SelectionChangedEvent = {
            eventType: 'selectionChanged',
            newSelection: {
                type: 'image',
                image: image,
            },
        };
        plugin.onPluginEvent(selection);
        plugin.onPluginEvent({
            eventType: 'mouseDown',
            rawEvent: {} as any,
        });
        const wrapper = plugin.getWrapper();
        expect(wrapper).toBeFalsy();
        expect(formatInsertPointWithContentModelSpy).toHaveBeenCalled();
        plugin.dispose();
    });

    it('crop', () => {
        plugin.initialize(editor);
        const image = document.createElement('img');
        image.src = 'test';
        const imageSpan = document.createElement('span');
        imageSpan.appendChild(image);
        document.body.appendChild(imageSpan);
        plugin.cropImage(editor, image);

        const wrapper = plugin.getWrapper();
        expect(wrapper).toBeTruthy();
        plugin.dispose();
    });

    it('flip', () => {
        plugin.initialize(editor);
        const image = document.createElement('img');
        image.src = 'test';
        const imageSpan = document.createElement('span');
        imageSpan.appendChild(image);
        document.body.appendChild(imageSpan);
        plugin.flipImage(editor, image, 'horizontal');
        const imageModel = getContentModelImage(editor);
        expect(imageModel!.dataset['editingInfo']).toBeTruthy;
        plugin.dispose();
    });

    it('rotate', () => {
        plugin.initialize(editor);
        const image = document.createElement('img');
        image.src = 'test';
        const imageSpan = document.createElement('span');
        imageSpan.appendChild(image);
        document.body.appendChild(imageSpan);
        plugin.rotateImage(editor, image, Math.PI / 2);
        const imageModel = getContentModelImage(editor);
        expect(imageModel!.dataset['editingInfo']).toBeTruthy;
        plugin.dispose();
    });
});
