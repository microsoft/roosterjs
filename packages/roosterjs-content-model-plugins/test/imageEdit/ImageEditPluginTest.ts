import * as applyChange from '../../lib/imageEdit/utils/applyChange';
import * as findImage from '../../lib/imageEdit/utils/findEditingImage';
import * as getSelectedImage from '../../lib/imageEdit/utils/getSelectedImage';
import * as normalizeImageSelection from '../../lib/imageEdit/utils/normalizeImageSelection';
import { ChangeSource, createImage, createParagraph } from 'roosterjs-content-model-dom';
import { getSelectedImageMetadata } from '../../lib/imageEdit/utils/updateImageEditInfo';
import { ImageEditPlugin } from '../../lib/imageEdit/ImageEditPlugin';
import { initEditor } from '../TestHelper';
import {
    ContentModelDocument,
    ContentModelFormatter,
    DOMEventRecord,
    DOMSelection,
    EditorEnvironment,
    FormatContentModelOptions,
    IEditor,
    ImageSelection,
} from 'roosterjs-content-model-types';

describe('ImageEditPlugin', () => {
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
    let editor: IEditor;
    let mockedEnvironment: EditorEnvironment;
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
    let domEvents: Record<string, DOMEventRecord> = {};

    beforeEach(() => {
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
            attachDomEvent: (eventMap: Record<string, DOMEventRecord>) => {
                domEvents = eventMap;
            },
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

    afterEach(() => {
        editor = null!;
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

    it('keyDown - DELETE', () => {
        const mockedImage = {
            getAttribute: getAttributeSpy,
        };
        const plugin = new ImageEditPlugin();
        plugin.initialize(editor);
        const cleanInfoSpy = spyOn(plugin, 'cleanInfo');
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
                key: 'Delete',
                target: mockedImage,
            } as any,
        });
        expect(cleanInfoSpy).toHaveBeenCalled();
        expect(cleanInfoSpy).toHaveBeenCalledTimes(1);
        expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
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
        expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
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

    it('dragImage only', () => {
        const plugin = new ImageEditPlugin();
        plugin.initialize(editor);
        const draggedImage = document.createElement('img');
        draggedImage.id = 'image_0';
        triggerEventSpy.and.callThrough();
        domEvents.dragstart?.beforeDispatch?.({
            target: draggedImage,
        } as any);
        expect(draggedImage.id).toBe('image_0_dragging');
        plugin.dispose();
    });

    it('dragImage at same place', () => {
        const plugin = new ImageEditPlugin();
        plugin.initialize(editor);
        const draggedImage = document.createElement('img');
        draggedImage.id = 'image_0';
        triggerEventSpy.and.callThrough();
        domEvents.dragstart?.beforeDispatch?.({
            target: draggedImage,
        } as any);
        domEvents.dragend?.beforeDispatch?.({
            target: draggedImage,
        } as any);
        expect(draggedImage.id).toBe('image_0');
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

    it('extractContentWithDom', () => {
        const plugin = new ImageEditPlugin();
        plugin.initialize(editor);
        const clonedRoot = document.createElement('div');
        const image = document.createElement('img');
        clonedRoot.appendChild(image);
        image.dataset['editingInfo'] = JSON.stringify({
            src: 'test',
        });
        image.dataset['isEditing'] = 'true';
        const event = {
            eventType: 'extractContentWithDom',
            clonedRoot,
        } as any;
        plugin.onPluginEvent(event);
        const expectedClonedRoot = document.createElement('div');
        const expectedImage = document.createElement('img');
        expectedClonedRoot.appendChild(expectedImage);
        expect(event.clonedRoot).toEqual(expectedClonedRoot);
        plugin.dispose();
    });

    it('contentChanged - should remove isEditing', () => {
        const plugin = new ImageEditPlugin();
        const editor = initEditor('image_edit', [plugin], model);
        plugin.initialize(editor);
        const image = document.createElement('img');
        image.dataset['isEditing'] = 'true';
        const selection = {
            type: 'image',
            image,
        } as DOMSelection;
        spyOn(editor, 'getDOMSelection').and.returnValue(selection);
        const event = {
            eventType: 'contentChanged',
            source: ChangeSource.SetContent,
        } as any;
        plugin.onPluginEvent(event);
        const newSelection = editor.getDOMSelection() as ImageSelection;
        expect(newSelection!.type).toBe('image');
        expect(newSelection!.image.dataset.isEditing).toBeUndefined();
        plugin.dispose();
    });

    it('contentChanged - should remove  editor caret style', () => {
        const plugin = new TestPlugin();
        plugin.initialize(editor);
        plugin.setIsEditing(true);
        const event = {
            eventType: 'contentChanged',
            source: ChangeSource.Format,
        } as any;
        plugin.onPluginEvent(event);
        expect(editor.setEditorStyle).toHaveBeenCalledWith('imageEditCaretColor', null);
        plugin.dispose();
    });

    it('contentChanged - should not remove  editor caret style', () => {
        const plugin = new TestPlugin();
        plugin.initialize(editor);
        plugin.setIsEditing(true);
        const event = {
            eventType: 'contentChanged',
            source: ChangeSource.Format,
            formatApiName: 'ImageEditEvent',
        } as any;
        plugin.onPluginEvent(event);
        expect(editor.setEditorStyle).not.toHaveBeenCalled();
        plugin.dispose();
    });
});

class TestPlugin extends ImageEditPlugin {
    public setIsEditing(isEditing: boolean) {
        this.isEditing = isEditing;
    }

    public setEditingInfo(image: HTMLImageElement) {
        this.imageEditInfo = {
            src: image.getAttribute('src') || '',
            widthPx: image.clientWidth,
            heightPx: image.clientHeight,
            naturalWidth: image.naturalWidth,
            naturalHeight: image.naturalHeight,
            leftPercent: 0,
            rightPercent: 0,
            topPercent: 0,
            bottomPercent: 0,
            angleRad: 0,
        };
    }

    public applyFormatWithContentModel(
        editor: IEditor,
        isCropMode: boolean,
        shouldSelectImage: boolean,
        isApiOperation?: boolean
    ) {
        super.applyFormatWithContentModel(editor, isCropMode, shouldSelectImage, isApiOperation);
    }
}

interface TestOptions {
    setImageStyle?: boolean;
    removeImageStyle?: boolean;
    shouldApplyChange?: boolean;
    shouldNormalizeSelection?: boolean;
    shouldCleanInfo?: boolean;
}

describe('ImageEditPlugin - applyFormatWithContentModel', () => {
    function runTest(
        model: ContentModelDocument,
        expectedModel: ContentModelDocument,
        isEditing: boolean,
        isCropMode: boolean,
        shouldSelectImage: boolean,
        isApiOperation: boolean,
        moreOptions: Partial<TestOptions> = {}
    ) {
        const plugin = new TestPlugin();
        let editor: IEditor | null = initEditor('image_edit', [plugin], model);
        const setEditorStyleSpy = spyOn(editor, 'setEditorStyle');
        setEditorStyleSpy.and.callThrough();
        const cleanInfoSpy = spyOn(plugin, 'cleanInfo').and.callThrough();
        const applyChangeSpy = spyOn(applyChange, 'applyChange');
        const normalizeImageSelectionSpy = spyOn(
            normalizeImageSelection,
            'normalizeImageSelection'
        );
        plugin.initialize(editor);
        const mockedImage = document.createElement('img');
        document.body.appendChild(mockedImage);
        mockedImage.src = 'test';
        plugin.setEditingInfo(mockedImage);
        plugin.startRotateAndResize(editor, mockedImage);
        plugin.setIsEditing(isEditing);
        plugin.applyFormatWithContentModel(editor, isCropMode, shouldSelectImage, isApiOperation);
        const newModel = editor.getContentModelCopy('disconnected');

        if (moreOptions.removeImageStyle !== undefined) {
            expect(setEditorStyleSpy).toHaveBeenCalledWith('imageEdit', null);
            expect(setEditorStyleSpy).toHaveBeenCalledWith('imageEditCaretColor', null);
        }

        if (moreOptions.setImageStyle !== undefined) {
            expect(setEditorStyleSpy).toHaveBeenCalledWith(
                'imageEdit',
                'outline-style:none!important;',
                [`span:has(>img)`]
            );
            expect(setEditorStyleSpy).toHaveBeenCalledWith(
                'imageEditCaretColor',
                'caret-color: transparent;'
            );
        }

        if (moreOptions.shouldApplyChange) {
            expect(applyChangeSpy).toHaveBeenCalled();
        } else {
            expect(applyChangeSpy).not.toHaveBeenCalled();
        }

        if (moreOptions.shouldNormalizeSelection) {
            expect(normalizeImageSelectionSpy).toHaveBeenCalled();
        } else {
            expect(normalizeImageSelectionSpy).not.toHaveBeenCalled();
        }
        if (moreOptions.shouldCleanInfo) {
            expect(cleanInfoSpy).toHaveBeenCalled();
        } else {
            expect(cleanInfoSpy).not.toHaveBeenCalled();
        }
        expect(newModel).toEqual(expectedModel);
        plugin.dispose();
        editor.dispose();
        editor = null;
        mockedImage.remove();
    }

    it('image to text', () => {
        const model1: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    segments: [
                        {
                            src: 'test',
                            segmentType: 'Image',
                            format: {},
                            dataset: {
                                isEditing: 'true',
                            },
                        },
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: {},
                        },
                        {
                            isSelected: true,
                            segmentType: 'SelectionMarker',
                            format: {},
                        },
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: {},
                        },
                    ],
                    segmentFormat: {},
                    blockType: 'Paragraph',
                    format: {},
                },
            ],
            format: {},
        };
        const expectedModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    segments: [
                        {
                            src: 'test',
                            segmentType: 'Image',
                            format: {},
                            dataset: {},
                            alt: undefined,
                            title: undefined,
                            isSelectedAsImageSelection: undefined,
                            isSelected: undefined,
                        },
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: {},
                            isSelected: undefined,
                        },
                        {
                            isSelected: true,
                            segmentType: 'SelectionMarker',
                            format: {},
                        },
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: {},
                            isSelected: undefined,
                        },
                    ],
                    segmentFormat: undefined,
                    blockType: 'Paragraph',
                    format: {},
                    cachedElement: undefined,
                    isImplicit: undefined,
                },
            ],

            format: {},
        };
        runTest(model1, expectedModel, true, false, false, false, {
            shouldApplyChange: true,
            shouldCleanInfo: true,
            removeImageStyle: true,
        });
    });

    it('text to image', () => {
        const testModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    segments: [
                        {
                            src: 'test',
                            segmentType: 'Image',
                            format: {},
                            dataset: {},
                            isSelectedAsImageSelection: true,
                            isSelected: true,
                        },
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: {},
                        },
                    ],
                    segmentFormat: {},
                    blockType: 'Paragraph',
                    format: {},
                },
            ],
            format: {},
        };
        const expectedModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    segments: [
                        {
                            src: 'test',
                            segmentType: 'Image',
                            format: {},
                            dataset: {
                                isEditing: 'true',
                            },
                            alt: undefined,
                            title: undefined,
                            isSelectedAsImageSelection: true,
                            isSelected: true,
                        },
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: {},
                            isSelected: undefined,
                        },
                    ],
                    segmentFormat: undefined,
                    blockType: 'Paragraph',
                    format: {},
                    cachedElement: undefined,
                    isImplicit: undefined,
                },
            ],

            format: {},
        };
        runTest(testModel, expectedModel, false, false, false, false, {
            shouldApplyChange: false,
            shouldCleanInfo: false,
            setImageStyle: true,
        });
    });

    it('image to image', () => {
        const testModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    segments: [
                        {
                            src: 'test',
                            segmentType: 'Image',
                            format: {},
                            dataset: {
                                isEditing: 'true',
                            },
                        },
                        {
                            src: 'test2',
                            segmentType: 'Image',
                            format: {},
                            dataset: {},
                            isSelectedAsImageSelection: true,
                            isSelected: true,
                        },
                    ],
                    segmentFormat: {},
                    blockType: 'Paragraph',
                    format: {},
                },
            ],
            format: {},
        };
        const expectedModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    segments: [
                        {
                            src: 'test',
                            segmentType: 'Image',
                            format: {},
                            dataset: {},
                            alt: undefined,
                            title: undefined,
                            isSelectedAsImageSelection: undefined,
                            isSelected: undefined,
                        },
                        {
                            src: 'test2',
                            segmentType: 'Image',
                            format: {},
                            dataset: {
                                isEditing: 'true',
                            },
                            isSelectedAsImageSelection: true,
                            isSelected: true,
                            alt: undefined,
                            title: undefined,
                        },
                    ],
                    segmentFormat: undefined,
                    blockType: 'Paragraph',
                    format: {},
                    cachedElement: undefined,
                    isImplicit: undefined,
                },
            ],

            format: {},
        };
        runTest(testModel, expectedModel, true, false, false, false, {
            shouldApplyChange: true,
            shouldCleanInfo: true,
            removeImageStyle: true,
            setImageStyle: true,
        });
    });

    it('image in a table to text', () => {
        const testModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    widths: [120],
                    rows: [
                        {
                            height: 22,
                            cells: [
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            segments: [
                                                {
                                                    src: 'test',
                                                    segmentType: 'Image',
                                                    format: {},
                                                    dataset: {
                                                        isEditing: 'true',
                                                    },
                                                },
                                            ],
                                            segmentFormat: undefined,
                                            blockType: 'Paragraph',
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    dataset: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    blockType: 'Table',
                    format: {
                        borderCollapse: true,
                        useBorderBox: true,
                    },
                    dataset: {},
                },
                {
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: {},
                        },
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                    ],
                    segmentFormat: undefined,
                    blockType: 'Paragraph',
                    format: {},
                },
            ],
            format: {},
        };
        const expectedModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    widths: [122],
                    rows: [
                        {
                            height: 24,
                            cells: [
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            segments: [
                                                {
                                                    src: 'test',
                                                    isSelectedAsImageSelection: undefined,
                                                    segmentType: 'Image',
                                                    isSelected: undefined,
                                                    format: {},
                                                    dataset: {},
                                                    alt: undefined,
                                                    title: undefined,
                                                },
                                            ],
                                            segmentFormat: undefined,
                                            blockType: 'Paragraph',
                                            format: {},
                                            cachedElement: undefined,
                                            isImplicit: undefined,
                                        },
                                    ],
                                    format: {
                                        width: '120px',
                                        height: '22px',
                                    },
                                    dataset: {},
                                    isSelected: undefined,
                                    cachedElement: undefined,
                                },
                            ],
                            format: {},
                            cachedElement: undefined,
                        },
                    ],
                    blockType: 'Table',
                    format: {
                        borderCollapse: true,
                        useBorderBox: true,
                    },
                    dataset: {},
                    cachedElement: undefined,
                },
                {
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: {},
                            isSelected: undefined,
                        },
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                    ],
                    segmentFormat: undefined,
                    blockType: 'Paragraph',
                    format: {},
                    cachedElement: undefined,
                    isImplicit: undefined,
                },
            ],
            format: {},
        };
        runTest(testModel, expectedModel, true, false, false, false, {
            shouldApplyChange: true,
            shouldCleanInfo: true,
            removeImageStyle: true,
        });
    });

    it('text to image in a table ', () => {
        const testModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    widths: [120],
                    rows: [
                        {
                            height: 22,
                            cells: [
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            segments: [
                                                {
                                                    src: 'test',
                                                    segmentType: 'Image',
                                                    format: {},
                                                    dataset: {},
                                                    isSelectedAsImageSelection: true,
                                                    isSelected: true,
                                                },
                                            ],
                                            segmentFormat: undefined,
                                            blockType: 'Paragraph',
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    dataset: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    blockType: 'Table',
                    format: {
                        borderCollapse: true,
                        useBorderBox: true,
                    },
                    dataset: {},
                },
                {
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: {},
                        },
                    ],
                    segmentFormat: undefined,
                    blockType: 'Paragraph',
                    format: {},
                },
            ],
            format: {},
        };
        const expectedModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    widths: [122],
                    rows: [
                        {
                            height: 24,
                            cells: [
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            segments: [
                                                {
                                                    src: 'test',
                                                    isSelectedAsImageSelection: true,
                                                    segmentType: 'Image',
                                                    isSelected: true,
                                                    format: {},
                                                    dataset: {
                                                        isEditing: 'true',
                                                    },
                                                    alt: undefined,
                                                    title: undefined,
                                                },
                                            ],
                                            segmentFormat: undefined,
                                            blockType: 'Paragraph',
                                            format: {},
                                            cachedElement: undefined,
                                            isImplicit: undefined,
                                        },
                                    ],
                                    format: {
                                        width: '120px',
                                        height: '22px',
                                    },
                                    dataset: {},
                                    isSelected: undefined,
                                    cachedElement: undefined,
                                },
                            ],
                            format: {},
                            cachedElement: undefined,
                        },
                    ],
                    blockType: 'Table',
                    format: {
                        borderCollapse: true,
                        useBorderBox: true,
                    },
                    dataset: {},
                    cachedElement: undefined,
                },
                {
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: {},
                            isSelected: undefined,
                        },
                    ],
                    segmentFormat: undefined,
                    blockType: 'Paragraph',
                    format: {},
                    cachedElement: undefined,
                    isImplicit: undefined,
                },
            ],
            format: {},
        };
        runTest(testModel, expectedModel, false, false, false, false, {
            shouldApplyChange: false,
            shouldCleanInfo: false,
            setImageStyle: true,
        });
    });

    it('image to image in a table ', () => {
        const testModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    widths: [120],
                    rows: [
                        {
                            height: 22,
                            cells: [
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            segments: [
                                                {
                                                    src: 'test',
                                                    segmentType: 'Image',
                                                    format: {},
                                                    dataset: {
                                                        isEditing: 'true',
                                                    },
                                                    isSelectedAsImageSelection: undefined,
                                                    isSelected: undefined,
                                                },
                                            ],
                                            segmentFormat: undefined,
                                            blockType: 'Paragraph',
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    dataset: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    blockType: 'Table',
                    format: {
                        borderCollapse: true,
                        useBorderBox: true,
                    },
                    dataset: {},
                },
                {
                    segments: [
                        {
                            src: 'test',
                            segmentType: 'Image',
                            format: {},
                            dataset: {},
                            isSelectedAsImageSelection: true,
                            isSelected: true,
                        },
                    ],
                    segmentFormat: undefined,
                    blockType: 'Paragraph',
                    format: {},
                },
            ],
            format: {},
        };
        const expectedModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    widths: [122],
                    rows: [
                        {
                            height: 24,
                            cells: [
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    isHeader: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            segments: [
                                                {
                                                    src: 'test',
                                                    isSelectedAsImageSelection: undefined,
                                                    segmentType: 'Image',
                                                    isSelected: undefined,
                                                    format: {},
                                                    dataset: {},
                                                    alt: undefined,
                                                    title: undefined,
                                                },
                                            ],
                                            segmentFormat: undefined,
                                            blockType: 'Paragraph',
                                            format: {},
                                            cachedElement: undefined,
                                            isImplicit: undefined,
                                        },
                                    ],
                                    format: {
                                        width: '120px',
                                        height: '22px',
                                    },
                                    dataset: {},
                                    isSelected: undefined,
                                    cachedElement: undefined,
                                },
                            ],
                            format: {},
                            cachedElement: undefined,
                        },
                    ],
                    blockType: 'Table',
                    format: {
                        borderCollapse: true,
                        useBorderBox: true,
                    },
                    dataset: {},
                    cachedElement: undefined,
                },
                {
                    segments: [
                        {
                            src: 'test',
                            segmentType: 'Image',
                            format: {},
                            dataset: {
                                isEditing: 'true',
                            },
                            isSelectedAsImageSelection: true,
                            isSelected: true,
                            alt: undefined,
                            title: undefined,
                        },
                    ],
                    segmentFormat: undefined,
                    blockType: 'Paragraph',
                    format: {},
                    cachedElement: undefined,
                    isImplicit: undefined,
                },
            ],
            format: {},
        };
        runTest(testModel, expectedModel, true, false, false, false, {
            shouldApplyChange: true,
            shouldCleanInfo: true,
            setImageStyle: true,
            removeImageStyle: true,
        });
    });

    it('image in a list to text', () => {
        const testModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    formatHolder: {
                        isSelected: false,
                        segmentType: 'SelectionMarker',
                        format: {},
                    },
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                startNumberOverride: 1,
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo:
                                    '{"applyListStyleFromLevel":false,"orderedStyleType":1}',
                            },
                        },
                    ],
                    blockType: 'BlockGroup',
                    format: {},
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            segments: [
                                {
                                    src: 'test',
                                    segmentType: 'Image',
                                    format: {},
                                    dataset: {
                                        isEditing: 'true',
                                    },
                                },
                            ],
                            segmentFormat: {},
                            blockType: 'Paragraph',
                            format: {},
                        },
                    ],
                },
                {
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: {},
                        },
                        {
                            isSelected: true,
                            segmentType: 'SelectionMarker',
                            format: {},
                        },
                    ],
                    segmentFormat: {},
                    blockType: 'Paragraph',
                    format: {},
                },
            ],
            format: {},
        };
        const expectedModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    formatHolder: {
                        isSelected: false,
                        segmentType: 'SelectionMarker',
                        format: {},
                    },
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                startNumberOverride: 1,
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo:
                                    '{"applyListStyleFromLevel":false,"orderedStyleType":1}',
                            },
                        },
                    ],
                    blockType: 'BlockGroup',
                    format: {},
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            segments: [
                                {
                                    src: 'test',
                                    segmentType: 'Image',
                                    format: {},
                                    dataset: {},
                                    isSelectedAsImageSelection: undefined,
                                    isSelected: undefined,
                                    alt: undefined,
                                    title: undefined,
                                },
                            ],
                            segmentFormat: undefined,
                            blockType: 'Paragraph',
                            format: {},
                            cachedElement: undefined,
                            isImplicit: undefined,
                        },
                    ],
                    cachedElement: undefined,
                },
                {
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: {},
                            isSelected: undefined,
                        },
                        {
                            isSelected: true,
                            segmentType: 'SelectionMarker',
                            format: {},
                        },
                    ],
                    segmentFormat: undefined,
                    blockType: 'Paragraph',
                    format: {},
                    cachedElement: undefined,
                    isImplicit: undefined,
                },
            ],
            format: {},
        };
        runTest(testModel, expectedModel, true, false, false, false, {
            shouldApplyChange: true,
            shouldCleanInfo: true,
            removeImageStyle: true,
        });
    });

    it('text to image in a list', () => {
        const testModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    formatHolder: {
                        isSelected: false,
                        segmentType: 'SelectionMarker',
                        format: {},
                    },
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                startNumberOverride: 1,
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo:
                                    '{"applyListStyleFromLevel":false,"orderedStyleType":1}',
                            },
                        },
                    ],
                    blockType: 'BlockGroup',
                    format: {},
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            segments: [
                                {
                                    src: 'test',
                                    segmentType: 'Image',
                                    format: {},
                                    dataset: {},
                                    isSelectedAsImageSelection: true,
                                    isSelected: true,
                                },
                            ],
                            segmentFormat: {},
                            blockType: 'Paragraph',
                            format: {},
                        },
                    ],
                },
                {
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: {},
                        },
                    ],
                    segmentFormat: {},
                    blockType: 'Paragraph',
                    format: {},
                },
            ],
            format: {},
        };
        const expectedModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    formatHolder: {
                        isSelected: false,
                        segmentType: 'SelectionMarker',
                        format: {},
                    },
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                startNumberOverride: 1,
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo:
                                    '{"applyListStyleFromLevel":false,"orderedStyleType":1}',
                            },
                        },
                    ],
                    blockType: 'BlockGroup',
                    format: {},
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            segments: [
                                {
                                    src: 'test',
                                    segmentType: 'Image',
                                    format: {},
                                    dataset: {
                                        isEditing: 'true',
                                    },
                                    isSelectedAsImageSelection: true,
                                    isSelected: true,
                                    alt: undefined,
                                    title: undefined,
                                },
                            ],
                            segmentFormat: undefined,
                            blockType: 'Paragraph',
                            format: {},
                            cachedElement: undefined,
                            isImplicit: undefined,
                        },
                    ],
                    cachedElement: undefined,
                },
                {
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: {},
                            isSelected: undefined,
                        },
                    ],
                    segmentFormat: undefined,
                    blockType: 'Paragraph',
                    format: {},
                    cachedElement: undefined,
                    isImplicit: undefined,
                },
            ],
            format: {},
        };
        runTest(testModel, expectedModel, false, false, false, false, {
            shouldApplyChange: false,
            shouldCleanInfo: false,
            setImageStyle: true,
        });
    });

    it('image in a list to image', () => {
        const testModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    formatHolder: {
                        isSelected: false,
                        segmentType: 'SelectionMarker',
                        format: {},
                    },
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                startNumberOverride: 1,
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo:
                                    '{"applyListStyleFromLevel":false,"orderedStyleType":1}',
                            },
                        },
                    ],
                    blockType: 'BlockGroup',
                    format: {},
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            segments: [
                                {
                                    src: 'test',
                                    segmentType: 'Image',
                                    format: {},
                                    dataset: {
                                        isEditing: 'true',
                                    },
                                    isSelectedAsImageSelection: undefined,
                                    isSelected: undefined,
                                },
                            ],
                            segmentFormat: {},
                            blockType: 'Paragraph',
                            format: {},
                        },
                    ],
                },
                {
                    segments: [
                        {
                            src: 'test',
                            segmentType: 'Image',
                            format: {},
                            dataset: {},
                            isSelectedAsImageSelection: true,
                            isSelected: true,
                        },
                    ],
                    segmentFormat: {},
                    blockType: 'Paragraph',
                    format: {},
                },
            ],
            format: {},
        };
        const expectedModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    formatHolder: {
                        isSelected: false,
                        segmentType: 'SelectionMarker',
                        format: {},
                    },
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                startNumberOverride: 1,
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo:
                                    '{"applyListStyleFromLevel":false,"orderedStyleType":1}',
                            },
                        },
                    ],
                    blockType: 'BlockGroup',
                    format: {},
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            segments: [
                                {
                                    src: 'test',
                                    segmentType: 'Image',
                                    format: {},
                                    dataset: {},
                                    isSelectedAsImageSelection: undefined,
                                    isSelected: undefined,
                                    alt: undefined,
                                    title: undefined,
                                },
                            ],
                            segmentFormat: undefined,
                            blockType: 'Paragraph',
                            format: {},
                            cachedElement: undefined,
                            isImplicit: undefined,
                        },
                    ],
                    cachedElement: undefined,
                },
                {
                    segments: [
                        {
                            src: 'test',
                            segmentType: 'Image',
                            format: {},
                            dataset: {
                                isEditing: 'true',
                            },
                            isSelectedAsImageSelection: true,
                            isSelected: true,
                            alt: undefined,
                            title: undefined,
                        },
                    ],
                    segmentFormat: undefined,
                    blockType: 'Paragraph',
                    format: {},
                    cachedElement: undefined,
                    isImplicit: undefined,
                },
            ],
            format: {},
        };
        runTest(testModel, expectedModel, true, false, false, false, {
            shouldApplyChange: true,
            shouldCleanInfo: true,
            setImageStyle: true,
            removeImageStyle: true,
        });
    });
});
