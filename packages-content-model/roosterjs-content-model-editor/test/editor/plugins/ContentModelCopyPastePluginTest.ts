import * as cloneModelFile from '../../../lib/modelApi/common/cloneModel';
import * as contentModelToDomFile from 'roosterjs-content-model-dom/lib/modelToDom/contentModelToDom';
import * as deleteSelectionsFile from '../../../lib/modelApi/edit/deleteSelection';
import * as extractClipboardItemsFile from 'roosterjs-editor-dom/lib/clipboard/extractClipboardItems';
import * as iterateSelectionsFile from '../../../lib/modelApi/selection/iterateSelections';
import * as normalizeContentModel from 'roosterjs-content-model-dom/lib/modelApi/common/normalizeContentModel';
import * as PasteFile from '../../../lib/publicApi/utils/paste';
import { createModelToDomContext } from 'roosterjs-content-model-dom';
import { DeleteResult } from '../../../lib/modelApi/edit/utils/DeleteSelectionStep';
import { DOMSelection } from 'roosterjs-content-model-types';
import { IContentModelEditor } from '../../../lib/publicTypes/IContentModelEditor';
import { setEntityElementClasses } from 'roosterjs-content-model-dom/test/domUtils/entityUtilTest';
import createRange, * as createRangeF from 'roosterjs-editor-dom/lib/selection/createRange';
import ContentModelCopyPastePlugin, {
    onNodeCreated,
} from '../../../lib/editor/corePlugins/ContentModelCopyPastePlugin';
import {
    ClipboardData,
    ColorTransformDirection,
    DOMEventHandlerFunction,
    IEditor,
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

    let selectionValue: DOMSelection;
    let getDOMSelectionSpy: jasmine.Spy;
    let createContentModelSpy: jasmine.Spy;
    let triggerPluginEventSpy: jasmine.Spy;
    let focusSpy: jasmine.Spy;
    let undoSnapShotSpy: jasmine.Spy;
    let setDOMSelectionSpy: jasmine.Spy;
    let setContentModelSpy: jasmine.Spy;

    let isDisposed: jasmine.Spy;
    let pasteSpy: jasmine.Spy;
    let cloneModelSpy: jasmine.Spy;
    let transformToDarkColorSpy: jasmine.Spy;

    beforeEach(() => {
        div = document.createElement('div');
        getDOMSelectionSpy = jasmine
            .createSpy('getDOMSelection')
            .and.callFake(() => selectionValue);
        createContentModelSpy = jasmine
            .createSpy('createContentModelSpy')
            .and.returnValue(modelValue);
        triggerPluginEventSpy = jasmine.createSpy('triggerPluginEventSpy');
        focusSpy = jasmine.createSpy('focusSpy');
        undoSnapShotSpy = jasmine.createSpy('undoSnapShotSpy');
        setDOMSelectionSpy = jasmine.createSpy('setDOMSelection');
        setContentModelSpy = jasmine.createSpy('setContentModel');
        pasteSpy = jasmine.createSpy('paste_');
        isDisposed = jasmine.createSpy('isDisposed');

        cloneModelSpy = spyOn(cloneModelFile, 'cloneModel').and.callFake(
            (model: any) => pasteModelValue
        );
        transformToDarkColorSpy = jasmine.createSpy('transformToDarkColor');

        plugin = new ContentModelCopyPastePlugin({
            allowedCustomPasteType,
        });
        editor = <IContentModelEditor>(<any>{
            addDomEventHandler: (
                nameOrMap: string | Record<string, DOMEventHandlerFunction>,
                handler?: DOMEventHandlerFunction
            ) => {
                domEvents = ((typeof nameOrMap == 'string'
                    ? { [nameOrMap]: handler! }
                    : nameOrMap) as any) as Record<string, DOMEventHandlerFunction>;
            },
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
            getDOMSelection: getDOMSelectionSpy,
            setDOMSelection: setDOMSelectionSpy,
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
            transformToDarkColor: transformToDarkColorSpy,
            isDisposed,
        });

        plugin.initialize(editor);
    });

    describe('Copy |', () => {
        it('Selection Collapsed', () => {
            selectionValue = <DOMSelection>{
                type: 'range',
                range: { collapsed: true } as any,
            };

            createContentModelSpy.and.callThrough();
            triggerPluginEventSpy.and.callThrough();
            focusSpy.and.callThrough();
            undoSnapShotSpy.and.callThrough();
            setDOMSelectionSpy.and.callThrough();
            setContentModelSpy.and.callThrough();

            domEvents.copy?.(<Event>{});

            expect(getDOMSelectionSpy).toHaveBeenCalled();
            expect(createContentModelSpy).not.toHaveBeenCalled();
            expect(triggerPluginEventSpy).not.toHaveBeenCalled();
            expect(focusSpy).not.toHaveBeenCalled();
            expect(undoSnapShotSpy).not.toHaveBeenCalled();
            expect(setDOMSelectionSpy).not.toHaveBeenCalled();
            expect(setContentModelSpy).not.toHaveBeenCalled();
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
            focusSpy.and.callThrough();
            setDOMSelectionSpy.and.callThrough();
            setContentModelSpy.and.callThrough();

            // Act
            domEvents.copy?.(<Event>{});

            // Assert
            expect(getDOMSelectionSpy).toHaveBeenCalled();
            expect(deleteSelectionsFile.deleteSelection).not.toHaveBeenCalled();
            expect(contentModelToDomFile.contentModelToDom).toHaveBeenCalledWith(
                document,
                div,
                pasteModelValue,
                createModelToDomContext(),
                onNodeCreated
            );
            expect(createContentModelSpy).toHaveBeenCalled();
            expect(triggerPluginEventSpy).toHaveBeenCalledTimes(1);
            expect(iterateSelectionsFile.iterateSelections).not.toHaveBeenCalled();
            expect(focusSpy).toHaveBeenCalled();
            expect(setDOMSelectionSpy).toHaveBeenCalledWith(selectionValue);

            // On Cut Spy
            expect(undoSnapShotSpy).not.toHaveBeenCalled();
            expect(setContentModelSpy).not.toHaveBeenCalledWith();
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

            spyOn(createRangeF, 'default').and.callThrough();
            spyOn(deleteSelectionsFile, 'deleteSelection');
            spyOn(contentModelToDomFile, 'contentModelToDom').and.callFake(() => {
                const container = document.createElement('div');
                container.append(table);

                div.appendChild(container);
                return selectionValue;
            });
            spyOn(iterateSelectionsFile, 'iterateSelections').and.returnValue(undefined);

            triggerPluginEventSpy.and.callThrough();
            focusSpy.and.callThrough();
            setDOMSelectionSpy.and.callThrough();
            setContentModelSpy.and.callThrough();

            // Act
            domEvents.copy?.(<Event>{});

            // Assert
            expect(createRangeF.default).toHaveBeenCalledWith(<any>table.parentElement);
            expect(getDOMSelectionSpy).toHaveBeenCalled();
            expect(deleteSelectionsFile.deleteSelection).not.toHaveBeenCalled();
            expect(contentModelToDomFile.contentModelToDom).toHaveBeenCalledWith(
                document,
                div,
                pasteModelValue,
                createModelToDomContext(),
                onNodeCreated
            );
            expect(createContentModelSpy).toHaveBeenCalled();
            expect(triggerPluginEventSpy).toHaveBeenCalledTimes(1);
            expect(iterateSelectionsFile.iterateSelections).toHaveBeenCalled();
            expect(focusSpy).toHaveBeenCalled();
            expect(setDOMSelectionSpy).toHaveBeenCalledWith(selectionValue);

            // On Cut Spy
            expect(undoSnapShotSpy).not.toHaveBeenCalled();
            expect(setContentModelSpy).not.toHaveBeenCalledWith();
        });

        it('Selection not Collapsed and image selection', () => {
            // Arrange
            const image = document.createElement('image');
            image.id = 'image';
            selectionValue = <DOMSelection>{
                type: 'image',
                image,
            };

            spyOn(createRangeF, 'default').and.callThrough();
            spyOn(deleteSelectionsFile, 'deleteSelection');
            spyOn(contentModelToDomFile, 'contentModelToDom').and.callFake(() => {
                div.appendChild(image);
                return selectionValue;
            });
            spyOn(iterateSelectionsFile, 'iterateSelections').and.returnValue(undefined);

            triggerPluginEventSpy.and.callThrough();
            focusSpy.and.callThrough();
            setDOMSelectionSpy.and.callThrough();
            setContentModelSpy.and.callThrough();

            // Act
            domEvents.copy?.(<Event>{});

            // Assert
            expect(createRangeF.default).toHaveBeenCalledWith(<any>image);
            expect(getDOMSelectionSpy).toHaveBeenCalled();
            expect(deleteSelectionsFile.deleteSelection).not.toHaveBeenCalled();
            expect(contentModelToDomFile.contentModelToDom).toHaveBeenCalledWith(
                document,
                div,
                pasteModelValue,
                createModelToDomContext(),
                onNodeCreated
            );
            expect(createContentModelSpy).toHaveBeenCalled();
            expect(triggerPluginEventSpy).toHaveBeenCalledTimes(1);
            expect(focusSpy).toHaveBeenCalled();
            expect(setDOMSelectionSpy).toHaveBeenCalledWith(selectionValue);

            // On Cut Spy
            expect(undoSnapShotSpy).not.toHaveBeenCalled();
            expect(setContentModelSpy).not.toHaveBeenCalledWith();
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
            focusSpy.and.callThrough();
            setDOMSelectionSpy.and.callThrough();
            setContentModelSpy.and.callThrough();

            editor.isDarkMode = () => true;

            cloneModelSpy.and.callFake((model, options) => {
                expect(model).toEqual(modelValue);
                expect(typeof options.includeCachedElement).toBe('function');

                const cloneCache = options.includeCachedElement(wrapper, 'cache');
                const cloneEntity = options.includeCachedElement(wrapper, 'entity');

                expect(cloneCache).toBeUndefined();
                expect(cloneEntity.outerHTML).toBe(
                    '<span class="_Entity _EType_Entity _EId_Entity _EReadonly_1" contenteditable="false" style="color: inherit; background-color: inherit;"></span>'
                );
                expect(cloneEntity).not.toBe(wrapper);
                expect(transformToDarkColorSpy).toHaveBeenCalledTimes(1);
                expect(transformToDarkColorSpy).toHaveBeenCalledWith(
                    cloneEntity,
                    ColorTransformDirection.DarkToLight
                );

                return pasteModelValue;
            });

            // Act
            domEvents.copy?.(<Event>{});

            // Assert
            expect(getDOMSelectionSpy).toHaveBeenCalled();
            expect(deleteSelectionsFile.deleteSelection).not.toHaveBeenCalled();
            expect(contentModelToDomFile.contentModelToDom).toHaveBeenCalledWith(
                document,
                div,
                pasteModelValue,
                createModelToDomContext(),
                onNodeCreated
            );
            expect(createContentModelSpy).toHaveBeenCalled();
            expect(triggerPluginEventSpy).toHaveBeenCalledTimes(1);
            expect(focusSpy).toHaveBeenCalled();
            expect(setDOMSelectionSpy).toHaveBeenCalledWith(selectionValue);
            expect(cloneModelSpy).toHaveBeenCalledTimes(1);

            // On Cut Spy
            expect(undoSnapShotSpy).not.toHaveBeenCalled();
            expect(setContentModelSpy).not.toHaveBeenCalledWith();
            expect(iterateSelectionsFile.iterateSelections).toHaveBeenCalledTimes(0);
        });
    });

    describe('Cut |', () => {
        it('Selection Collapsed', () => {
            // Arrange
            selectionValue = <DOMSelection>{
                type: 'range',
                range: { collapsed: true } as any,
            };

            createContentModelSpy.and.callThrough();
            triggerPluginEventSpy.and.callThrough();
            focusSpy.and.callThrough();
            undoSnapShotSpy.and.callThrough();
            setDOMSelectionSpy.and.callThrough();
            setContentModelSpy.and.callThrough();

            // Act
            domEvents.cut?.(<Event>{});

            // Assert
            expect(getDOMSelectionSpy).toHaveBeenCalled();
            expect(createContentModelSpy).not.toHaveBeenCalled();
            expect(triggerPluginEventSpy).not.toHaveBeenCalled();
            expect(focusSpy).not.toHaveBeenCalled();
            expect(undoSnapShotSpy).not.toHaveBeenCalled();
            expect(setDOMSelectionSpy).not.toHaveBeenCalled();
            expect(setContentModelSpy).not.toHaveBeenCalled();
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
            spyOn(contentModelToDomFile, 'contentModelToDom').and.returnValue(selectionValue);

            triggerPluginEventSpy.and.callThrough();
            focusSpy.and.callThrough();
            setDOMSelectionSpy.and.callThrough();
            setContentModelSpy.and.callThrough();

            // Act
            domEvents.cut?.(<Event>{});

            // Assert
            expect(getDOMSelectionSpy).toHaveBeenCalled();
            expect(deleteSelectionSpy.calls.argsFor(0)[0]).toEqual(modelValue);
            expect(contentModelToDomFile.contentModelToDom).toHaveBeenCalledWith(
                document,
                div,
                pasteModelValue,
                createModelToDomContext(),
                onNodeCreated
            );
            expect(createContentModelSpy).toHaveBeenCalled();
            expect(triggerPluginEventSpy).toHaveBeenCalledTimes(2);
            expect(focusSpy).toHaveBeenCalled();
            expect(setDOMSelectionSpy).toHaveBeenCalledWith(selectionValue);

            // On Cut Spy
            expect(undoSnapShotSpy).toHaveBeenCalled();
            expect(setContentModelSpy).toHaveBeenCalledWith(modelValue, undefined);
        });

        it('Selection not Collapsed and table selection', () => {
            // Arrange
            const table = document.createElement('table');
            table.id = 'table';
            selectionValue = <DOMSelection>{
                type: 'table',
                table,
            };

            spyOn(createRangeF, 'default').and.callThrough();
            spyOn(deleteSelectionsFile, 'deleteSelection').and.returnValue({
                deleteResult: DeleteResult.Range,
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
            focusSpy.and.callThrough();
            setDOMSelectionSpy.and.callThrough();
            setContentModelSpy.and.callThrough();

            // Act
            domEvents.cut?.(<Event>{});

            // Assert
            expect(createRangeF.default).toHaveBeenCalledWith(<any>table.parentElement);
            expect(getDOMSelectionSpy).toHaveBeenCalled();
            expect(contentModelToDomFile.contentModelToDom).toHaveBeenCalledWith(
                document,
                div,
                pasteModelValue,
                createModelToDomContext(),
                onNodeCreated
            );
            expect(createContentModelSpy).toHaveBeenCalled();
            expect(triggerPluginEventSpy).toHaveBeenCalledTimes(2);
            expect(iterateSelectionsFile.iterateSelections).toHaveBeenCalled();
            expect(focusSpy).toHaveBeenCalled();
            expect(setDOMSelectionSpy).toHaveBeenCalledWith(selectionValue);

            // On Cut Spy
            expect(undoSnapShotSpy).toHaveBeenCalled();
            expect(deleteSelectionsFile.deleteSelection).toHaveBeenCalled();
            expect(setContentModelSpy).toHaveBeenCalledWith(modelValue, undefined);
            expect(normalizeContentModel.normalizeContentModel).toHaveBeenCalledWith(modelValue);
        });

        it('Selection not Collapsed and image selection', () => {
            // Arrange
            const image = document.createElement('image');
            image.id = 'image';
            selectionValue = <DOMSelection>{
                type: 'image',
                image,
            };

            spyOn(createRangeF, 'default').and.callThrough();
            spyOn(deleteSelectionsFile, 'deleteSelection').and.returnValue({
                deleteResult: DeleteResult.Range,
                insertPoint: null!,
            });
            spyOn(contentModelToDomFile, 'contentModelToDom').and.callFake(() => {
                div.appendChild(image);
                return selectionValue;
            });
            spyOn(iterateSelectionsFile, 'iterateSelections').and.returnValue(undefined);
            spyOn(normalizeContentModel, 'normalizeContentModel');

            triggerPluginEventSpy.and.callThrough();
            focusSpy.and.callThrough();
            setDOMSelectionSpy.and.callThrough();
            setContentModelSpy.and.callThrough();

            // Act
            domEvents.cut?.(<Event>{});

            // Assert
            expect(createRangeF.default).toHaveBeenCalledWith(<any>image);
            expect(getDOMSelectionSpy).toHaveBeenCalled();
            expect(contentModelToDomFile.contentModelToDom).toHaveBeenCalledWith(
                document,
                div,
                pasteModelValue,
                createModelToDomContext(),
                onNodeCreated
            );
            expect(createContentModelSpy).toHaveBeenCalled();
            expect(triggerPluginEventSpy).toHaveBeenCalledTimes(2);
            expect(focusSpy).toHaveBeenCalled();
            expect(setDOMSelectionSpy).toHaveBeenCalledWith(selectionValue);

            // On Cut Spy
            expect(undoSnapShotSpy).toHaveBeenCalled();
            expect(deleteSelectionsFile.deleteSelection).toHaveBeenCalled();
            expect(setContentModelSpy).toHaveBeenCalledWith(modelValue, undefined);
            expect(normalizeContentModel.normalizeContentModel).toHaveBeenCalledWith(modelValue);
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
                },
                true
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
                },
                true
            );
            expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
        });
    });

    it('onNodeCreated with table', () => {
        const div = document.createElement('div');
        const table = document.createElement('table');

        div.appendChild(table);

        onNodeCreated(null!, table);

        expect(div.innerHTML).toEqual('<div><table></table></div>');
    });

    it('onNodeCreated with readonly element', () => {
        const div = document.createElement('div');
        div.contentEditable = 'true';

        const span = document.createElement('span');
        div.appendChild(span);
        span.contentEditable = 'false';

        onNodeCreated(null!, span);

        expect(div.innerHTML).toBe('<span></span>');
    });
});
