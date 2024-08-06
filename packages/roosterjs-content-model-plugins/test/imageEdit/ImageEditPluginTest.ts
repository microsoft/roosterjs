import { ContentModelDocument } from 'roosterjs-content-model-types';
import { getSelectedImageMetadata } from '../../lib/imageEdit/utils/updateImageEditInfo';
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
    it('keyDown', () => {
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
        const plugin = new ImageEditPlugin();
        const editor = initEditor('image_edit', [plugin], model);
        plugin.initialize(editor);
        plugin.onPluginEvent({
            eventType: 'mouseUp',
            isClicking: true,
            rawEvent: {
                button: 0,
            } as any,
        });
        plugin.onPluginEvent({
            eventType: 'keyDown',
            rawEvent: {
                key: 'k',
            } as any,
        });
        expect(plugin.isEditingImage).toBeFalsy();
        plugin.dispose();
    });

    it('mouseUp', () => {
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
        const plugin = new ImageEditPlugin();
        const editor = initEditor('image_edit', [plugin], model);
        plugin.initialize(editor);
        plugin.onPluginEvent({
            eventType: 'mouseUp',
            isClicking: true,
            rawEvent: {
                button: 0,
            } as any,
        });

        expect(plugin.isEditingImage).toBeTruthy();
        plugin.dispose();
    });

    it('mouseUp - left click - remove selection', () => {
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
        const plugin = new ImageEditPlugin();
        const editor = initEditor('image_edit', [plugin], model);
        plugin.initialize(editor);
        plugin.onPluginEvent({
            eventType: 'mouseUp',
            isClicking: true,
            rawEvent: {
                button: 0,
            } as any,
        });
        expect(plugin.isEditingImage).toBeFalsy();
        plugin.dispose();
    });

    it('mouseUp - right click - remove wrapper', () => {
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
        const plugin = new ImageEditPlugin();
        const editor = initEditor('image_edit', [plugin], model);
        plugin.initialize(editor);
        plugin.onPluginEvent({
            eventType: 'mouseUp',
            isClicking: true,
            rawEvent: {
                button: 0,
                target: {
                    tagName: 'IMG',
                } as any,
            } as any,
        });
        plugin.onPluginEvent({
            eventType: 'mouseUp',
            isClicking: true,
            rawEvent: {
                button: 2,
                target: {
                    tagName: 'IMG',
                    nodeType: 1,
                } as any,
            } as any,
        });

        expect(plugin.isEditingImage).toBeFalsy();
        plugin.dispose();
    });

    it('cropImage', () => {
        const plugin = new ImageEditPlugin();
        const editor = initEditor('image_edit', [plugin], model);
        plugin.initialize(editor);
        plugin.cropImage();
        expect(plugin.isEditingImage).toBeTruthy();
        plugin.dispose();
    });

    it('flip', () => {
        const plugin = new ImageEditPlugin();
        const editor = initEditor('image_edit', [plugin], model);
        const image = new Image();
        image.src = 'test';
        plugin.initialize(editor);
        plugin.flipImage('horizontal');
        const dataset = getSelectedImageMetadata(editor, image);
        expect(dataset).toBeTruthy();
        plugin.dispose();
    });

    it('rotate', () => {
        const plugin = new ImageEditPlugin();
        const editor = initEditor('image_edit', [plugin], model);
        const image = new Image();
        image.src = 'test';
        plugin.initialize(editor);
        plugin.rotateImage(Math.PI / 2);
        const dataset = getSelectedImageMetadata(editor, image);
        expect(dataset).toBeTruthy();
        plugin.dispose();
    });

    it('flip with unsupportedId', () => {
        const modelWithUnsupportedId: ContentModelDocument = {
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
                                id: '0',
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
        const plugin = new ImageEditPlugin();
        const editor = initEditor('image_edit', [plugin], modelWithUnsupportedId);
        spyOn(editor, 'setEditorStyle').and.callThrough();

        plugin.initialize(editor);
        plugin.flipImage('horizontal');
        plugin.dispose();

        expect(editor.setEditorStyle).toHaveBeenCalledWith(
            'imageEdit',
            'outline-style:none!important;',
            ['span:has(>img[id="0"])']
        );
    });
});
