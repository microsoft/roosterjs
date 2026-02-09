import * as addRangeToSelection from '../../../lib/coreApi/setDOMSelection/addRangeToSelection';
import * as contentModelToDomFile from 'roosterjs-content-model-dom/lib/modelToDom/contentModelToDom';
import * as copyPasteEntityOverride from '../../../lib/override/pasteCopyBlockEntityParser';
import * as deleteSelectionsFile from 'roosterjs-content-model-dom/lib/modelApi/editing/deleteSelection';
import * as extractClipboardItemsFile from 'roosterjs-content-model-dom/lib/domUtils/event/extractClipboardItems';
import * as iterateSelectionsFile from 'roosterjs-content-model-dom/lib/modelApi/selection/iterateSelections';
import * as normalizeContentModel from 'roosterjs-content-model-dom/lib/modelApi/common/normalizeContentModel';
import * as paste from '../../../lib/command/paste/paste';
import { adjustSelectionForCopyCut } from '../../../lib/command/cutCopy/adjustSelectionForCopyCut';
import { createModelToDomContext, createTable, createTableCell } from 'roosterjs-content-model-dom';
import { createRange } from 'roosterjs-content-model-dom/test/testUtils';
import { onNodeCreated } from '../../../lib/command/cutCopy/getContentForCopy';
import { preprocessTable } from 'roosterjs-content-model-dom/lib/domUtils/selection/preprocessTable';
import { setEntityElementClasses } from 'roosterjs-content-model-dom/test/domUtils/entityUtilTest';
import {
    ContentModelDocument,
    DOMSelection,
    ContentModelFormatter,
    FormatContentModelOptions,
    IEditor,
    DOMEventRecord,
    ClipboardData,
    CopyPastePluginState,
    PluginWithState,
    DarkColorHandler,
    PasteTypeOrGetter,
} from 'roosterjs-content-model-types';
import {
    createCopyPastePlugin,
    shouldPreventDefaultPaste,
} from '../../../lib/corePlugin/copyPaste/CopyPastePlugin';

const modelValue = {
    blocks: [],
    name: 'model1',
} as any;
const pasteModelValue = {
    blocks: [],
    name: 'model2',
} as any;
const insertPointValue = 'insertPoint' as any;
const deleteResultValue = 'deleteResult' as any;

const allowedCustomPasteType = ['Test'];

describe('CopyPastePlugin.Ctor', () => {
    it('Ctor without options', () => {
        const plugin = createCopyPastePlugin({});
        const state = plugin.getState();

        expect(state).toEqual({
            allowedCustomPasteType: [],
            tempDiv: null,
            defaultPasteType: undefined,
        });
    });

    it('Ctor with options', () => {
        const plugin = createCopyPastePlugin({
            allowedCustomPasteType,
            defaultPasteType: 'mergeFormat',
        });
        const state = plugin.getState();

        expect(state).toEqual({
            allowedCustomPasteType: allowedCustomPasteType,
            tempDiv: null,
            defaultPasteType: 'mergeFormat',
        });
    });
});

describe('CopyPastePlugin |', () => {
    let editor: IEditor = null!;
    let plugin: PluginWithState<CopyPastePluginState>;
    let domEvents: Record<string, DOMEventRecord> = {};
    let div: HTMLDivElement;
    let mockedDocument: Document;

    let selectionValue: DOMSelection;
    let getDOMSelectionSpy: jasmine.Spy;
    let getContentModelCopySpy: jasmine.Spy;
    let triggerPluginEventSpy: jasmine.Spy;

    let formatContentModelSpy: jasmine.Spy;
    let setDOMSelectionSpy: jasmine.Spy;

    let isDisposed: jasmine.Spy;
    let pasteSpy: jasmine.Spy;
    let getVisibleViewportSpy: jasmine.Spy;
    let formatResult: boolean | undefined;
    let modelResult: ContentModelDocument | undefined;
    let mockedDarkColorHandler: DarkColorHandler;

    beforeEach(() => {
        modelResult = undefined;
        formatResult = undefined;

        div = document.createElement('div');
        mockedDocument = {
            createRange: () => document.createRange(),
            createDocumentFragment: () => document.createDocumentFragment(),
            createElement: () => div,
        } as any;

        getDOMSelectionSpy = jasmine
            .createSpy('getDOMSelection')
            .and.callFake(() => selectionValue);
        getContentModelCopySpy = jasmine
            .createSpy('getContentModelCopy')
            .and.returnValue(pasteModelValue);
        triggerPluginEventSpy = jasmine.createSpy('triggerPluginEventSpy');
        setDOMSelectionSpy = jasmine.createSpy('setDOMSelection');
        pasteSpy = jasmine.createSpy('paste_');
        isDisposed = jasmine.createSpy('isDisposed');
        getVisibleViewportSpy = jasmine.createSpy('getVisibleViewport');
        mockedDarkColorHandler = 'DARKCOLORHANDLER' as any;
        formatContentModelSpy = jasmine
            .createSpy('formatContentModel')
            .and.callFake((callback: ContentModelFormatter, options: FormatContentModelOptions) => {
                modelResult = modelValue;
                formatResult = callback(modelResult!, {
                    newEntities: [],
                    deletedEntities: [],
                    newImages: [],
                });
            });

        spyOn(addRangeToSelection, 'addRangeToSelection');

        plugin = createCopyPastePlugin({
            allowedCustomPasteType,
        });
        plugin.getState().tempDiv = div;
        editor = <IEditor>(<any>{
            attachDomEvent: (eventMap: Record<string, DOMEventRecord>) => {
                domEvents = eventMap;
            },
            getContentModelCopy: (options: any) => getContentModelCopySpy(options),
            triggerEvent(eventType: any, data: any, broadcast: any) {
                return triggerPluginEventSpy(eventType, data, broadcast) || data;
            },
            runAsync(callback: any) {
                callback(editor);
            },

            getDOMSelection: getDOMSelectionSpy,
            setDOMSelection: setDOMSelectionSpy,
            getDocument: () => mockedDocument,
            isDarkMode: () => {
                return false;
            },
            getColorManager: () => mockedDarkColorHandler,
            isDisposed,
            getVisibleViewport: getVisibleViewportSpy,
            formatContentModel: formatContentModelSpy,
            getTrustedHTMLHandler: () => (html: string) => html,
            getEnvironment: () =>
                ({
                    domToModelSettings: {},
                    modelToDomSettings: {},
                } as any),
            isExperimentalFeatureEnabled: () => false,
        });

        pasteSpy = spyOn(paste, 'paste');
        plugin.initialize(editor);
    });

    describe('Copy |', () => {
        it('Selection Collapsed', () => {
            selectionValue = <DOMSelection>{
                type: 'range',
                range: { collapsed: true } as any,
            };

            getContentModelCopySpy.and.callThrough();
            triggerPluginEventSpy.and.callThrough();

            const preventDefaultSpy = jasmine.createSpy('preventDefaultPaste');
            let clipboardEvent = <ClipboardEvent>{
                clipboardData: <DataTransfer>(<any>{
                    items: [<DataTransferItem>{}],
                    setData: jasmine.createSpy('setData'),
                }),
                preventDefault() {
                    preventDefaultSpy();
                },
            };
            domEvents.copy.beforeDispatch?.(clipboardEvent);

            expect(getDOMSelectionSpy).toHaveBeenCalled();
            expect(getContentModelCopySpy).not.toHaveBeenCalled();
            expect(triggerPluginEventSpy).not.toHaveBeenCalled();

            expect(formatResult).toBeFalsy();
        });

        it('Selection not Collapsed and normal selection', () => {
            // Arrange
            selectionValue = <DOMSelection>{
                type: 'range',
                range: { collapsed: false },
            };

            spyOn(deleteSelectionsFile, 'deleteSelection');
            spyOn(contentModelToDomFile, 'contentModelToDom').and.returnValue(selectionValue);
            spyOn(iterateSelectionsFile, 'iterateSelections').and.returnValue(undefined);

            triggerPluginEventSpy.and.callThrough();

            // Act
            const preventDefaultSpy = jasmine.createSpy('preventDefaultPaste');
            let clipboardEvent = <ClipboardEvent>{
                clipboardData: <DataTransfer>(<any>{
                    items: [<DataTransferItem>{}],
                    setData: jasmine.createSpy('setData'),
                }),
                preventDefault() {
                    preventDefaultSpy();
                },
            };
            domEvents.copy.beforeDispatch?.(clipboardEvent);

            // Assert
            expect(getDOMSelectionSpy).toHaveBeenCalled();
            expect(deleteSelectionsFile.deleteSelection).not.toHaveBeenCalled();
            expect(contentModelToDomFile.contentModelToDom).toHaveBeenCalledWith(
                mockedDocument,
                div,
                pasteModelValue,
                { ...createModelToDomContext(), onNodeCreated }
            );
            expect(getContentModelCopySpy).toHaveBeenCalled();
            expect(triggerPluginEventSpy).toHaveBeenCalledTimes(1);
            expect(iterateSelectionsFile.iterateSelections).toHaveBeenCalled();

            // On Cut Spy
            expect(formatContentModelSpy).not.toHaveBeenCalled();
            expect(formatResult).toBeFalsy();
        });

        it('Selection not Collapsed and table selection', () => {
            // Arrange
            const table = document.createElement('table');
            table.id = 'table';
            // Arrange
            selectionValue = <DOMSelection>{
                type: 'table',
                table,
            };

            spyOn(deleteSelectionsFile, 'deleteSelection');
            spyOn(contentModelToDomFile, 'contentModelToDom').and.callFake(() => {
                const container = document.createElement('div');
                container.append(table);

                div.appendChild(container);
                return selectionValue;
            });
            spyOn(iterateSelectionsFile, 'iterateSelections').and.returnValue(undefined);

            triggerPluginEventSpy.and.callThrough();

            // Act
            const preventDefaultSpy = jasmine.createSpy('preventDefaultPaste');
            let clipboardEvent = <ClipboardEvent>{
                clipboardData: <DataTransfer>(<any>{
                    items: [<DataTransferItem>{}],
                    setData: jasmine.createSpy('setData'),
                }),
                preventDefault() {
                    preventDefaultSpy();
                },
            };
            domEvents.copy.beforeDispatch?.(clipboardEvent);

            // Assert
            expect(getDOMSelectionSpy).toHaveBeenCalled();
            expect(deleteSelectionsFile.deleteSelection).not.toHaveBeenCalled();
            expect(contentModelToDomFile.contentModelToDom).toHaveBeenCalledWith(
                mockedDocument,
                div,
                pasteModelValue,
                { ...createModelToDomContext(), onNodeCreated }
            );
            expect(getContentModelCopySpy).toHaveBeenCalled();
            expect(triggerPluginEventSpy).toHaveBeenCalledTimes(1);
            expect(iterateSelectionsFile.iterateSelections).toHaveBeenCalled();

            // On Cut Spy
            expect(formatContentModelSpy).not.toHaveBeenCalled();
            expect(formatResult).toBeFalsy();
        });

        it('Selection not Collapsed and image selection', () => {
            // Arrange
            const image = document.createElement('img');
            image.id = 'image';
            selectionValue = <DOMSelection>{
                type: 'image',
                image,
            };

            spyOn(deleteSelectionsFile, 'deleteSelection');
            spyOn(contentModelToDomFile, 'contentModelToDom').and.callFake(() => {
                div.appendChild(image);
                return selectionValue;
            });
            spyOn(iterateSelectionsFile, 'iterateSelections').and.returnValue(undefined);

            triggerPluginEventSpy.and.callThrough();

            // Act
            const preventDefaultSpy = jasmine.createSpy('preventDefaultPaste');
            let clipboardEvent = <ClipboardEvent>{
                clipboardData: <DataTransfer>(<any>{
                    items: [<DataTransferItem>{}],
                    setData: jasmine.createSpy('setData'),
                }),
                preventDefault() {
                    preventDefaultSpy();
                },
            };
            domEvents.copy.beforeDispatch?.(clipboardEvent);

            // Assert
            expect(getDOMSelectionSpy).toHaveBeenCalled();
            expect(deleteSelectionsFile.deleteSelection).not.toHaveBeenCalled();
            expect(contentModelToDomFile.contentModelToDom).toHaveBeenCalledWith(
                mockedDocument,
                div,
                pasteModelValue,
                { ...createModelToDomContext(), onNodeCreated }
            );
            expect(getContentModelCopySpy).toHaveBeenCalled();
            expect(triggerPluginEventSpy).toHaveBeenCalledTimes(1);

            // On Cut Spy
            expect(formatContentModelSpy).not.toHaveBeenCalled();
            expect(formatResult).toBeFalsy();
            expect(iterateSelectionsFile.iterateSelections).toHaveBeenCalledTimes(0);
        });

        it('Selection not Collapsed and entity selection in Dark mode', () => {
            // Arrange
            const wrapper = document.createElement('span');

            document.body.appendChild(wrapper);

            setEntityElementClasses(wrapper, 'Entity', true, 'Entity');
            selectionValue = <DOMSelection>{
                type: 'range',
                range: createRange(wrapper),
            };

            spyOn(deleteSelectionsFile, 'deleteSelection');
            spyOn(contentModelToDomFile, 'contentModelToDom').and.callFake(() => {
                div.appendChild(wrapper);
                return selectionValue;
            });
            spyOn(iterateSelectionsFile, 'iterateSelections').and.returnValue(undefined);

            triggerPluginEventSpy.and.callThrough();

            editor.isDarkMode = () => true;

            // Act
            const preventDefaultSpy = jasmine.createSpy('preventDefaultPaste');
            let clipboardEvent = <ClipboardEvent>{
                clipboardData: <DataTransfer>(<any>{
                    items: [<DataTransferItem>{}],
                    setData: jasmine.createSpy('setData'),
                }),
                preventDefault() {
                    preventDefaultSpy();
                },
            };
            domEvents.copy.beforeDispatch?.(clipboardEvent);

            // Assert
            expect(getDOMSelectionSpy).toHaveBeenCalled();
            expect(deleteSelectionsFile.deleteSelection).not.toHaveBeenCalled();
            expect(contentModelToDomFile.contentModelToDom).toHaveBeenCalledWith(
                mockedDocument,
                div,
                pasteModelValue,
                { ...createModelToDomContext(), onNodeCreated }
            );
            expect(getContentModelCopySpy).toHaveBeenCalledWith('disconnected');
            expect(triggerPluginEventSpy).toHaveBeenCalledTimes(1);

            // On Cut Spy
            expect(formatContentModelSpy).not.toHaveBeenCalled();
            expect(formatResult).toBeFalsy();
            expect(iterateSelectionsFile.iterateSelections).toHaveBeenCalledTimes(1);
        });

        describe('withCustomCopyCutEnabled |', () => {
            beforeEach(() => {
                plugin.initialize(editor);
            });

            function createClipboardEventMock(): ClipboardEvent {
                return <any>{
                    clipboardData: {
                        setData: jasmine.createSpy('setData'),
                    },
                    preventDefault: jasmine.createSpy('preventDefault'),
                };
            }

            it('Selection not Collapsed and normal selection', () => {
                // Arrange
                selectionValue = <DOMSelection>{
                    type: 'range',
                    range: { collapsed: false },
                };

                spyOn(deleteSelectionsFile, 'deleteSelection');
                spyOn(contentModelToDomFile, 'contentModelToDom').and.returnValue(selectionValue);
                spyOn(iterateSelectionsFile, 'iterateSelections').and.returnValue(undefined);

                const event = createClipboardEventMock();

                // Act
                domEvents.copy.beforeDispatch?.(event);

                // Assert
                expect(getDOMSelectionSpy).toHaveBeenCalled();
                expect(deleteSelectionsFile.deleteSelection).not.toHaveBeenCalled();
                expect(contentModelToDomFile.contentModelToDom).toHaveBeenCalledWith(
                    mockedDocument,
                    div,
                    pasteModelValue,
                    { ...createModelToDomContext(), onNodeCreated }
                );
                expect(getContentModelCopySpy).toHaveBeenCalled();
                expect(triggerPluginEventSpy).toHaveBeenCalledTimes(1);
                expect(iterateSelectionsFile.iterateSelections).toHaveBeenCalled();

                // On Cut Spy
                expect(formatContentModelSpy).not.toHaveBeenCalled();
                expect(formatResult).toBeFalsy();
            });

            it('Selection not Collapsed and table selection', () => {
                // Arrange
                const table = document.createElement('table');
                table.id = 'table';
                // Arrange
                selectionValue = <DOMSelection>{
                    type: 'table',
                    table,
                };

                spyOn(deleteSelectionsFile, 'deleteSelection');
                spyOn(contentModelToDomFile, 'contentModelToDom').and.callFake(() => {
                    const container = document.createElement('div');
                    container.append(table);

                    div.appendChild(container);
                    return selectionValue;
                });
                spyOn(iterateSelectionsFile, 'iterateSelections').and.returnValue(undefined);

                const event = createClipboardEventMock();

                // Act
                domEvents.copy.beforeDispatch?.(event);

                // Assert
                expect(getDOMSelectionSpy).toHaveBeenCalled();
                expect(deleteSelectionsFile.deleteSelection).not.toHaveBeenCalled();
                expect(contentModelToDomFile.contentModelToDom).toHaveBeenCalledWith(
                    mockedDocument,
                    div,
                    pasteModelValue,
                    { ...createModelToDomContext(), onNodeCreated }
                );
                expect(getContentModelCopySpy).toHaveBeenCalled();
                expect(triggerPluginEventSpy).toHaveBeenCalledTimes(1);
                expect(iterateSelectionsFile.iterateSelections).toHaveBeenCalled();

                expect(event.clipboardData?.setData).toHaveBeenCalledTimes(2);
                expect(event.clipboardData?.setData).toHaveBeenCalledWith(
                    'text/html',
                    '<div><table id="table"></table></div>'
                );
                expect(event.clipboardData?.setData).toHaveBeenCalledWith('text/plain', '');

                // On Cut Spy
                expect(formatContentModelSpy).not.toHaveBeenCalled();
                expect(formatResult).toBeFalsy();
            });

            it('Selection not Collapsed and image selection', () => {
                // Arrange
                const image = document.createElement('img');
                image.id = 'image';
                selectionValue = <DOMSelection>{
                    type: 'image',
                    image,
                };

                spyOn(deleteSelectionsFile, 'deleteSelection');
                spyOn(contentModelToDomFile, 'contentModelToDom').and.callFake(() => {
                    div.appendChild(image);
                    return selectionValue;
                });
                spyOn(iterateSelectionsFile, 'iterateSelections').and.returnValue(undefined);

                const event = createClipboardEventMock();

                // Act
                domEvents.copy.beforeDispatch?.(event);

                // Assert
                expect(getDOMSelectionSpy).toHaveBeenCalled();
                expect(deleteSelectionsFile.deleteSelection).not.toHaveBeenCalled();
                expect(contentModelToDomFile.contentModelToDom).toHaveBeenCalledWith(
                    mockedDocument,
                    div,
                    pasteModelValue,
                    { ...createModelToDomContext(), onNodeCreated }
                );
                expect(getContentModelCopySpy).toHaveBeenCalled();
                expect(triggerPluginEventSpy).toHaveBeenCalledTimes(1);

                expect(event.clipboardData?.setData).toHaveBeenCalledTimes(2);
                expect(event.clipboardData?.setData).toHaveBeenCalledWith(
                    'text/html',
                    '<img id="image">'
                );
                expect(event.clipboardData?.setData).toHaveBeenCalledWith('text/plain', '');

                // On Cut Spy
                expect(formatContentModelSpy).not.toHaveBeenCalled();
                expect(formatResult).toBeFalsy();
                expect(iterateSelectionsFile.iterateSelections).toHaveBeenCalledTimes(0);
            });

            it('Selection not Collapsed and entity selection in Dark mode', () => {
                // Arrange
                const wrapper = document.createElement('span');

                document.body.appendChild(wrapper);

                setEntityElementClasses(wrapper, 'Entity', true, 'Entity');
                selectionValue = <DOMSelection>{
                    type: 'range',
                    range: createRange(wrapper),
                };

                spyOn(deleteSelectionsFile, 'deleteSelection');
                spyOn(contentModelToDomFile, 'contentModelToDom').and.callFake(() => {
                    div.appendChild(wrapper);
                    return selectionValue;
                });
                spyOn(iterateSelectionsFile, 'iterateSelections').and.returnValue(undefined);

                editor.isDarkMode = () => true;
                const event = createClipboardEventMock();

                // Act
                domEvents.copy.beforeDispatch?.(event);

                // Assert
                expect(getDOMSelectionSpy).toHaveBeenCalled();
                expect(deleteSelectionsFile.deleteSelection).not.toHaveBeenCalled();
                expect(contentModelToDomFile.contentModelToDom).toHaveBeenCalledWith(
                    mockedDocument,
                    div,
                    pasteModelValue,
                    { ...createModelToDomContext(), onNodeCreated }
                );
                expect(getContentModelCopySpy).toHaveBeenCalledWith('disconnected');
                expect(triggerPluginEventSpy).toHaveBeenCalledTimes(1);

                expect(event.clipboardData?.setData).toHaveBeenCalledTimes(2);
                expect(event.clipboardData?.setData).toHaveBeenCalledWith(
                    'text/html',
                    '<span class="_Entity _EType_Entity _EId_Entity _EReadonly_1" contenteditable="false"></span>'
                );
                expect(event.clipboardData?.setData).toHaveBeenCalledWith('text/plain', '');

                // On Cut Spy
                expect(formatContentModelSpy).not.toHaveBeenCalled();
                expect(formatResult).toBeFalsy();
                expect(iterateSelectionsFile.iterateSelections).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe('Cut |', () => {
        it('Selection Collapsed', () => {
            // Arrange
            selectionValue = <DOMSelection>{
                type: 'range',
                range: { collapsed: true } as any,
            };

            getContentModelCopySpy.and.callThrough();
            triggerPluginEventSpy.and.callThrough();

            // Act
            const preventDefaultSpy = jasmine.createSpy('preventDefaultPaste');
            let clipboardEvent = <ClipboardEvent>{
                clipboardData: <DataTransfer>(<any>{
                    items: [<DataTransferItem>{}],
                    setData: jasmine.createSpy('setData'),
                }),
                preventDefault() {
                    preventDefaultSpy();
                },
            };
            domEvents.copy.beforeDispatch?.(clipboardEvent);

            // Assert
            expect(getDOMSelectionSpy).toHaveBeenCalled();
            expect(getContentModelCopySpy).not.toHaveBeenCalled();
            expect(triggerPluginEventSpy).not.toHaveBeenCalled();

            expect(formatContentModelSpy).not.toHaveBeenCalled();

            expect(formatResult).toBeFalsy();
        });

        it('Selection not Collapsed', () => {
            // Arrange
            selectionValue = <DOMSelection>{
                type: 'range',
                range: { collapsed: false },
            };

            const deleteSelectionSpy = spyOn(deleteSelectionsFile, 'deleteSelection').and.callFake(
                (model: any, steps: any, options: any) => {
                    return {
                        deletedModel: pasteModelValue,
                        insertPoint: insertPointValue,
                        deleteResult: deleteResultValue,
                    };
                }
            );
            spyOn(iterateSelectionsFile, 'iterateSelections').and.returnValue(undefined);
            spyOn(contentModelToDomFile, 'contentModelToDom').and.returnValue(selectionValue);

            triggerPluginEventSpy.and.callThrough();

            // Act
            const preventDefaultSpy = jasmine.createSpy('preventDefaultPaste');
            let clipboardEvent = <ClipboardEvent>{
                clipboardData: <DataTransfer>(<any>{
                    items: [<DataTransferItem>{}],
                    setData: jasmine.createSpy('setData'),
                }),
                preventDefault() {
                    preventDefaultSpy();
                },
            };
            domEvents.cut.beforeDispatch?.(clipboardEvent);

            // Assert
            expect(getDOMSelectionSpy).toHaveBeenCalled();
            expect(deleteSelectionSpy.calls.argsFor(0)[0]).toEqual(modelValue);
            expect(contentModelToDomFile.contentModelToDom).toHaveBeenCalledWith(
                mockedDocument,
                div,
                pasteModelValue,
                { ...createModelToDomContext(), onNodeCreated }
            );
            expect(getContentModelCopySpy).toHaveBeenCalled();
            expect(triggerPluginEventSpy).toHaveBeenCalledTimes(1);

            // On Cut Spy
            expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
            expect(formatResult).toBeTrue();
            expect(modelResult).toEqual(modelValue);
        });

        it('Selection not Collapsed and table selection', () => {
            // Arrange
            const table = document.createElement('table');
            table.id = 'table';
            selectionValue = <DOMSelection>{
                type: 'table',
                table,
            };

            spyOn(deleteSelectionsFile, 'deleteSelection').and.returnValue({
                deleteResult: 'range',
                insertPoint: null!,
            });
            spyOn(contentModelToDomFile, 'contentModelToDom').and.callFake(() => {
                const container = document.createElement('div');
                container.append(table);

                div.appendChild(container);
                return selectionValue;
            });
            spyOn(iterateSelectionsFile, 'iterateSelections').and.returnValue(undefined);
            spyOn(normalizeContentModel, 'normalizeContentModel');

            triggerPluginEventSpy.and.callThrough();

            // Act
            const preventDefaultSpy = jasmine.createSpy('preventDefaultPaste');
            let clipboardEvent = <ClipboardEvent>{
                clipboardData: <DataTransfer>(<any>{
                    items: [<DataTransferItem>{}],
                    setData: jasmine.createSpy('setData'),
                }),
                preventDefault() {
                    preventDefaultSpy();
                },
            };
            domEvents.cut.beforeDispatch?.(clipboardEvent);

            // Assert
            expect(getDOMSelectionSpy).toHaveBeenCalled();
            expect(contentModelToDomFile.contentModelToDom).toHaveBeenCalledWith(
                mockedDocument,
                div,
                pasteModelValue,
                { ...createModelToDomContext(), onNodeCreated }
            );
            expect(getContentModelCopySpy).toHaveBeenCalled();
            expect(iterateSelectionsFile.iterateSelections).toHaveBeenCalled();

            // On Cut Spy
            expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
            expect(deleteSelectionsFile.deleteSelection).toHaveBeenCalled();
            expect(formatResult).toBeTrue();
            expect(modelResult).toEqual(modelValue);
            expect(normalizeContentModel.normalizeContentModel).toHaveBeenCalledWith(modelValue);
        });

        it('Selection not Collapsed and image selection', () => {
            // Arrange
            const image = document.createElement('img');
            image.id = 'image';
            selectionValue = <DOMSelection>{
                type: 'image',
                image,
            };

            spyOn(deleteSelectionsFile, 'deleteSelection').and.returnValue({
                deleteResult: 'range',
                insertPoint: null!,
            });
            spyOn(contentModelToDomFile, 'contentModelToDom').and.callFake(() => {
                div.appendChild(image);
                return selectionValue;
            });
            spyOn(iterateSelectionsFile, 'iterateSelections').and.returnValue(undefined);
            spyOn(normalizeContentModel, 'normalizeContentModel');

            triggerPluginEventSpy.and.callThrough();

            // Act
            const preventDefaultSpy = jasmine.createSpy('preventDefaultPaste');
            let clipboardEvent = <ClipboardEvent>{
                clipboardData: <DataTransfer>(<any>{
                    items: [<DataTransferItem>{}],
                    setData: jasmine.createSpy('setData'),
                }),
                preventDefault() {
                    preventDefaultSpy();
                },
            };
            domEvents.cut.beforeDispatch?.(clipboardEvent);

            // Assert
            expect(getDOMSelectionSpy).toHaveBeenCalled();
            expect(contentModelToDomFile.contentModelToDom).toHaveBeenCalledWith(
                mockedDocument,
                div,
                pasteModelValue,
                { ...createModelToDomContext(), onNodeCreated }
            );
            expect(getContentModelCopySpy).toHaveBeenCalled();
            expect(triggerPluginEventSpy).toHaveBeenCalledTimes(1);

            // On Cut Spy
            expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
            expect(deleteSelectionsFile.deleteSelection).toHaveBeenCalled();
            expect(formatResult).toBeTrue();
            expect(modelResult).toEqual(modelValue);
            expect(normalizeContentModel.normalizeContentModel).toHaveBeenCalledWith(modelValue);
        });

        describe('withCustomCopyCutEnabled |', () => {
            beforeEach(() => {
                editor.isExperimentalFeatureEnabled = () => true;
                plugin.initialize(editor);
            });

            function createClipboardEventMock(): ClipboardEvent {
                return <any>{
                    clipboardData: {
                        setData: jasmine.createSpy('setData'),
                    },
                    preventDefault: jasmine.createSpy('preventDefault'),
                };
            }

            it('Selection not Collapsed', () => {
                // Arrange
                selectionValue = <DOMSelection>{
                    type: 'range',
                    range: <any>{
                        collapsed: false,
                    },
                };

                const deleteSelectionSpy = spyOn(
                    deleteSelectionsFile,
                    'deleteSelection'
                ).and.callFake((model: any, steps: any, options: any) => {
                    return {
                        deletedModel: pasteModelValue,
                        insertPoint: insertPointValue,
                        deleteResult: deleteResultValue,
                    };
                });
                spyOn(iterateSelectionsFile, 'iterateSelections').and.returnValue(undefined);
                spyOn(contentModelToDomFile, 'contentModelToDom').and.returnValue(selectionValue);

                triggerPluginEventSpy.and.callThrough();

                const event = createClipboardEventMock();

                // Act
                domEvents.cut.beforeDispatch?.(event);

                // Assert
                expect(getDOMSelectionSpy).toHaveBeenCalled();
                expect(deleteSelectionSpy.calls.argsFor(0)[0]).toEqual(modelValue);
                expect(contentModelToDomFile.contentModelToDom).toHaveBeenCalledWith(
                    mockedDocument,
                    div,
                    pasteModelValue,
                    { ...createModelToDomContext(), onNodeCreated }
                );
                expect(getContentModelCopySpy).toHaveBeenCalled();
                expect(triggerPluginEventSpy).toHaveBeenCalledTimes(1);

                expect(event.clipboardData?.setData).toHaveBeenCalledTimes(2);
                expect(event.clipboardData?.setData).toHaveBeenCalledWith('text/html', '');
                expect(event.clipboardData?.setData).toHaveBeenCalledWith('text/plain', '');

                // On Cut Spy
                expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
                expect(formatResult).toBeTrue();
                expect(modelResult).toEqual(modelValue);
            });

            it('Selection not Collapsed and table selection', () => {
                // Arrange
                const table = document.createElement('table');
                table.id = 'table';
                selectionValue = <DOMSelection>{
                    type: 'table',
                    table,
                };

                spyOn(deleteSelectionsFile, 'deleteSelection').and.returnValue({
                    deleteResult: 'range',
                    insertPoint: null!,
                });
                spyOn(contentModelToDomFile, 'contentModelToDom').and.callFake(() => {
                    const container = document.createElement('div');
                    container.append(table);

                    div.appendChild(container);
                    return selectionValue;
                });
                spyOn(iterateSelectionsFile, 'iterateSelections').and.returnValue(undefined);
                spyOn(normalizeContentModel, 'normalizeContentModel');

                triggerPluginEventSpy.and.callThrough();

                const event = createClipboardEventMock();

                // Act
                domEvents.cut.beforeDispatch?.(event);

                // Assert
                expect(getDOMSelectionSpy).toHaveBeenCalled();
                expect(contentModelToDomFile.contentModelToDom).toHaveBeenCalledWith(
                    mockedDocument,
                    div,
                    pasteModelValue,
                    { ...createModelToDomContext(), onNodeCreated }
                );
                expect(getContentModelCopySpy).toHaveBeenCalled();
                expect(iterateSelectionsFile.iterateSelections).toHaveBeenCalled();

                expect(event.clipboardData?.setData).toHaveBeenCalledTimes(2);
                expect(event.clipboardData?.setData).toHaveBeenCalledWith(
                    'text/html',
                    '<div><table id="table"></table></div>'
                );
                expect(event.clipboardData?.setData).toHaveBeenCalledWith('text/plain', '');

                // On Cut Spy
                expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
                expect(deleteSelectionsFile.deleteSelection).toHaveBeenCalled();
                expect(formatResult).toBeTrue();
                expect(modelResult).toEqual(modelValue);
                expect(normalizeContentModel.normalizeContentModel).toHaveBeenCalledWith(
                    modelValue
                );
            });

            it('Selection not Collapsed and image selection', () => {
                // Arrange
                const image = document.createElement('img');
                image.id = 'image';
                selectionValue = <DOMSelection>{
                    type: 'image',
                    image,
                };

                spyOn(deleteSelectionsFile, 'deleteSelection').and.returnValue({
                    deleteResult: 'range',
                    insertPoint: null!,
                });
                spyOn(contentModelToDomFile, 'contentModelToDom').and.callFake(() => {
                    div.appendChild(image);
                    return selectionValue;
                });
                spyOn(iterateSelectionsFile, 'iterateSelections').and.returnValue(undefined);
                spyOn(normalizeContentModel, 'normalizeContentModel');

                triggerPluginEventSpy.and.callThrough();

                const event = createClipboardEventMock();

                // Act
                domEvents.cut.beforeDispatch?.(event);

                // Assert
                expect(getDOMSelectionSpy).toHaveBeenCalled();
                expect(contentModelToDomFile.contentModelToDom).toHaveBeenCalledWith(
                    mockedDocument,
                    div,
                    pasteModelValue,
                    { ...createModelToDomContext(), onNodeCreated }
                );
                expect(getContentModelCopySpy).toHaveBeenCalled();
                expect(triggerPluginEventSpy).toHaveBeenCalledTimes(1);

                expect(event.clipboardData?.setData).toHaveBeenCalledTimes(2);
                expect(event.clipboardData?.setData).toHaveBeenCalledWith(
                    'text/html',
                    '<img id="image">'
                );
                expect(event.clipboardData?.setData).toHaveBeenCalledWith('text/plain', '');

                // On Cut Spy
                expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
                expect(deleteSelectionsFile.deleteSelection).toHaveBeenCalled();
                expect(formatResult).toBeTrue();
                expect(modelResult).toEqual(modelValue);
                expect(normalizeContentModel.normalizeContentModel).toHaveBeenCalledWith(
                    modelValue
                );
            });
        });
    });

    describe('Paste |', () => {
        let clipboardData = <ClipboardData>{};

        it('Handle', () => {
            const preventDefaultSpy = jasmine.createSpy('preventDefaultPaste');
            let clipboardEvent = <ClipboardEvent>{
                clipboardData: <DataTransfer>(<any>{
                    items: [<DataTransferItem>{}],
                    setData: jasmine.createSpy('setData'),
                }),
                preventDefault() {
                    preventDefaultSpy();
                },
            };
            spyOn(extractClipboardItemsFile, 'extractClipboardItems').and.returnValue(<
                Promise<ClipboardData>
            >{
                then: (cb: (value: ClipboardData) => void | PromiseLike<void>) => {
                    cb(clipboardData);
                },
            });
            isDisposed.and.returnValue(false);

            domEvents.paste.beforeDispatch?.(clipboardEvent);

            expect(pasteSpy).toHaveBeenCalledWith(editor, clipboardData, undefined);
            expect(extractClipboardItemsFile.extractClipboardItems).toHaveBeenCalledWith(
                Array.from(clipboardEvent.clipboardData!.items),
                allowedCustomPasteType
            );
            expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
        });

        it('Handle with domToModelOptions', () => {
            const preventDefaultSpy = jasmine.createSpy('preventDefaultPaste');
            let clipboardEvent = <ClipboardEvent>{
                clipboardData: <DataTransfer>(<any>{
                    items: [<DataTransferItem>{}],
                    setData: jasmine.createSpy('setData'),
                }),
                preventDefault() {
                    preventDefaultSpy();
                },
            };
            spyOn(extractClipboardItemsFile, 'extractClipboardItems').and.returnValue(<
                Promise<ClipboardData>
            >{
                then: (cb: (value: ClipboardData) => void | PromiseLike<void>) => {
                    cb(clipboardData);
                },
            });
            isDisposed.and.returnValue(false);

            domEvents.paste.beforeDispatch?.(clipboardEvent);

            expect(pasteSpy).toHaveBeenCalledWith(editor, clipboardData, undefined);
            expect(extractClipboardItemsFile.extractClipboardItems).toHaveBeenCalledWith(
                Array.from(clipboardEvent.clipboardData!.items),
                allowedCustomPasteType
            );
            expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
        });

        it('Handle with defaultPasteType mergePaste', () => {
            const preventDefaultSpy = jasmine.createSpy('preventDefaultPaste');
            plugin.getState().defaultPasteType = 'mergeFormat';
            let clipboardEvent = <ClipboardEvent>{
                clipboardData: <DataTransfer>(<any>{
                    items: [<DataTransferItem>{}],
                    setData: jasmine.createSpy('setData'),
                }),
                preventDefault() {
                    preventDefaultSpy();
                },
            };
            spyOn(extractClipboardItemsFile, 'extractClipboardItems').and.returnValue(<
                Promise<ClipboardData>
            >{
                then: (cb: (value: ClipboardData) => void | PromiseLike<void>) => {
                    cb(clipboardData);
                },
            });
            isDisposed.and.returnValue(false);

            domEvents.paste.beforeDispatch?.(clipboardEvent);

            expect(pasteSpy).toHaveBeenCalledWith(editor, clipboardData, 'mergeFormat');
            expect(extractClipboardItemsFile.extractClipboardItems).toHaveBeenCalledWith(
                Array.from(clipboardEvent.clipboardData!.items),
                allowedCustomPasteType
            );
            expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
        });

        it('Handle with defaultPasteType asImage', () => {
            const preventDefaultSpy = jasmine.createSpy('preventDefaultPaste');
            plugin.getState().defaultPasteType = 'asImage';
            let clipboardEvent = <ClipboardEvent>{
                clipboardData: <DataTransfer>(<any>{
                    items: [<DataTransferItem>{}],
                    setData: jasmine.createSpy('setData'),
                }),
                preventDefault() {
                    preventDefaultSpy();
                },
            };
            spyOn(extractClipboardItemsFile, 'extractClipboardItems').and.returnValue(<
                Promise<ClipboardData>
            >{
                then: (cb: (value: ClipboardData) => void | PromiseLike<void>) => {
                    cb(clipboardData);
                },
            });
            isDisposed.and.returnValue(false);

            domEvents.paste.beforeDispatch?.(clipboardEvent);

            expect(pasteSpy).toHaveBeenCalledWith(editor, clipboardData, 'asImage');
            expect(extractClipboardItemsFile.extractClipboardItems).toHaveBeenCalledWith(
                Array.from(clipboardEvent.clipboardData!.items),
                allowedCustomPasteType
            );
            expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
        });

        it('Handle with defaultPasteType asPlainText', () => {
            const preventDefaultSpy = jasmine.createSpy('preventDefaultPaste');
            plugin.getState().defaultPasteType = 'asPlainText';
            let clipboardEvent = <ClipboardEvent>{
                clipboardData: <DataTransfer>(<any>{
                    items: [<DataTransferItem>{}],
                    setData: jasmine.createSpy('setData'),
                }),
                preventDefault() {
                    preventDefaultSpy();
                },
            };
            spyOn(extractClipboardItemsFile, 'extractClipboardItems').and.returnValue(<
                Promise<ClipboardData>
            >{
                then: (cb: (value: ClipboardData) => void | PromiseLike<void>) => {
                    cb(clipboardData);
                },
            });
            isDisposed.and.returnValue(false);

            domEvents.paste.beforeDispatch?.(clipboardEvent);

            expect(pasteSpy).toHaveBeenCalledWith(editor, clipboardData, 'asPlainText');
            expect(extractClipboardItemsFile.extractClipboardItems).toHaveBeenCalledWith(
                Array.from(clipboardEvent.clipboardData!.items),
                allowedCustomPasteType
            );
            expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
        });

        it('Handle with defaultPasteType asPlainText', () => {
            const preventDefaultSpy = jasmine.createSpy('preventDefaultPaste');
            plugin.getState().defaultPasteType = 'normal';
            let clipboardEvent = <ClipboardEvent>{
                clipboardData: <DataTransfer>(<any>{
                    items: [<DataTransferItem>{}],
                    setData: jasmine.createSpy('setData'),
                }),
                preventDefault() {
                    preventDefaultSpy();
                },
            };
            spyOn(extractClipboardItemsFile, 'extractClipboardItems').and.returnValue(<
                Promise<ClipboardData>
            >{
                then: (cb: (value: ClipboardData) => void | PromiseLike<void>) => {
                    cb(clipboardData);
                },
            });
            isDisposed.and.returnValue(false);

            domEvents.paste.beforeDispatch?.(clipboardEvent);

            expect(pasteSpy).toHaveBeenCalledWith(editor, clipboardData, 'normal');
            expect(extractClipboardItemsFile.extractClipboardItems).toHaveBeenCalledWith(
                Array.from(clipboardEvent.clipboardData!.items),
                allowedCustomPasteType
            );
            expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
        });

        it('Handle, editor is disposed', () => {
            const preventDefaultSpy = jasmine.createSpy('preventDefaultPaste');
            let clipboardEvent = <ClipboardEvent>{
                clipboardData: <DataTransfer>(<any>{
                    items: [<DataTransferItem>{}],
                }),
                preventDefault() {
                    preventDefaultSpy();
                },
            };

            spyOn(extractClipboardItemsFile, 'extractClipboardItems').and.returnValue(<
                Promise<ClipboardData>
            >{
                then: (cb: (value: ClipboardData) => void | PromiseLike<void>) => {
                    cb(clipboardData);
                },
            });
            isDisposed.and.returnValue(true);

            domEvents.paste.beforeDispatch?.(clipboardEvent);

            expect(pasteSpy).not.toHaveBeenCalled();
            expect(extractClipboardItemsFile.extractClipboardItems).toHaveBeenCalledWith(
                Array.from(clipboardEvent.clipboardData!.items),
                allowedCustomPasteType
            );
            expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
        });

        it('Handle with defaultPasteType as callback', () => {
            const preventDefaultSpy = jasmine.createSpy('preventDefaultPaste');
            const cb: PasteTypeOrGetter = () => 'normal';
            plugin.getState().defaultPasteType = cb;
            let clipboardEvent = <ClipboardEvent>{
                clipboardData: <DataTransfer>(<any>{
                    items: [<DataTransferItem>{}],
                }),
                preventDefault() {
                    preventDefaultSpy();
                },
            };
            spyOn(extractClipboardItemsFile, 'extractClipboardItems').and.returnValue(<
                Promise<ClipboardData>
            >{
                then: (cb: (value: ClipboardData) => void | PromiseLike<void>) => {
                    cb(clipboardData);
                },
            });
            isDisposed.and.returnValue(false);

            domEvents.paste.beforeDispatch?.(clipboardEvent);

            expect(pasteSpy).toHaveBeenCalledWith(editor, clipboardData, cb);
            expect(extractClipboardItemsFile.extractClipboardItems).toHaveBeenCalledWith(
                Array.from(clipboardEvent.clipboardData!.items),
                allowedCustomPasteType
            );
            expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
        });
    });

    it('onNodeCreated with table', () => {
        const div = document.createElement('div');
        const table = document.createElement('table');
        spyOn(copyPasteEntityOverride, 'onCreateCopyEntityNode').and.callThrough();

        div.appendChild(table);

        onNodeCreated(null!, table);

        expect(div.innerHTML).toEqual('<div><table></table></div>');
        expect(copyPasteEntityOverride.onCreateCopyEntityNode).toHaveBeenCalled();
    });

    it('onNodeCreated with readonly element', () => {
        const div = document.createElement('div');
        div.contentEditable = 'true';
        spyOn(copyPasteEntityOverride, 'onCreateCopyEntityNode').and.callThrough();

        const span = document.createElement('span');
        div.appendChild(span);
        span.contentEditable = 'false';

        onNodeCreated(null!, span);

        expect(copyPasteEntityOverride.onCreateCopyEntityNode).toHaveBeenCalled();
        expect(div.innerHTML).toBe('<span></span>');
    });

    describe('preprocessTable', () => {
        it('Preprocess table without selection', () => {
            const cell1 = createTableCell();
            const cell2 = createTableCell();
            const cell3 = createTableCell();
            const cell4 = createTableCell();
            const table = createTable(1);

            table.rows[0].cells.push(cell1, cell2, cell3, cell4);
            table.widths = [100, 20, 30, 80];

            preprocessTable(table);

            expect(table).toEqual({
                blockType: 'Table',
                rows: [],
                format: {},
                widths: [],
                dataset: {},
            });
        });

        it('Preprocess table with selection', () => {
            const cell1 = createTableCell();
            const cell2 = createTableCell();
            const cell3 = createTableCell();
            const cell4 = createTableCell();
            const table = createTable(1);

            table.rows[0].cells.push(cell1, cell2, cell3, cell4);
            table.widths = [100, 20, 30, 80];
            cell2.isSelected = true;
            cell3.isSelected = true;

            preprocessTable(table);

            expect(table).toEqual({
                blockType: 'Table',
                rows: [
                    {
                        height: 0,
                        format: {},
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {},
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                                isSelected: true,
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {},
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                                isSelected: true,
                            },
                        ],
                    },
                ],
                format: {},
                widths: [20, 30],
                dataset: {},
            });
        });
    });

    describe('adjustSelectionForCopyCut', () => {
        it('adjust the selection when selecting first cell of table', () => {
            const model: ContentModelDocument = {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'SelectionMarker',
                                isSelected: true,
                                format: {},
                            },
                        ],
                        format: {},
                        segmentFormat: {},
                        isImplicit: true,
                    },
                    {
                        blockType: 'Table',
                        rows: [
                            {
                                height: 22,
                                format: {},
                                cells: [
                                    {
                                        blockGroupType: 'TableCell',
                                        blocks: [
                                            {
                                                blockType: 'Paragraph',
                                                segments: [
                                                    {
                                                        segmentType: 'Text',
                                                        text: 'asd',
                                                        format: {},
                                                        isSelected: true,
                                                    },
                                                ],
                                                format: {},
                                            },
                                        ],
                                        format: {},
                                        spanLeft: false,
                                        spanAbove: false,
                                        isHeader: false,
                                        dataset: {},
                                    },
                                ],
                            },
                        ],
                        format: {},
                        widths: [120],
                        dataset: {},
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Br',
                                format: {},
                            },
                        ],
                        format: {},
                    },
                ],
                format: {},
            };
            adjustSelectionForCopyCut(model);

            expect(model).toEqual({
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [],
                        format: {},
                        segmentFormat: {},
                        isImplicit: true,
                    },
                    {
                        blockType: 'Table',
                        rows: [
                            {
                                height: 22,
                                format: {},
                                cells: [
                                    {
                                        blockGroupType: 'TableCell',
                                        blocks: [
                                            {
                                                blockType: 'Paragraph',
                                                segments: [
                                                    {
                                                        segmentType: 'Text',
                                                        text: 'asd',
                                                        format: {},
                                                        isSelected: true,
                                                    },
                                                ],
                                                format: {},
                                            },
                                        ],
                                        format: {},
                                        spanLeft: false,
                                        spanAbove: false,
                                        isHeader: false,
                                        dataset: {},
                                    },
                                ],
                            },
                        ],
                        format: {},
                        widths: [120],
                        dataset: {},
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Br',
                                format: {},
                            },
                        ],
                        format: {},
                    },
                ],
                format: {},
            });
        });

        it('adjust the selection when selecting first cell of a table nested in another table', () => {
            const model: ContentModelDocument = {
                blockGroupType: 'Document',
                blocks: [
                    {
                        isImplicit: true,
                        segments: [
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
                    {
                        widths: [120],
                        rows: [
                            {
                                height: 44,
                                cells: [
                                    {
                                        spanAbove: false,
                                        spanLeft: false,
                                        isHeader: false,
                                        blockGroupType: 'TableCell',
                                        blocks: [
                                            {
                                                widths: [116.4000015258789],
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
                                                                                text: 'Test',
                                                                                segmentType: 'Text',
                                                                                isSelected: true,
                                                                                format: {},
                                                                            },
                                                                        ],
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
                                                format: {},
                                                dataset: {},
                                            },
                                            {
                                                segments: [
                                                    {
                                                        segmentType: 'Br',
                                                        format: {},
                                                    },
                                                ],
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
                            useBorderBox: true,
                            borderCollapse: true,
                        },
                        dataset: {},
                    },
                    {
                        segments: [
                            {
                                segmentType: 'Br',
                                format: {},
                            },
                        ],
                        blockType: 'Paragraph',
                        format: {},
                    },
                ],
                format: {},
            };

            adjustSelectionForCopyCut(model);

            expect(model).toEqual({
                blockGroupType: 'Document',
                blocks: [
                    {
                        isImplicit: true,
                        segments: [],
                        segmentFormat: {},
                        blockType: 'Paragraph',
                        format: {},
                    },
                    {
                        widths: [120],
                        rows: [
                            {
                                height: 44,
                                cells: [
                                    {
                                        spanAbove: false,
                                        spanLeft: false,
                                        isHeader: false,
                                        blockGroupType: 'TableCell',
                                        blocks: [
                                            {
                                                widths: jasmine.anything() as any,
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
                                                                                text: 'Test',
                                                                                segmentType: 'Text',
                                                                                isSelected: true,
                                                                                format: {},
                                                                            },
                                                                        ],
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
                                                format: {},
                                                dataset: {},
                                            },
                                            {
                                                segments: [
                                                    {
                                                        segmentType: 'Br',
                                                        format: {},
                                                    },
                                                ],
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
                            useBorderBox: true,
                            borderCollapse: true,
                        },
                        dataset: {},
                    },
                    {
                        segments: [
                            {
                                segmentType: 'Br',
                                format: {},
                            },
                        ],
                        blockType: 'Paragraph',
                        format: {},
                    },
                ],
                format: {},
            });
        });

        it('Adjust selection starting at last cell with no text and finishing on text after table', () => {
            const model: ContentModelDocument = {
                blockGroupType: 'Document',
                blocks: [
                    {
                        widths: [120.00000762939453],
                        rows: [
                            {
                                height: 22.000001907348633,
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
                                                        text: 'asd',
                                                        segmentType: 'Text',
                                                        format: {},
                                                    },
                                                    {
                                                        isSelected: true,
                                                        segmentType: 'SelectionMarker',
                                                        format: {},
                                                    },
                                                ],
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
                        format: {},
                        dataset: {},
                    },
                    {
                        segments: [
                            {
                                text: 'asd',
                                segmentType: 'Text',
                                format: {},
                                isSelected: true,
                            },
                        ],
                        blockType: 'Paragraph',
                        format: {},
                    },
                ],
                format: {},
            };

            adjustSelectionForCopyCut(model);

            expect(model).toEqual({
                blockGroupType: 'Document',
                blocks: [
                    {
                        widths: [120.00000762939453],
                        rows: [
                            {
                                height: 22.000001907348633,
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
                                                        text: 'asd',
                                                        segmentType: 'Text',
                                                        format: {},
                                                    },
                                                ],
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
                        format: {},
                        dataset: {},
                    },
                    {
                        segments: [
                            {
                                text: 'asd',
                                segmentType: 'Text',
                                format: {},
                                isSelected: true,
                            },
                        ],
                        blockType: 'Paragraph',
                        format: {},
                    },
                ],
                format: {},
            });
        });

        it('Do not adjust when it is not needed', () => {
            const model: ContentModelDocument = {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'asdsadsada',
                                format: {},
                                isSelected: true,
                            },
                            {
                                segmentType: 'Text',
                                text: 'sdsad',
                                format: {},
                            },
                        ],
                        format: {},
                    },
                ],
                format: {},
            };

            adjustSelectionForCopyCut(model);

            expect(model).toEqual({
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'asdsadsada',
                                format: {},
                                isSelected: true,
                            },
                            {
                                segmentType: 'Text',
                                text: 'sdsad',
                                format: {},
                            },
                        ],
                        format: {},
                    },
                ],
                format: {},
            });
        });
    });

    describe('shouldPreventDefaultPaste', () => {
        it('should not prevent default for empty clipboard data', () => {
            const clipboardData = <DataTransfer>(<any>{
                items: null,
            });
            const editor = <IEditor>(<any>{});
            expect(shouldPreventDefaultPaste(clipboardData, editor)).toBeFalse();
            expect(shouldPreventDefaultPaste(null, editor)).toBeFalse();
        });

        it('should prevent default on non-Android platforms', () => {
            const clipboardData = <DataTransfer>(<any>{
                items: [{ type: '', kind: 'file' }],
            });
            const editor = <IEditor>(<any>{
                getEnvironment: () => ({ isAndroid: false }),
            });
            expect(shouldPreventDefaultPaste(clipboardData, editor)).toBeTrue();
        });

        it('should prevent default for text or image clipboard data on Android platform', () => {
            const textClipboardData = <DataTransfer>(<any>{
                items: [{ type: 'text/plain', kind: 'string' }],
            });
            const imageClipboardData = <DataTransfer>(<any>{
                items: [{ type: 'image/png', kind: 'file' }],
            });
            const editor = <IEditor>(<any>{
                getEnvironment: () => ({ isAndroid: true }),
            });
            expect(shouldPreventDefaultPaste(textClipboardData, editor)).toBeTrue();
            expect(shouldPreventDefaultPaste(imageClipboardData, editor)).toBeTrue();
        });

        it('should not prevent default for file-only clipboard data on Android platform', () => {
            const clipboardData = <DataTransfer>(<any>{
                items: [{ type: '', kind: 'file' }],
            });
            const editor = <IEditor>(<any>{
                getEnvironment: () => ({ isAndroid: true }),
            });
            expect(shouldPreventDefaultPaste(clipboardData, editor)).toBeFalse();
        });
    });
});
