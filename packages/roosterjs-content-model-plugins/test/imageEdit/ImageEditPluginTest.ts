import * as findImage from '../../lib/imageEdit/utils/findEditingImage';
import * as getSelectedImage from '../../lib/imageEdit/utils/getSelectedImage';
import { ChangeSource, createImage, createParagraph } from 'roosterjs-content-model-dom';
import { contains } from 'roosterjs-editor-dom';
import { getSelectedImageMetadata } from '../../lib/imageEdit/utils/updateImageEditInfo';
import { ImageEditPlugin } from '../../lib/imageEdit/ImageEditPlugin';
import { initEditor } from '../TestHelper';
import {
    ContentModelDocument,
    ContentModelFormatter,
    EditorEnvironment,
    FormatContentModelOptions,
    IEditor,
} from 'roosterjs-content-model-types';

const model: ContentModelDocument = {
    blockGroupType: 'Document',
    blocks: [
        {
            segments: [
                {
                    isSelected: true,
                    segmentType: 'SelectionMarker',
                    format: {
                        fontFamily: 'Calibri',
                        fontSize: '11pt',
                        textColor: 'rgb(0, 0, 0)',
                    },
                },
                {
                    src:
                        'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAsJCQcJCQcJCQkJCwkJCQkJCQsJCwsMCwsLDA0QDB...',
                    isSelectedAsImageSelection: true,
                    segmentType: 'Image',
                    isSelected: true,
                    format: {
                        fontFamily: 'Calibri',
                        fontSize: '11pt',
                        textColor: 'rgb(0, 0, 0)',
                        id: 'image_0',
                        maxWidth: '1123px',
                    },
                    dataset: {
                        isEditing: 'true',
                    },
                },
            ],
            segmentFormat: {
                fontFamily: 'Calibri',
                fontSize: '11pt',
                textColor: 'rgb(0, 0, 0)',
            },
            blockType: 'Paragraph',
            format: {},
        },
    ],
    format: {
        fontFamily: 'Calibri',
        fontSize: '11pt',
        textColor: '#000000',
    },
};

describe('ImageEditPlugin', () => {
    let editor: IEditor;
    let mockedEnvironment: EditorEnvironment;
    let attachDomEventSpy: jasmine.Spy;
    let getDOMSelectionSpy: jasmine.Spy;
    let formatContentModelSpy: jasmine.Spy;
    let focusSpy: jasmine.Spy;
    let isDarkModeSpy: jasmine.Spy;
    let setAttributeSpy: jasmine.Spy;
    let appendChildSpy: jasmine.Spy;
    let getDOMHelperSpy: jasmine.Spy;
    let calculateZoomScaleSpy: jasmine.Spy;
    let setEditorStyleSpy: jasmine.Spy;
    let triggerEventSpy: jasmine.Spy;
    let getAttributeSpy: jasmine.Spy;
    beforeEach(() => {
        attachDomEventSpy = jasmine.createSpy('attachDomEvent');
        getDOMSelectionSpy = jasmine.createSpy('getDOMSelection');
        mockedEnvironment = {
            isSafari: false,
        } as any;
        getAttributeSpy = jasmine.createSpy('getAttribute');
        const image = createImage('');
        const editImage = createImage('test image');
        image.dataset = {
            isEditing: 'true',
        };
        const paragraph = createParagraph();
        paragraph.segments.push(image);
        paragraph.segments.push(editImage);
        spyOn(findImage, 'findEditingImage').and.returnValue({
            image,
            paragraph,
        });
        spyOn(getSelectedImage, 'getSelectedImage').and.returnValue({
            image: editImage,
            paragraph,
        });
        formatContentModelSpy = jasmine
            .createSpy('formatContentModel')
            .and.callFake(
                (callback: ContentModelFormatter, _options: FormatContentModelOptions) => {
                    callback(model, {
                        newEntities: [],
                        deletedEntities: [],
                        newImages: [],
                    });
                }
            );
        focusSpy = jasmine.createSpy('focus');
        isDarkModeSpy = jasmine.createSpy('isDarkMode');
        setAttributeSpy = jasmine.createSpy('setAttribute');
        appendChildSpy = jasmine.createSpy('appendChild');
        calculateZoomScaleSpy = jasmine.createSpy('calculateZoomScale');
        getDOMHelperSpy = jasmine.createSpy('getDOMHelper').and.returnValue({
            calculateZoomScale: calculateZoomScaleSpy,
        });
        setEditorStyleSpy = jasmine.createSpy('setEditorStyle');
        triggerEventSpy = jasmine.createSpy('triggerEvent').and.returnValue({
            newSrc: '',
        });
        editor = {
            getEnvironment: () => mockedEnvironment,
            attachDomEvent: attachDomEventSpy,
            getDOMSelection: getDOMSelectionSpy,
            formatContentModel: formatContentModelSpy,
            focus: focusSpy,
            isDarkMode: isDarkModeSpy,
            getDOMHelper: getDOMHelperSpy,
            getDocument: () => ({
                createElement: () => ({
                    setAttribute: setAttributeSpy,
                    appendChild: appendChildSpy,
                    style: {
                        display: '',
                    },

                    attachShadow: () => ({
                        appendChild: appendChildSpy,
                    }),
                }),
            }),
            setEditorStyle: setEditorStyleSpy,
            triggerEvent: triggerEventSpy,
        } as any;
    });

    it('keyDown', () => {
        const mockedImage = {
            getAttribute: getAttributeSpy,
        };
        const plugin = new ImageEditPlugin();
        plugin.initialize(editor);
        getDOMSelectionSpy.and.returnValue({
            type: 'image',
            image: mockedImage,
        });
        const image = createImage('');
        const paragraph = createParagraph();
        paragraph.segments.push(image);
        plugin.onPluginEvent({
            eventType: 'mouseUp',

            rawEvent: {
                button: 0,
                target: mockedImage,
            } as any,
        });
        plugin.onPluginEvent({
            eventType: 'keyDown',
            rawEvent: {
                key: 'k',
                target: mockedImage,
            } as any,
        });
        expect(formatContentModelSpy).toHaveBeenCalled();
        expect(formatContentModelSpy).toHaveBeenCalledTimes(2);
        plugin.dispose();
    });

    it('mouseUp', () => {
        const mockedImage = {
            getAttribute: getAttributeSpy,
        };
        const plugin = new ImageEditPlugin();
        plugin.initialize(editor);
        getDOMSelectionSpy.and.returnValue({
            type: 'image',
            image: mockedImage,
        });
        plugin.onPluginEvent({
            eventType: 'mouseUp',

            rawEvent: {
                button: 0,
                target: mockedImage,
            } as any,
        });
        expect(formatContentModelSpy).toHaveBeenCalled();
        plugin.dispose();
    });

    it('mouseUp - left click - remove selection', () => {
        const mockedImage = {
            getAttribute: getAttributeSpy,
        };
        const plugin = new ImageEditPlugin();
        plugin.initialize(editor);
        getDOMSelectionSpy.and.returnValue({
            type: 'image',
            image: mockedImage,
        });
        plugin.onPluginEvent({
            eventType: 'mouseUp',

            rawEvent: {
                button: 0,
            } as any,
        });
        expect(formatContentModelSpy).toHaveBeenCalled();
        plugin.dispose();
    });

    it('mouseUp - right click - remove wrapper', () => {
        const mockedImage = {
            getAttribute: getAttributeSpy,
        };
        const plugin = new ImageEditPlugin();
        plugin.initialize(editor);
        getDOMSelectionSpy.and.returnValue({
            type: 'image',
            image: mockedImage,
        });
        plugin.onPluginEvent({
            eventType: 'mouseUp',

            rawEvent: {
                button: 0,
                target: {
                    tagName: 'IMG',
                } as any,
            } as any,
        });
        plugin.onPluginEvent({
            eventType: 'mouseUp',

            rawEvent: {
                button: 2,
                target: {
                    tagName: 'IMG',
                    nodeType: 1,
                } as any,
            } as any,
        });
        expect(formatContentModelSpy).toHaveBeenCalled();
        expect(formatContentModelSpy).toHaveBeenCalledTimes(2);
        plugin.dispose();
    });

    it('cropImage', () => {
        const plugin = new ImageEditPlugin();
        const mockedImage = {
            getAttribute: getAttributeSpy,
        };
        plugin.initialize(editor);
        getDOMSelectionSpy.and.returnValue({
            type: 'image',
            image: mockedImage,
        });
        plugin.cropImage();
        expect(formatContentModelSpy).toHaveBeenCalled();
        plugin.dispose();
    });

    it('flip', () => {
        const plugin = new ImageEditPlugin();
        const image = new Image();
        image.src = 'test';
        getDOMSelectionSpy.and.returnValue({
            type: 'image',
            image: image,
        });
        plugin.initialize(editor);
        plugin.flipImage('horizontal');
        expect(formatContentModelSpy).toHaveBeenCalled();
        const dataset = getSelectedImageMetadata(editor, image);
        expect(dataset).toBeTruthy();
        plugin.dispose();
    });

    it('rotate', () => {
        const plugin = new ImageEditPlugin();
        const image = new Image();
        image.src = 'test';
        getDOMSelectionSpy.and.returnValue({
            type: 'image',
            image: image,
        });
        plugin.initialize(editor);
        plugin.rotateImage(Math.PI / 2);
        const dataset = getSelectedImageMetadata(editor, image);
        expect(formatContentModelSpy).toHaveBeenCalled();
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

    it('mouseDown on edit image', () => {
        const mockedImage = {
            getAttribute: getAttributeSpy,
        };
        const plugin = new ImageEditPlugin();
        plugin.initialize(editor);
        getDOMSelectionSpy.and.returnValue({
            type: 'image',
            image: mockedImage,
        });
        plugin.onPluginEvent({
            eventType: 'mouseUp',
            rawEvent: {
                button: 0,
                target: new Image(),
            } as any,
        });
        getDOMSelectionSpy.and.returnValue({
            type: 'image',
            image: mockedImage,
        });
        plugin.onPluginEvent({
            eventType: 'mouseDown',
            rawEvent: {
                button: 0,
                target: new Image(),
            } as any,
        });
        expect(formatContentModelSpy).toHaveBeenCalled();
        expect(formatContentModelSpy).toHaveBeenCalledTimes(2);
        plugin.dispose();
    });

    it('mouseDown on non edit image', () => {
        const mockedImage = {
            getAttribute: getAttributeSpy,
        };
        const plugin = new ImageEditPlugin();
        plugin.initialize(editor);
        getDOMSelectionSpy.and.returnValue({
            type: 'image',
            image: mockedImage,
        });
        plugin.onPluginEvent({
            eventType: 'mouseDown',
            rawEvent: {
                button: 0,
                target: new Image(),
            } as any,
        });
        expect(formatContentModelSpy).not.toHaveBeenCalled();
        plugin.dispose();
    });

    it('mouseDown on text', () => {
        const mockedImage = {
            getAttribute: getAttributeSpy,
        };
        const plugin = new ImageEditPlugin();
        plugin.initialize(editor);
        getDOMSelectionSpy.and.returnValue({
            type: 'image',
            image: mockedImage,
        });
        plugin.onPluginEvent({
            eventType: 'mouseUp',
            rawEvent: {
                button: 0,
                target: new Image(),
            } as any,
        });
        getDOMSelectionSpy.and.returnValue({
            type: 'range',
            range: {} as any,
        });
        plugin.onPluginEvent({
            eventType: 'mouseDown',
            rawEvent: {
                button: 0,
                target: new Text(),
            } as any,
        });
        expect(formatContentModelSpy).toHaveBeenCalled();
        expect(formatContentModelSpy).toHaveBeenCalledTimes(2);
        plugin.dispose();
    });

    it('mouseDown  on same line', () => {
        const target = {
            contains: () => true,
        };
        const mockedImage = {
            getAttribute: getAttributeSpy,
        };
        const plugin = new ImageEditPlugin();
        plugin.initialize(editor);
        getDOMSelectionSpy.and.returnValue({
            type: 'image',
            image: mockedImage,
        });
        plugin.onPluginEvent({
            eventType: 'mouseUp',
            rawEvent: {
                button: 0,
                target: new Image(),
            } as any,
        });
        getDOMSelectionSpy.and.returnValue({
            type: 'range',
            range: {} as any,
        });
        plugin.onPluginEvent({
            eventType: 'mouseDown',
            rawEvent: {
                button: 0,
                target: target,
            } as any,
        });
        expect(formatContentModelSpy).toHaveBeenCalled();
        expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
        plugin.dispose();
    });

    it('dragImage', () => {
        const mockedImage = {
            id: 'image_0',
            getAttribute: getAttributeSpy,
        } as any;
        const plugin = new ImageEditPlugin();
        plugin.initialize(editor);
        const draggedImage = mockedImage as HTMLImageElement;
        getDOMSelectionSpy.and.returnValue({
            type: 'image',
            image: draggedImage,
        });
        plugin.onPluginEvent({
            eventType: 'mouseUp',
            rawEvent: {
                button: 0,
                target: new Image(),
            } as any,
        });
        plugin.onPluginEvent({
            eventType: 'mouseDown',
            rawEvent: {
                button: 0,
                target: new Image(),
            } as any,
        });
        getDOMSelectionSpy.and.returnValue({
            type: 'image',
            image: {
                id: 'image_0_dragging',
            } as any,
        });
        plugin.onPluginEvent({
            eventType: 'contentChanged',
            source: ChangeSource.Drop,
        });
        expect(formatContentModelSpy).toHaveBeenCalled();
        expect(formatContentModelSpy).toHaveBeenCalledTimes(3);
        plugin.dispose();
    });

    it('flip setEditorStyle', () => {
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
        spyOn(editor, 'setEditorStyle').and.callThrough();

        plugin.initialize(editor);
        plugin.flipImage('horizontal');
        plugin.dispose();

        expect(editor.setEditorStyle).toHaveBeenCalledWith(
            'imageEdit',
            'outline-style:none!important;',
            ['span:has(>img#image_0)']
        );
        expect(editor.setEditorStyle).toHaveBeenCalledWith(
            'imageEditCaretColor',
            'caret-color: transparent;'
        );
        expect(editor.setEditorStyle).toHaveBeenCalledWith('imageEdit', null);
        expect(editor.setEditorStyle).toHaveBeenCalledWith('imageEditCaretColor', null);
    });
});
