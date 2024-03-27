import * as cloneModel from 'roosterjs-content-model-dom/lib/modelApi/editing/cloneModel';
import * as createEditorCore from '../../lib/editor/core/createEditorCore';
import * as createEmptyModel from 'roosterjs-content-model-dom/lib/modelApi/creators/createEmptyModel';
import * as transformColor from 'roosterjs-content-model-dom/lib/domUtils/style/transformColor';
import { CachedElementHandler, EditorCore, Rect } from 'roosterjs-content-model-types';
import { ChangeSource } from 'roosterjs-content-model-dom';
import { Editor } from '../../lib/editor/Editor';
import { reducedModelChildProcessor } from '../../lib/override/reducedModelChildProcessor';

describe('Editor', () => {
    let createEditorCoreSpy: jasmine.Spy;
    let updateKnownColorSpy: jasmine.Spy;
    let setContentModelSpy: jasmine.Spy;
    let createEmptyModelSpy: jasmine.Spy;

    beforeEach(() => {
        updateKnownColorSpy = jasmine.createSpy('updateKnownColor');
        createEditorCoreSpy = spyOn(createEditorCore, 'createEditorCore').and.callThrough();
        setContentModelSpy = jasmine.createSpy('setContentModel');
        createEmptyModelSpy = spyOn(createEmptyModel, 'createEmptyModel');
    });

    it('ctor and dispose, no options', () => {
        const div = document.createElement('div');

        createEmptyModelSpy.and.callThrough();

        const editor = new Editor(div);

        expect(createEditorCoreSpy).toHaveBeenCalledWith(div, {});
        expect(editor.isDisposed()).toBeFalse();
        expect(editor.getDocument()).toBe(document);
        expect(editor.isDarkMode()).toBeFalse();
        expect(editor.isInShadowEdit()).toBeFalse();
        expect(createEmptyModelSpy).toHaveBeenCalledWith(undefined);

        editor.dispose();

        expect(editor.isDisposed()).toBeTrue();
        expect(() => {
            editor.focus();
        }).toThrow();
    });

    it('ctor and dispose, with options', () => {
        const div = document.createElement('div');
        const initSpy1 = jasmine.createSpy('init1');
        const initSpy2 = jasmine.createSpy('init2');
        const disposeSpy1 = jasmine.createSpy('dispose1');
        const disposeSpy2 = jasmine.createSpy('dispose2').and.throwError('test');
        const mockedPlugin1 = {
            initialize: initSpy1,
            dispose: disposeSpy1,
        } as any;
        const mockedPlugin2 = {
            initialize: initSpy2,
            dispose: disposeSpy2,
        } as any;
        const setContentModelSpy = jasmine.createSpy('setContentModel');
        const disposeErrorHandlerSpy = jasmine.createSpy('disposeErrorHandler');
        const mockedInitialModel = 'INITMODEL' as any;
        const options = {
            plugins: [mockedPlugin1, mockedPlugin2],
            disposeErrorHandler: disposeErrorHandlerSpy,
            inDarkMode: true,
            initialModel: mockedInitialModel,
            coreApiOverride: {
                setContentModel: setContentModelSpy,
            },
        };

        createEmptyModelSpy.and.callThrough();

        const editor = new Editor(div, options);

        expect(createEditorCoreSpy).toHaveBeenCalledWith(div, options);
        expect(editor.isDisposed()).toBeFalse();
        expect(editor.getDocument()).toBe(document);
        expect(editor.isDarkMode()).toBeTrue();
        expect(editor.isInShadowEdit()).toBeFalse();
        expect(createEmptyModelSpy).not.toHaveBeenCalled();
        expect(setContentModelSpy).toHaveBeenCalledWith(
            jasmine.anything() /*core*/,
            mockedInitialModel,
            { ignoreSelection: true }
        );

        expect(initSpy1).toHaveBeenCalledWith(editor);
        expect(initSpy2).toHaveBeenCalledWith(editor);
        expect(initSpy1).toHaveBeenCalledBefore(initSpy2);
        expect(disposeSpy1).not.toHaveBeenCalled();
        expect(disposeSpy2).not.toHaveBeenCalled();

        editor.dispose();

        expect(editor.isDisposed()).toBeTrue();
        expect(() => {
            editor.focus();
        }).toThrow();

        expect(disposeSpy1).toHaveBeenCalled();
        expect(disposeSpy2).toHaveBeenCalled();
        expect(disposeSpy2).toHaveBeenCalledBefore(disposeSpy1);
        expect(disposeErrorHandlerSpy).toHaveBeenCalledWith(mockedPlugin2, new Error('test'));
    });

    it('getContentModelCopy', () => {
        const div = document.createElement('div');
        const mockedModel = 'MODEL' as any;
        const createContentModelSpy = jasmine
            .createSpy('createContentModel')
            .and.returnValue(mockedModel);
        const resetSpy = jasmine.createSpy('reset');
        const mockedCore = {
            plugins: [],
            darkColorHandler: {
                updateKnownColor: updateKnownColorSpy,
                reset: resetSpy,
            },
            api: {
                createContentModel: createContentModelSpy,
                setContentModel: setContentModelSpy,
            },
        } as any;

        createEditorCoreSpy.and.returnValue(mockedCore);

        const editor = new Editor(div);

        const model1 = editor.getContentModelCopy('connected');

        expect(model1).toBe(mockedModel);
        expect(createContentModelSpy).toHaveBeenCalledWith(mockedCore);

        const model2 = editor.getContentModelCopy('reduced');

        expect(model2).toBe(mockedModel);
        expect(createContentModelSpy).toHaveBeenCalledWith(mockedCore, {
            processorOverride: {
                child: reducedModelChildProcessor,
            },
        });

        editor.dispose();
        expect(() => editor.getContentModelCopy('connected')).toThrow();
        expect(() => editor.getContentModelCopy('reduced')).toThrow();
        expect(resetSpy).toHaveBeenCalledWith();
    });

    it('getContentModelCopy to return disconnected model', () => {
        const div = document.createElement('div');
        const mockedModel = 'MODEL' as any;
        const mockedClonedModel = 'MODEL2' as any;
        const createContentModelSpy = jasmine
            .createSpy('createContentModel')
            .and.returnValue(mockedModel);
        const resetSpy = jasmine.createSpy('reset');
        const mockedCore = {
            plugins: [],
            darkColorHandler: {
                updateKnownColor: updateKnownColorSpy,
                reset: resetSpy,
            },
            lifecycle: {
                isDarkMode: false,
            },
            api: {
                createContentModel: createContentModelSpy,
                setContentModel: setContentModelSpy,
            },
        } as any;

        createEditorCoreSpy.and.returnValue(mockedCore);

        const editor = new Editor(div);

        const cloneModelSpy = spyOn(cloneModel, 'cloneModel').and.returnValue(mockedClonedModel);

        const model = editor.getContentModelCopy('disconnected');

        expect(cloneModelSpy).toHaveBeenCalledWith(mockedModel, {
            includeCachedElement: jasmine.anything() as any,
        });

        const transformColorSpy = spyOn(transformColor, 'transformColor');
        const onClone = cloneModelSpy.calls.argsFor(0)[1]!
            .includeCachedElement as CachedElementHandler;

        const clonedNode = {
            style: {
                backgroundColor: 'red',
            },
        } as any;
        const cloneNodeSpy = jasmine.createSpy('cloneNode').and.returnValue(clonedNode);
        const mockedNode = {
            cloneNode: cloneNodeSpy,
        } as any;

        expect(onClone(mockedNode, 'cache')).toBeUndefined();
        expect(cloneNodeSpy).not.toHaveBeenCalled();

        // clone entity in light mode
        expect(onClone(mockedNode, 'entity')).toBe(clonedNode);
        expect(cloneNodeSpy).toHaveBeenCalledWith(true);

        expect(model).toBe(mockedClonedModel);
        expect(createContentModelSpy).toHaveBeenCalledWith(mockedCore, undefined, undefined);
        expect(transformColorSpy).not.toHaveBeenCalled();

        // Clone in dark mode
        mockedCore.lifecycle.isDarkMode = true;
        expect(onClone(mockedNode, 'entity')).toBe(clonedNode);
        expect(cloneNodeSpy).toHaveBeenCalledWith(true);

        expect(model).toBe(mockedClonedModel);
        expect(createContentModelSpy).toHaveBeenCalledWith(mockedCore, undefined, undefined);
        expect(transformColorSpy).toHaveBeenCalledWith(
            clonedNode,
            true,
            'darkToLight',
            mockedCore.darkColorHandler
        );
        expect(clonedNode).toEqual({
            style: {
                color: 'inherit',
                backgroundColor: 'red',
            },
        });

        editor.dispose();
        expect(() => editor.getContentModelCopy('disconnected')).toThrow();
        expect(resetSpy).toHaveBeenCalledWith();
    });

    it('getEnvironment', () => {
        const div = document.createElement('div');
        const mockedEnvironment = 'ENVIRONMENT' as any;
        const resetSpy = jasmine.createSpy('reset');
        const mockedCore = {
            plugins: [],
            darkColorHandler: {
                updateKnownColor: updateKnownColorSpy,
                reset: resetSpy,
            },
            environment: mockedEnvironment,
            api: { setContentModel: setContentModelSpy },
        } as any;

        createEditorCoreSpy.and.returnValue(mockedCore);

        const editor = new Editor(div);

        const result = editor.getEnvironment();

        expect(result).toBe(mockedEnvironment);

        editor.dispose();
        expect(resetSpy).toHaveBeenCalledWith();
        expect(() => editor.getEnvironment()).toThrow();
    });

    it('getDOMSelection', () => {
        const div = document.createElement('div');
        const mockedSelection = 'SELECTION' as any;
        const getDOMSelectionSpy = jasmine
            .createSpy('getDOMSelection')
            .and.returnValue(mockedSelection);
        const resetSpy = jasmine.createSpy('reset');
        const mockedCore = {
            plugins: [],
            darkColorHandler: {
                updateKnownColor: updateKnownColorSpy,
                reset: resetSpy,
            },
            api: {
                getDOMSelection: getDOMSelectionSpy,
                setContentModel: setContentModelSpy,
            },
        } as any;

        createEditorCoreSpy.and.returnValue(mockedCore);

        const editor = new Editor(div);

        const result = editor.getDOMSelection();

        expect(result).toBe(mockedSelection);
        expect(getDOMSelectionSpy).toHaveBeenCalledWith(mockedCore);

        editor.dispose();
        expect(resetSpy).toHaveBeenCalledWith();
        expect(() => editor.getDOMSelection()).toThrow();
    });

    it('setDOMSelection', () => {
        const div = document.createElement('div');
        const mockedSelection = 'SELECTION' as any;
        const setDOMSelectionSpy = jasmine.createSpy('setDOMSelection');
        const resetSpy = jasmine.createSpy('reset');
        const mockedCore = {
            plugins: [],
            darkColorHandler: {
                updateKnownColor: updateKnownColorSpy,
                reset: resetSpy,
            },
            api: {
                setDOMSelection: setDOMSelectionSpy,
                setContentModel: setContentModelSpy,
            },
        } as any;

        createEditorCoreSpy.and.returnValue(mockedCore);

        const editor = new Editor(div);

        editor.setDOMSelection(null);

        expect(setDOMSelectionSpy).toHaveBeenCalledWith(mockedCore, null);

        editor.setDOMSelection(mockedSelection);

        expect(setDOMSelectionSpy).toHaveBeenCalledWith(mockedCore, mockedSelection);

        editor.dispose();
        expect(resetSpy).toHaveBeenCalledWith();
        expect(() => editor.setDOMSelection(null)).toThrow();
    });

    it('formatContentModel', () => {
        const div = document.createElement('div');
        const mockedFormatter = 'FORMATTER' as any;
        const mockedOptions = 'OPTIONS' as any;
        const formatContentModelSpy = jasmine.createSpy('formatContentModel');
        const resetSpy = jasmine.createSpy('reset');
        const mockedCore = {
            plugins: [],
            darkColorHandler: {
                updateKnownColor: updateKnownColorSpy,
                reset: resetSpy,
            },
            api: {
                formatContentModel: formatContentModelSpy,
                setContentModel: setContentModelSpy,
            },
        } as any;

        createEditorCoreSpy.and.returnValue(mockedCore);

        const editor = new Editor(div);

        editor.formatContentModel(mockedFormatter);

        expect(formatContentModelSpy).toHaveBeenCalledWith(mockedCore, mockedFormatter, undefined);

        editor.formatContentModel(mockedFormatter, mockedOptions);

        expect(formatContentModelSpy).toHaveBeenCalledWith(
            mockedCore,
            mockedFormatter,
            mockedOptions
        );

        editor.dispose();
        expect(resetSpy).toHaveBeenCalledWith();
        expect(() => editor.formatContentModel(mockedFormatter)).toThrow();
    });

    it('getPendingFormat', () => {
        const div = document.createElement('div');
        const mockedFormat = 'FORMAT' as any;
        const resetSpy = jasmine.createSpy('reset');
        const mockedCore = {
            plugins: [],
            darkColorHandler: {
                updateKnownColor: updateKnownColorSpy,
                reset: resetSpy,
            },
            format: {},
            api: {
                setContentModel: setContentModelSpy,
            },
        } as any;

        createEditorCoreSpy.and.returnValue(mockedCore);

        const editor = new Editor(div);

        const result1 = editor.getPendingFormat();

        expect(result1).toBeNull();

        mockedCore.format.pendingFormat = {
            format: mockedFormat,
        };
        const result2 = editor.getPendingFormat();

        expect(result2).toBe(mockedFormat);

        editor.dispose();
        expect(resetSpy).toHaveBeenCalledWith();
        expect(() => editor.getPendingFormat()).toThrow();
    });

    it('formatContentModel', () => {
        const div = document.createElement('div');
        const mockedSnapshot = 'SNAPSHOT' as any;
        const addUndoSnapshotSpy = jasmine
            .createSpy('addUndoSnapshot')
            .and.returnValue(mockedSnapshot);
        const resetSpy = jasmine.createSpy('reset');
        const mockedCore = {
            plugins: [],
            darkColorHandler: {
                updateKnownColor: updateKnownColorSpy,
                reset: resetSpy,
            },
            api: {
                addUndoSnapshot: addUndoSnapshotSpy,
                setContentModel: setContentModelSpy,
            },
        } as any;

        createEditorCoreSpy.and.returnValue(mockedCore);

        const editor = new Editor(div);

        const snapshot = editor.takeSnapshot();

        expect(addUndoSnapshotSpy).toHaveBeenCalledWith(mockedCore, false, undefined);
        expect(snapshot).toBe(mockedSnapshot);

        editor.dispose();
        expect(resetSpy).toHaveBeenCalledWith();
        expect(() => editor.takeSnapshot()).toThrow();
    });

    it('getDOMHelper', () => {
        const div = document.createElement('div');
        const mockedDOMHelper = 'DOMHELPER' as any;
        const resetSpy = jasmine.createSpy('reset');
        const mockedCore = {
            plugins: [],
            domHelper: mockedDOMHelper,
            darkColorHandler: {
                updateKnownColor: updateKnownColorSpy,
                reset: resetSpy,
            },
            api: { setContentModel: setContentModelSpy },
        } as any;

        createEditorCoreSpy.and.returnValue(mockedCore);

        const editor = new Editor(div);
        const domHelper = editor.getDOMHelper();

        expect(domHelper).toBe(mockedDOMHelper);

        editor.dispose();
        expect(resetSpy).toHaveBeenCalledWith();
        expect(() => editor.takeSnapshot()).toThrow();
    });

    it('takeSnapshot', () => {
        const div = document.createElement('div');
        const mockedSnapshot = 'SNAPSHOT' as any;
        const resetSpy = jasmine.createSpy('reset');
        const addUndoSnapshotSpy = jasmine
            .createSpy('addUndoSnapshot')
            .and.returnValue(mockedSnapshot);
        const mockedCore = {
            plugins: [],
            darkColorHandler: {
                updateKnownColor: updateKnownColorSpy,
                reset: resetSpy,
            },
            api: { addUndoSnapshot: addUndoSnapshotSpy, setContentModel: setContentModelSpy },
        } as any;

        createEditorCoreSpy.and.returnValue(mockedCore);

        const editor = new Editor(div);
        const snapshot = editor.takeSnapshot();

        expect(snapshot).toEqual(mockedSnapshot);
        expect(addUndoSnapshotSpy).toHaveBeenCalledTimes(1);
        expect(addUndoSnapshotSpy).toHaveBeenCalledWith(mockedCore, false, undefined);

        const mockedState = 'STATE' as any;

        editor.takeSnapshot(mockedState);
        expect(addUndoSnapshotSpy).toHaveBeenCalledTimes(2);
        expect(addUndoSnapshotSpy).toHaveBeenCalledWith(mockedCore, false, [mockedState]);
    });

    it('restoreSnapshot', () => {
        const div = document.createElement('div');
        const mockedSnapshot = 'SNAPSHOT' as any;
        const restoreUndoSnapshotSpy = jasmine.createSpy('restoreUndoSnapshot');
        const resetSpy = jasmine.createSpy('reset');
        const mockedCore = {
            plugins: [],
            darkColorHandler: {
                updateKnownColor: updateKnownColorSpy,
                reset: resetSpy,
            },
            api: {
                restoreUndoSnapshot: restoreUndoSnapshotSpy,
                setContentModel: setContentModelSpy,
            },
        } as any;

        createEditorCoreSpy.and.returnValue(mockedCore);

        const editor = new Editor(div);

        editor.restoreSnapshot(mockedSnapshot);

        expect(restoreUndoSnapshotSpy).toHaveBeenCalledWith(mockedCore, mockedSnapshot);

        editor.dispose();
        expect(resetSpy).toHaveBeenCalledWith();
        expect(() => editor.restoreSnapshot(mockedSnapshot)).toThrow();
    });

    it('focus', () => {
        const div = document.createElement('div');
        const focusSpy = jasmine.createSpy('focus');
        const resetSpy = jasmine.createSpy('reset');
        const mockedCore = {
            plugins: [],
            darkColorHandler: {
                updateKnownColor: updateKnownColorSpy,
                reset: resetSpy,
            },
            api: {
                focus: focusSpy,
                setContentModel: setContentModelSpy,
            },
        } as any;

        createEditorCoreSpy.and.returnValue(mockedCore);

        const editor = new Editor(div);

        editor.focus();
        expect(focusSpy).toHaveBeenCalledWith(mockedCore);

        editor.dispose();
        expect(resetSpy).toHaveBeenCalledWith();
        expect(() => editor.focus()).toThrow();
    });

    it('hasFocus', () => {
        const div = document.createElement('div');
        const mockedResult = 'RESULT' as any;
        const hasFocusSpy = jasmine.createSpy('hasFocus').and.returnValue(mockedResult);
        const resetSpy = jasmine.createSpy('reset');
        const mockedCore = {
            plugins: [],
            darkColorHandler: {
                updateKnownColor: updateKnownColorSpy,
                reset: resetSpy,
            },
            api: {
                setContentModel: setContentModelSpy,
            },
            domHelper: {
                hasFocus: hasFocusSpy,
            },
        } as any;

        createEditorCoreSpy.and.returnValue(mockedCore);

        const editor = new Editor(div);

        const result = editor.hasFocus();

        expect(result).toBe(mockedResult);
        expect(hasFocusSpy).toHaveBeenCalledWith();

        editor.dispose();
        expect(resetSpy).toHaveBeenCalledWith();
        expect(() => editor.hasFocus()).toThrow();
    });

    it('triggerEvent', () => {
        const div = document.createElement('div');
        const mockedEventData = {
            event: 'Mocked',
        } as any;
        const triggerEventSpy = jasmine.createSpy('triggerEvent').and.callFake((core, data) => {
            data.a = 'b';
        });
        const resetSpy = jasmine.createSpy('reset');
        const mockedCore = {
            plugins: [],
            darkColorHandler: {
                updateKnownColor: updateKnownColorSpy,
                reset: resetSpy,
            },
            api: {
                triggerEvent: triggerEventSpy,
                setContentModel: setContentModelSpy,
            },
        } as any;

        createEditorCoreSpy.and.returnValue(mockedCore);

        const editor = new Editor(div);
        const mockedEventType = 'EVENTTYPE' as any;

        const result = editor.triggerEvent<any>(mockedEventType, mockedEventData, true);

        expect(result).toEqual({
            eventType: mockedEventType,
            event: 'Mocked',
            a: 'b',
        } as any);
        expect(triggerEventSpy).toHaveBeenCalledWith(
            mockedCore,
            {
                eventType: mockedEventType,
                event: 'Mocked',
                a: 'b',
            } as any,
            true
        );

        editor.dispose();
        expect(resetSpy).toHaveBeenCalledWith();
        expect(() => editor.triggerEvent(mockedEventType, mockedEventData, true)).toThrow();
    });

    it('attachDomEvent', () => {
        const div = document.createElement('div');
        const mockedDisposer = 'DISPOSER' as any;
        const attachDomEventSpy = jasmine
            .createSpy('attachDomEvent')
            .and.returnValue(mockedDisposer);
        const resetSpy = jasmine.createSpy('reset');
        const mockedCore = {
            plugins: [],
            darkColorHandler: {
                updateKnownColor: updateKnownColorSpy,
                reset: resetSpy,
            },
            api: {
                attachDomEvent: attachDomEventSpy,
                setContentModel: setContentModelSpy,
            },
        } as any;

        createEditorCoreSpy.and.returnValue(mockedCore);

        const mockedEventMap = 'EVENTMAP' as any;
        const editor = new Editor(div);

        const result = editor.attachDomEvent(mockedEventMap);

        expect(result).toBe(mockedDisposer);
        expect(attachDomEventSpy).toHaveBeenCalledWith(mockedCore, mockedEventMap);

        editor.dispose();
        expect(resetSpy).toHaveBeenCalledWith();
        expect(() => editor.attachDomEvent(mockedEventMap)).toThrow();
    });

    it('getSnapshotsManager', () => {
        const div = document.createElement('div');
        const mockedSnapshotManager = 'MANAGER' as any;
        const resetSpy = jasmine.createSpy('reset');
        const mockedCore = {
            plugins: [],
            darkColorHandler: {
                updateKnownColor: updateKnownColorSpy,
                reset: resetSpy,
            },
            undo: {
                snapshotsManager: mockedSnapshotManager,
                setContentModel: setContentModelSpy,
            },
            api: { setContentModel: setContentModelSpy },
        } as any;

        createEditorCoreSpy.and.returnValue(mockedCore);

        const editor = new Editor(div);

        const result = editor.getSnapshotsManager();

        expect(result).toBe(mockedSnapshotManager);

        editor.dispose();
        expect(resetSpy).toHaveBeenCalledWith();
        expect(() => editor.getSnapshotsManager()).toThrow();
    });

    it('shadow edit', () => {
        const div = document.createElement('div');
        const switchShadowEditSpy = jasmine
            .createSpy('switchShadowEdit')
            .and.callFake((core, isOn) => {
                mockedCore.lifecycle.shadowEditFragment = isOn;
            });
        const resetSpy = jasmine.createSpy('reset');
        const mockedCore = {
            plugins: [],
            darkColorHandler: {
                updateKnownColor: updateKnownColorSpy,
                reset: resetSpy,
            },
            lifecycle: {},
            api: {
                switchShadowEdit: switchShadowEditSpy,
                setContentModel: setContentModelSpy,
            },
        } as any;

        createEditorCoreSpy.and.returnValue(mockedCore);

        const editor = new Editor(div);

        expect(editor.isInShadowEdit()).toBeFalse();

        editor.startShadowEdit();

        expect(editor.isInShadowEdit()).toBeTrue();
        expect(switchShadowEditSpy).toHaveBeenCalledTimes(1);
        expect(switchShadowEditSpy).toHaveBeenCalledWith(mockedCore, true);

        editor.stopShadowEdit();

        expect(editor.isInShadowEdit()).toBeFalse();
        expect(switchShadowEditSpy).toHaveBeenCalledTimes(2);
        expect(switchShadowEditSpy).toHaveBeenCalledWith(mockedCore, false);

        editor.dispose();
        expect(resetSpy).toHaveBeenCalledWith();
        expect(() => editor.isInShadowEdit()).toThrow();
        expect(() => editor.startShadowEdit()).toThrow();
        expect(() => editor.stopShadowEdit()).toThrow();
    });

    it('getColorManager', () => {
        const div = document.createElement('div');
        const resetSpy = jasmine.createSpy('reset');
        const mockedColorHandler = {
            updateKnownColor: updateKnownColorSpy,
            reset: resetSpy,
        } as any;
        const mockedCore = {
            plugins: [],
            darkColorHandler: mockedColorHandler,
            api: { setContentModel: setContentModelSpy },
        } as any;

        createEditorCoreSpy.and.returnValue(mockedCore);

        const editor = new Editor(div);

        const result = editor.getColorManager();

        expect(updateKnownColorSpy).not.toHaveBeenCalled();
        expect(result).toBe(mockedColorHandler);

        editor.dispose();

        expect(resetSpy).toHaveBeenCalledWith();
        expect(() => editor.getColorManager()).toThrow();
    });

    it('dark mode', () => {
        const transformColorSpy = spyOn(transformColor, 'transformColor');
        const triggerEventSpy = jasmine.createSpy('triggerEvent').and.callFake((core, event) => {
            mockedCore.lifecycle.isDarkMode = event.source == ChangeSource.SwitchToDarkMode;
        });
        const div = document.createElement('div');
        const resetSpy = jasmine.createSpy('reset');
        const mockedColorHandler = {
            updateKnownColor: updateKnownColorSpy,
            reset: resetSpy,
        } as any;
        const mockedCore = {
            plugins: [],
            darkColorHandler: mockedColorHandler,
            physicalRoot: div,
            logicalRoot: div,
            lifecycle: {
                isDarkMode: false,
            },
            api: {
                triggerEvent: triggerEventSpy,
                setContentModel: setContentModelSpy,
            },
        } as any;

        createEditorCoreSpy.and.returnValue(mockedCore);

        const editor = new Editor(div);

        expect(editor.isDarkMode()).toBeFalse();

        editor.setDarkModeState(false);

        expect(editor.isDarkMode()).toBeFalse();
        expect(transformColorSpy).not.toHaveBeenCalled();
        expect(triggerEventSpy).not.toHaveBeenCalled();

        editor.setDarkModeState(true);

        expect(editor.isDarkMode()).toBeTrue();
        expect(transformColorSpy).toHaveBeenCalledTimes(1);
        expect(transformColorSpy).toHaveBeenCalledWith(
            div,
            false,
            'lightToDark',
            mockedColorHandler
        );
        expect(mockedCore.lifecycle.isDarkMode).toEqual(true);
        expect(triggerEventSpy).toHaveBeenCalledTimes(1);
        expect(triggerEventSpy).toHaveBeenCalledWith(
            mockedCore,
            {
                eventType: 'contentChanged',
                source: ChangeSource.SwitchToDarkMode,
            },
            true
        );

        editor.setDarkModeState(false);

        expect(editor.isDarkMode()).toBeFalse();
        expect(transformColorSpy).toHaveBeenCalledTimes(2);
        expect(transformColorSpy).toHaveBeenCalledWith(
            div,
            false,
            'darkToLight',
            mockedColorHandler
        );
        expect(triggerEventSpy).toHaveBeenCalledTimes(2);
        expect(triggerEventSpy).toHaveBeenCalledWith(
            mockedCore,
            {
                eventType: 'contentChanged',
                source: ChangeSource.SwitchToLightMode,
            },
            true
        );
        expect(mockedCore.lifecycle.isDarkMode).toEqual(false);

        editor.dispose();
        expect(resetSpy).toHaveBeenCalledWith();
        expect(() => editor.isDarkMode()).toThrow();
        expect(() => editor.setDarkModeState()).toThrow();
    });

    it('getScrollContainer', () => {
        const div = document.createElement('div');
        const mockedScrollContainer = 'SCROLLCONTAINER' as any;
        const resetSpy = jasmine.createSpy('reset');
        const mockedCore = {
            plugins: [],
            darkColorHandler: {
                updateKnownColor: updateKnownColorSpy,
                reset: resetSpy,
            },
            api: { setContentModel: setContentModelSpy },
            domEvent: { scrollContainer: mockedScrollContainer },
        } as any;

        createEditorCoreSpy.and.returnValue(mockedCore);

        const editor = new Editor(div);

        const result = editor.getScrollContainer();

        expect(result).toBe(mockedScrollContainer);

        editor.dispose();
        expect(resetSpy).toHaveBeenCalledWith();
        expect(() => editor.getScrollContainer()).toThrow();
    });

    it('getVisibleViewport', () => {
        const div = document.createElement('div');
        const mockedScrollContainer: Rect = { top: 0, bottom: 100, left: 0, right: 100 };
        const resetSpy = jasmine.createSpy('reset');
        const mockedCore = {
            plugins: [],
            darkColorHandler: {
                updateKnownColor: updateKnownColorSpy,
                reset: resetSpy,
            },
            api: {
                setContentModel: setContentModelSpy,
                getVisibleViewport: (core: EditorCore) => {
                    return mockedScrollContainer;
                },
            },
            domEvent: { scrollContainer: mockedScrollContainer },
        } as any;

        createEditorCoreSpy.and.returnValue(mockedCore);

        const editor = new Editor(div);

        const result = editor.getVisibleViewport();

        expect(result).toBe(mockedScrollContainer);

        editor.dispose();
        expect(resetSpy).toHaveBeenCalledWith();
        expect(() => editor.getVisibleViewport()).toThrow();
    });

    it('setEditorStyle', () => {
        const div = document.createElement('div');
        const mockedScrollContainer: Rect = { top: 0, bottom: 100, left: 0, right: 100 };
        const resetSpy = jasmine.createSpy('reset');
        const setEditorStyleSpy = jasmine.createSpy('setEditorStyle');
        const mockedCore = {
            plugins: [],
            darkColorHandler: {
                updateKnownColor: updateKnownColorSpy,
                reset: resetSpy,
            },
            api: {
                setContentModel: setContentModelSpy,
                setEditorStyle: setEditorStyleSpy,
            },
            domEvent: { scrollContainer: mockedScrollContainer },
        } as any;

        createEditorCoreSpy.and.returnValue(mockedCore);

        const editor = new Editor(div);

        editor.setEditorStyle('key', 'rule', ['rule1', 'rule2']);

        expect(setEditorStyleSpy).toHaveBeenCalledWith(mockedCore, 'key', 'rule', [
            'rule1',
            'rule2',
        ]);

        editor.dispose();
        expect(resetSpy).toHaveBeenCalledWith();
        expect(() => editor.getVisibleViewport()).toThrow();
    });
});
