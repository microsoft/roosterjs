import { getContentModelImage } from '../../lib/imageEdit/utils/getContentModelImage';
import { ImageEditPlugin } from '../../lib/imageEdit/ImageEditPlugin';
import { initEditor } from '../TestHelper';
//import * as formatInsertPointWithContentModel from 'roosterjs-content-model-api/lib/publicApi/utils/formatInsertPointWithContentModel';
import {
    ContentModelDocument,
    ImageSelection,
    SelectionChangedEvent,
} from 'roosterjs-content-model-types';

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
        const imageSelection = editor.getDOMSelection() as ImageSelection;
        const selection: SelectionChangedEvent = {
            eventType: 'selectionChanged',
            newSelection: imageSelection,
        };
        editor.setDOMSelection(imageSelection);
        plugin.onPluginEvent(selection);
        const wrapper = plugin.getWrapper();
        expect(wrapper).toBeTruthy();
        plugin.onPluginEvent({
            eventType: 'selectionChanged',
            newSelection: null,
        });
        plugin.dispose();
    });

    it('remove wrapper | content changed', () => {
        spyOn(editor, 'getContentModelCopy').and.returnValue(model);
        plugin.initialize(editor);
        const imageSelection = editor.getDOMSelection() as ImageSelection;
        const image = imageSelection.image;
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
        expect(wrapper).toBe(null);
        plugin.onPluginEvent({
            eventType: 'selectionChanged',
            newSelection: null,
        });
        plugin.dispose();
    });

    it('remove wrapper | key down', () => {
        spyOn(editor, 'getContentModelCopy').and.returnValue(model);
        plugin.initialize(editor);
        const imageSelection = editor.getDOMSelection() as ImageSelection;
        const image = imageSelection.image;
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
        plugin.onPluginEvent({
            eventType: 'selectionChanged',
            newSelection: null,
        });
        plugin.dispose();
    });

    it('crop', () => {
        spyOn(editor, 'getContentModelCopy').and.returnValue(model);
        plugin.initialize(editor);
        const selection = editor.getDOMSelection() as ImageSelection;
        const image = selection.image;
        editor.setDOMSelection(selection);
        plugin.cropImage(editor, image);
        const wrapper = plugin.getWrapper();
        expect(wrapper).toBeTruthy();
        plugin.onPluginEvent({
            eventType: 'selectionChanged',
            newSelection: null,
        });
        plugin.dispose();
    });

    it('flip', () => {
        plugin.initialize(editor);
        const selection = editor.getDOMSelection() as ImageSelection;
        const image = selection.image;
        plugin.flipImage(editor, image, 'horizontal');
        const imageModel = getContentModelImage(editor);
        expect(imageModel!.dataset['editingInfo']).toBeTruthy();
        plugin.onPluginEvent({
            eventType: 'selectionChanged',
            newSelection: null,
        });
        plugin.dispose();
    });

    it('rotate', () => {
        plugin.initialize(editor);
        const selection = editor.getDOMSelection() as ImageSelection;
        plugin.rotateImage(editor, selection.image, Math.PI / 2);
        const imageModel = getContentModelImage(editor);
        expect(imageModel!.dataset['editingInfo']).toBeTruthy();
        plugin.onPluginEvent({
            eventType: 'selectionChanged',
            newSelection: null,
        });
        plugin.dispose();
    });
});
