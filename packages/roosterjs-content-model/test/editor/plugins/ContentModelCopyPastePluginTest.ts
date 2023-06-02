import * as cloneModelFile from '../../../lib/modelApi/common/cloneModel';
import * as contentModelToDomFile from '../../../lib/modelToDom/contentModelToDom';
import * as deleteSelectionsFile from '../../../lib/modelApi/edit/deleteSelection';
import * as extractClipboardItemsFile from 'roosterjs-editor-dom/lib/clipboard/extractClipboardItems';
import * as iterateSelectionsFile from '../../../lib/modelApi/selection/iterateSelections';
import * as PasteFile from '../../../lib/publicApi/utils/paste';
import { IContentModelEditor } from '../../../lib/publicTypes';
import ContentModelCopyPastePlugin, {
    onNodeCreated,
} from '../../../lib/editor/corePlugins/ContentModelCopyPastePlugin';
import {
    ClipboardData,
    DOMEventHandlerFunction,
    IEditor,
    SelectionRangeEx,
    SelectionRangeTypes,
} from 'roosterjs-editor-types';

const modelValue = 'model' as any;
const darkColorHandler = 'darkColorHandler' as any;
const pasteModelValue = 'pasteModelValue' as any;
const insertPointValue = 'insertPoint' as any;
const deleteResultValue = 'deleteResult' as any;

const allowedCustomPasteType = ['Test'];

describe('ContentModelCopyPastePlugin |', () => {
    let editor: IEditor = null!;
    let plugin: ContentModelCopyPastePlugin;
    let domEvents: Record<string, DOMEventHandlerFunction> = {};
    let div: HTMLDivElement;

    let selectionRangeExValue: SelectionRangeEx;
    let getSelectionRangeEx: jasmine.Spy;
    let createContentModelSpy: jasmine.Spy;
    let triggerPluginEventSpy: jasmine.Spy;
    let focusSpy: jasmine.Spy;
    let undoSnapShotSpy: jasmine.Spy;
    let selectSpy: jasmine.Spy;
    let setContentModelSpy: jasmine.Spy;
    let getSelectionRange: jasmine.Spy;

    let isDisposed: jasmine.Spy;
    let pasteSpy: jasmine.Spy;

    beforeEach(() => {
        div = document.createElement('div');
        getSelectionRangeEx = jasmine
            .createSpy('selectRangeExSpy')
            .and.callFake(() => selectionRangeExValue);
        createContentModelSpy = jasmine
            .createSpy('createContentModelSpy')
            .and.returnValue(modelValue);
        triggerPluginEventSpy = jasmine.createSpy('triggerPluginEventSpy');
        focusSpy = jasmine.createSpy('focusSpy');
        undoSnapShotSpy = jasmine.createSpy('undoSnapShotSpy');
        selectSpy = jasmine.createSpy('selectSpy');
        setContentModelSpy = jasmine.createSpy('setContentModelSpy');
        getSelectionRange = jasmine.createSpy('selectionRange');
        pasteSpy = jasmine.createSpy('paste_');
        isDisposed = jasmine.createSpy('isDisposed');

        spyOn(cloneModelFile, 'cloneModel').and.callFake((model: any) => pasteModelValue);

        plugin = new ContentModelCopyPastePlugin({
            allowedCustomPasteType,
        });
        editor = <IContentModelEditor>(<any>{
            getSelectionRange,
            addDomEventHandler: (
                nameOrMap: string | Record<string, DOMEventHandlerFunction>,
                handler?: DOMEventHandlerFunction
            ) => {
                domEvents = ((typeof nameOrMap == 'string'
                    ? { [nameOrMap]: handler! }
                    : nameOrMap) as any) as Record<string, DOMEventHandlerFunction>;
            },
            getSelectionRangeEx,
            createContentModel: (options: any) => createContentModelSpy(options),
            triggerPluginEvent(eventType: any, data: any, broadcast: any) {
                triggerPluginEventSpy(eventType, data, broadcast);
                return data;
            },
            runAsync(callback: any) {
                callback(editor);
            },
            focus() {
                focusSpy();
            },
            addUndoSnapshot(callback: any, changeSource: any, canUndoByBackspace: any) {
                callback?.();
                undoSnapShotSpy(callback, changeSource, canUndoByBackspace);
            },
            select(a1: any, a2: any, a3: any, a4: any) {
                selectSpy(a1, a2, a3, a4);
            },
            setContentModel(model: any, option: any) {
                setContentModelSpy(model, option);
            },
            getDocument() {
                return document;
            },
            getCustomData<HTMLDivElement>(
                key: string,
                getter?: (() => HTMLDivElement) | undefined,
                disposer?: ((value: HTMLDivElement) => void) | undefined
            ) {
                return div;
            },
            getDarkColorHandler: () => {
                return darkColorHandler;
            },
            isDarkMode: () => {
                return false;
            },
            paste: (ar1: any) => {
                pasteSpy(ar1);
            },
            isDisposed,
        });

        plugin.initialize(editor);
    });

    describe('Copy |', () => {
        it('Selection Collapsed', () => {
            selectionRangeExValue = <SelectionRangeEx>{
                type: SelectionRangeTypes.Normal,
                ranges: [],
                areAllCollapsed: true,
            };

            createContentModelSpy.and.callThrough();
            triggerPluginEventSpy.and.callThrough();
            focusSpy.and.callThrough();
            undoSnapShotSpy.and.callThrough();
            selectSpy.and.callThrough();
            setContentModelSpy.and.callThrough();

            domEvents.copy?.(<Event>{});

            expect(getSelectionRangeEx).toHaveBeenCalled();
            expect(createContentModelSpy).not.toHaveBeenCalled();
            expect(triggerPluginEventSpy).not.toHaveBeenCalled();
            expect(focusSpy).not.toHaveBeenCalled();
            expect(undoSnapShotSpy).not.toHaveBeenCalled();
            expect(selectSpy).not.toHaveBeenCalled();
            expect(setContentModelSpy).not.toHaveBeenCalled();
        });

        it('Selection not Collapsed and normal selection', () => {
            // Arrange
            selectionRangeExValue = <SelectionRangeEx>{
                type: SelectionRangeTypes.Normal,
                ranges: [new Range()],
                areAllCollapsed: false,
            };

            spyOn(deleteSelectionsFile, 'deleteSelection');
            spyOn(contentModelToDomFile, 'default').and.returnValue(selectionRangeExValue);
            spyOn(iterateSelectionsFile, 'iterateSelections').and.returnValue(undefined);

            triggerPluginEventSpy.and.callThrough();
            focusSpy.and.callThrough();
            selectSpy.and.callThrough();
            setContentModelSpy.and.callThrough();

            // Act
            domEvents.copy?.(<Event>{});

            // Assert
            expect(getSelectionRangeEx).toHaveBeenCalled();
            expect(deleteSelectionsFile.deleteSelection).not.toHaveBeenCalled();
            expect(contentModelToDomFile.default).toHaveBeenCalledWith(
                document,
                div,
                pasteModelValue,
                {
                    isDarkMode: false,
                    darkColorHandler: darkColorHandler,
                },
                { onNodeCreated }
            );
            expect(createContentModelSpy).toHaveBeenCalled();
            expect(triggerPluginEventSpy).toHaveBeenCalledTimes(1);
            expect(iterateSelectionsFile.iterateSelections).not.toHaveBeenCalled();
            expect(focusSpy).toHaveBeenCalled();
            expect(selectSpy).toHaveBeenCalledWith(
                selectionRangeExValue,
                undefined,
                undefined,
                undefined
            );

            // On Cut Spy
            expect(undoSnapShotSpy).not.toHaveBeenCalled();
            expect(setContentModelSpy).not.toHaveBeenCalledWith();
        });

        it('Selection not Collapsed and table selection', () => {
            // Arrange
            const table = document.createElement('table');
            table.id = 'image';
            // Arrange
            selectionRangeExValue = <SelectionRangeEx>{
                type: SelectionRangeTypes.TableSelection,
                ranges: [new Range()],
                areAllCollapsed: false,
                coordinates: {},
                table,
            };

            spyOn(deleteSelectionsFile, 'deleteSelection');
            spyOn(contentModelToDomFile, 'default').and.callFake(() => {
                const container = document.createElement('div');
                container.append(table);

                div.appendChild(container);
                return selectionRangeExValue;
            });
            spyOn(iterateSelectionsFile, 'iterateSelections').and.returnValue(undefined);

            triggerPluginEventSpy.and.callThrough();
            focusSpy.and.callThrough();
            selectSpy.and.callThrough();
            setContentModelSpy.and.callThrough();

            // Act
            domEvents.copy?.(<Event>{});

            // Assert
            expect(getSelectionRangeEx).toHaveBeenCalled();
            expect(deleteSelectionsFile.deleteSelection).not.toHaveBeenCalled();
            expect(contentModelToDomFile.default).toHaveBeenCalledWith(
                document,
                div,
                pasteModelValue,
                {
                    isDarkMode: false,
                    darkColorHandler: darkColorHandler,
                },
                { onNodeCreated }
            );
            expect(createContentModelSpy).toHaveBeenCalled();
            expect(triggerPluginEventSpy).toHaveBeenCalledTimes(1);
            expect(iterateSelectionsFile.iterateSelections).toHaveBeenCalled();
            expect(focusSpy).toHaveBeenCalled();
            expect(selectSpy).toHaveBeenCalledWith(
                selectionRangeExValue,
                undefined,
                undefined,
                undefined
            );

            // On Cut Spy
            expect(undoSnapShotSpy).not.toHaveBeenCalled();
            expect(setContentModelSpy).not.toHaveBeenCalledWith();
        });

        it('Selection not Collapsed and image selection', () => {
            // Arrange
            const image = document.createElement('image');
            image.id = 'image';
            selectionRangeExValue = <SelectionRangeEx>{
                type: SelectionRangeTypes.ImageSelection,
                ranges: [new Range()],
                areAllCollapsed: false,
                image,
            };

            spyOn(deleteSelectionsFile, 'deleteSelection');
            spyOn(contentModelToDomFile, 'default').and.callFake(() => {
                div.appendChild(image);
                return selectionRangeExValue;
            });
            spyOn(iterateSelectionsFile, 'iterateSelections').and.returnValue(undefined);

            triggerPluginEventSpy.and.callThrough();
            focusSpy.and.callThrough();
            selectSpy.and.callThrough();
            setContentModelSpy.and.callThrough();

            // Act
            domEvents.copy?.(<Event>{});

            // Assert
            expect(getSelectionRangeEx).toHaveBeenCalled();
            expect(deleteSelectionsFile.deleteSelection).not.toHaveBeenCalled();
            expect(contentModelToDomFile.default).toHaveBeenCalledWith(
                document,
                div,
                pasteModelValue,
                {
                    isDarkMode: false,
                    darkColorHandler: darkColorHandler,
                },
                { onNodeCreated }
            );
            expect(createContentModelSpy).toHaveBeenCalled();
            expect(triggerPluginEventSpy).toHaveBeenCalledTimes(1);
            expect(focusSpy).toHaveBeenCalled();
            expect(selectSpy).toHaveBeenCalledWith(
                selectionRangeExValue,
                undefined,
                undefined,
                undefined
            );

            // On Cut Spy
            expect(undoSnapShotSpy).not.toHaveBeenCalled();
            expect(setContentModelSpy).not.toHaveBeenCalledWith();
            expect(iterateSelectionsFile.iterateSelections).toHaveBeenCalledTimes(0);
        });
    });

    describe('Cut |', () => {
        it('Selection Collapsed', () => {
            // Arrange
            selectionRangeExValue = <SelectionRangeEx>{
                type: SelectionRangeTypes.Normal,
                ranges: [],
                areAllCollapsed: true,
            };

            createContentModelSpy.and.callThrough();
            triggerPluginEventSpy.and.callThrough();
            focusSpy.and.callThrough();
            undoSnapShotSpy.and.callThrough();
            selectSpy.and.callThrough();
            setContentModelSpy.and.callThrough();

            // Act
            domEvents.cut?.(<Event>{});

            // Assert
            expect(getSelectionRangeEx).toHaveBeenCalled();
            expect(createContentModelSpy).not.toHaveBeenCalled();
            expect(triggerPluginEventSpy).not.toHaveBeenCalled();
            expect(focusSpy).not.toHaveBeenCalled();
            expect(undoSnapShotSpy).not.toHaveBeenCalled();
            expect(selectSpy).not.toHaveBeenCalled();
            expect(setContentModelSpy).not.toHaveBeenCalled();
        });

        it('Selection not Collapsed', () => {
            // Arrange
            selectionRangeExValue = <SelectionRangeEx>{
                type: SelectionRangeTypes.Normal,
                ranges: [new Range()],
                areAllCollapsed: false,
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
            spyOn(contentModelToDomFile, 'default').and.returnValue(selectionRangeExValue);

            triggerPluginEventSpy.and.callThrough();
            focusSpy.and.callThrough();
            selectSpy.and.callThrough();
            setContentModelSpy.and.callThrough();

            // Act
            domEvents.cut?.(<Event>{});

            // Assert
            expect(getSelectionRangeEx).toHaveBeenCalled();
            expect(deleteSelectionSpy.calls.argsFor(0)[0]).toEqual(modelValue);
            expect(contentModelToDomFile.default).toHaveBeenCalledWith(
                document,
                div,
                pasteModelValue,
                {
                    isDarkMode: false,
                    darkColorHandler: darkColorHandler,
                },
                { onNodeCreated }
            );
            expect(createContentModelSpy).toHaveBeenCalled();
            expect(triggerPluginEventSpy).toHaveBeenCalledTimes(1);
            expect(focusSpy).toHaveBeenCalled();
            expect(selectSpy).toHaveBeenCalledWith(
                selectionRangeExValue,
                undefined,
                undefined,
                undefined
            );

            // On Cut Spy
            expect(undoSnapShotSpy).toHaveBeenCalled();
            expect(setContentModelSpy).toHaveBeenCalledWith(modelValue, undefined);
        });

        it('Selection not Collapsed and table selection', () => {
            // Arrange
            const table = document.createElement('table');
            table.id = 'image';
            selectionRangeExValue = <SelectionRangeEx>{
                type: SelectionRangeTypes.TableSelection,
                ranges: [new Range()],
                areAllCollapsed: false,
                coordinates: {},
                table,
            };

            spyOn(deleteSelectionsFile, 'deleteSelection');
            spyOn(contentModelToDomFile, 'default').and.callFake(() => {
                const container = document.createElement('div');
                container.append(table);

                div.appendChild(container);
                return selectionRangeExValue;
            });
            spyOn(iterateSelectionsFile, 'iterateSelections').and.returnValue(undefined);

            triggerPluginEventSpy.and.callThrough();
            focusSpy.and.callThrough();
            selectSpy.and.callThrough();
            setContentModelSpy.and.callThrough();

            // Act
            domEvents.cut?.(<Event>{});

            // Assert
            expect(getSelectionRangeEx).toHaveBeenCalled();
            expect(contentModelToDomFile.default).toHaveBeenCalledWith(
                document,
                div,
                pasteModelValue,
                {
                    isDarkMode: false,
                    darkColorHandler: darkColorHandler,
                },
                { onNodeCreated }
            );
            expect(createContentModelSpy).toHaveBeenCalled();
            expect(triggerPluginEventSpy).toHaveBeenCalledTimes(1);
            expect(iterateSelectionsFile.iterateSelections).toHaveBeenCalled();
            expect(focusSpy).toHaveBeenCalled();
            expect(selectSpy).toHaveBeenCalledWith(
                selectionRangeExValue,
                undefined,
                undefined,
                undefined
            );

            // On Cut Spy
            expect(undoSnapShotSpy).toHaveBeenCalled();
            expect(deleteSelectionsFile.deleteSelection).toHaveBeenCalled();
            expect(setContentModelSpy).toHaveBeenCalledWith(modelValue, undefined);
        });

        it('Selection not Collapsed and image selection', () => {
            // Arrange
            const image = document.createElement('image');
            image.id = 'image';
            selectionRangeExValue = <SelectionRangeEx>{
                type: SelectionRangeTypes.ImageSelection,
                ranges: [new Range()],
                areAllCollapsed: false,
                image,
            };

            spyOn(deleteSelectionsFile, 'deleteSelection');
            spyOn(contentModelToDomFile, 'default').and.callFake(() => {
                div.appendChild(image);
                return selectionRangeExValue;
            });
            spyOn(iterateSelectionsFile, 'iterateSelections').and.returnValue(undefined);

            triggerPluginEventSpy.and.callThrough();
            focusSpy.and.callThrough();
            selectSpy.and.callThrough();
            setContentModelSpy.and.callThrough();

            // Act
            domEvents.cut?.(<Event>{});

            // Assert
            expect(getSelectionRangeEx).toHaveBeenCalled();
            expect(contentModelToDomFile.default).toHaveBeenCalledWith(
                document,
                div,
                pasteModelValue,
                {
                    isDarkMode: false,
                    darkColorHandler: darkColorHandler,
                },
                { onNodeCreated }
            );
            expect(createContentModelSpy).toHaveBeenCalled();
            expect(triggerPluginEventSpy).toHaveBeenCalledTimes(1);
            expect(focusSpy).toHaveBeenCalled();
            expect(selectSpy).toHaveBeenCalledWith(
                selectionRangeExValue,
                undefined,
                undefined,
                undefined
            );

            // On Cut Spy
            expect(undoSnapShotSpy).toHaveBeenCalled();
            expect(deleteSelectionsFile.deleteSelection).toHaveBeenCalled();
            expect(setContentModelSpy).toHaveBeenCalledWith(modelValue, undefined);
        });
    });

    describe('Paste |', () => {
        let clipboardData = <ClipboardData>{};

        it('Handle', () => {
            editor.isFeatureEnabled = () => true;
            spyOn(PasteFile, 'default').and.callFake(() => {});
            const preventDefaultSpy = jasmine.createSpy('preventDefaultPaste');
            let clipboardEvent = <ClipboardEvent>{
                clipboardData: <DataTransfer>(<any>{
                    items: [<DataTransferItem>{}],
                }),
                preventDefault() {
                    preventDefaultSpy();
                },
            };
            spyOn(extractClipboardItemsFile, 'default').and.returnValue(<Promise<ClipboardData>>{
                then: (cb: (value: ClipboardData) => void | PromiseLike<void>) => {
                    cb(clipboardData);
                },
            });
            isDisposed.and.returnValue(false);

            domEvents.paste?.(clipboardEvent);

            expect(pasteSpy).not.toHaveBeenCalledWith(clipboardData);
            expect(PasteFile.default).toHaveBeenCalled();
            expect(extractClipboardItemsFile.default).toHaveBeenCalledWith(
                Array.from(clipboardEvent.clipboardData!.items),
                {
                    allowedCustomPasteType,
                }
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

            spyOn(extractClipboardItemsFile, 'default').and.returnValue(<Promise<ClipboardData>>{
                then: (cb: (value: ClipboardData) => void | PromiseLike<void>) => {
                    cb(clipboardData);
                },
            });
            isDisposed.and.returnValue(true);

            domEvents.paste?.(clipboardEvent);

            expect(pasteSpy).not.toHaveBeenCalled();
            expect(extractClipboardItemsFile.default).toHaveBeenCalledWith(
                Array.from(clipboardEvent.clipboardData!.items),
                {
                    allowedCustomPasteType,
                }
            );
            expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
        });
    });
});
