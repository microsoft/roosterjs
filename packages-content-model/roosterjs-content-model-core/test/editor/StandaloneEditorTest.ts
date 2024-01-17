import * as createStandaloneEditorCore from '../../lib/editor/createStandaloneEditorCore';
import * as transformColor from '../../lib/publicApi/color/transformColor';
import { ChangeSource } from '../../lib/constants/ChangeSource';
import { StandaloneEditor } from '../../lib/editor/StandaloneEditor';

describe('StandaloneEditor', () => {
    let createEditorCoreSpy: jasmine.Spy;

    beforeEach(() => {
        createEditorCoreSpy = spyOn(
            createStandaloneEditorCore,
            'createStandaloneEditorCore'
        ).and.callThrough();
    });

    it('ctor and dispose, no options', () => {
        const div = document.createElement('div');
        const editor = new StandaloneEditor(div);

        expect(createEditorCoreSpy).toHaveBeenCalledWith(div, {});
        expect(editor.isDisposed()).toBeFalse();
        expect(editor.getDocument()).toBe(document);
        expect(editor.isDarkMode()).toBeFalse();
        expect(editor.isInIME()).toBeFalse();
        expect(editor.isInShadowEdit()).toBeFalse();

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

        const disposeErrorHandlerSpy = jasmine.createSpy('disposeErrorHandler');
        const options = {
            plugins: [mockedPlugin1, mockedPlugin2],
            disposeErrorHandler: disposeErrorHandlerSpy,
            inDarkMode: true,
        };

        const editor = new StandaloneEditor(div, options);

        expect(createEditorCoreSpy).toHaveBeenCalledWith(div, options);
        expect(editor.isDisposed()).toBeFalse();
        expect(editor.getDocument()).toBe(document);
        expect(editor.isDarkMode()).toBeTrue();
        expect(editor.isInIME()).toBeFalse();
        expect(editor.isInShadowEdit()).toBeFalse();

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

    it('createContentModel', () => {
        const div = document.createElement('div');
        const mockedModel = 'MODEL' as any;
        const createContentModelSpy = jasmine
            .createSpy('createContentModel')
            .and.returnValue(mockedModel);
        const mockedCore = {
            plugins: [],
            darkColorHandler: {
                reset: () => {},
            },
            api: {
                createContentModel: createContentModelSpy,
            },
        } as any;

        createEditorCoreSpy.and.returnValue(mockedCore);

        const editor = new StandaloneEditor(div);

        const model1 = editor.createContentModel();

        expect(model1).toBe(mockedModel);
        expect(createContentModelSpy).toHaveBeenCalledWith(mockedCore, undefined, undefined);

        const mockedOptions = 'OPTIONS' as any;
        const selectionOverride = 'SELECTION' as any;

        const model2 = editor.createContentModel(mockedOptions, selectionOverride);

        expect(model2).toBe(mockedModel);
        expect(createContentModelSpy).toHaveBeenCalledWith(
            mockedCore,
            mockedOptions,
            selectionOverride
        );

        editor.dispose();
        expect(() => editor.createContentModel()).toThrow();
    });

    it('setContentModel', () => {
        const div = document.createElement('div');
        const setContentModelSpy = jasmine.createSpy('setContentModel');
        const mockedCore = {
            plugins: [],
            darkColorHandler: {
                reset: () => {},
            },
            api: {
                setContentModel: setContentModelSpy,
            },
        } as any;

        createEditorCoreSpy.and.returnValue(mockedCore);

        const mockedModel = 'MODEL' as any;
        const editor = new StandaloneEditor(div);

        editor.setContentModel(mockedModel);

        expect(setContentModelSpy).toHaveBeenCalledWith(
            mockedCore,
            mockedModel,
            undefined,
            undefined
        );

        const mockedOptions = 'OPTIONS' as any;
        const mockedOnNodeCreated = 'ONNODECREATED' as any;

        editor.setContentModel(mockedModel, mockedOptions, mockedOnNodeCreated);

        expect(setContentModelSpy).toHaveBeenCalledWith(
            mockedCore,
            mockedModel,
            mockedOptions,
            mockedOnNodeCreated
        );

        editor.dispose();
        expect(() => editor.setContentModel(mockedModel)).toThrow();
    });

    it('getEnvironment', () => {
        const div = document.createElement('div');
        const mockedEnvironment = 'ENVIRONMENT' as any;
        const mockedCore = {
            plugins: [],
            darkColorHandler: {
                reset: () => {},
            },
            environment: mockedEnvironment,
        } as any;

        createEditorCoreSpy.and.returnValue(mockedCore);

        const editor = new StandaloneEditor(div);

        const result = editor.getEnvironment();

        expect(result).toBe(mockedEnvironment);

        editor.dispose();
        expect(() => editor.getEnvironment()).toThrow();
    });

    it('getDOMSelection', () => {
        const div = document.createElement('div');
        const mockedSelection = 'SELECTION' as any;
        const getDOMSelectionSpy = jasmine
            .createSpy('getDOMSelection')
            .and.returnValue(mockedSelection);
        const mockedCore = {
            plugins: [],
            darkColorHandler: {
                reset: () => {},
            },
            api: {
                getDOMSelection: getDOMSelectionSpy,
            },
        } as any;

        createEditorCoreSpy.and.returnValue(mockedCore);

        const editor = new StandaloneEditor(div);

        const result = editor.getDOMSelection();

        expect(result).toBe(mockedSelection);
        expect(getDOMSelectionSpy).toHaveBeenCalledWith(mockedCore);

        editor.dispose();
        expect(() => editor.getDOMSelection()).toThrow();
    });

    it('setDOMSelection', () => {
        const div = document.createElement('div');
        const mockedSelection = 'SELECTION' as any;
        const setDOMSelectionSpy = jasmine.createSpy('setDOMSelection');
        const mockedCore = {
            plugins: [],
            darkColorHandler: {
                reset: () => {},
            },
            api: {
                setDOMSelection: setDOMSelectionSpy,
            },
        } as any;

        createEditorCoreSpy.and.returnValue(mockedCore);

        const editor = new StandaloneEditor(div);

        editor.setDOMSelection(null);

        expect(setDOMSelectionSpy).toHaveBeenCalledWith(mockedCore, null);

        editor.setDOMSelection(mockedSelection);

        expect(setDOMSelectionSpy).toHaveBeenCalledWith(mockedCore, mockedSelection);

        editor.dispose();
        expect(() => editor.setDOMSelection(null)).toThrow();
    });

    it('formatContentModel', () => {
        const div = document.createElement('div');
        const mockedFormatter = 'FORMATTER' as any;
        const mockedOptions = 'OPTIONS' as any;
        const formatContentModelSpy = jasmine.createSpy('formatContentModel');
        const mockedCore = {
            plugins: [],
            darkColorHandler: {
                reset: () => {},
            },
            api: {
                formatContentModel: formatContentModelSpy,
            },
        } as any;

        createEditorCoreSpy.and.returnValue(mockedCore);

        const editor = new StandaloneEditor(div);

        editor.formatContentModel(mockedFormatter);

        expect(formatContentModelSpy).toHaveBeenCalledWith(mockedCore, mockedFormatter, undefined);

        editor.formatContentModel(mockedFormatter, mockedOptions);

        expect(formatContentModelSpy).toHaveBeenCalledWith(
            mockedCore,
            mockedFormatter,
            mockedOptions
        );

        editor.dispose();
        expect(() => editor.formatContentModel(mockedFormatter)).toThrow();
    });

    it('getPendingFormat', () => {
        const div = document.createElement('div');
        const mockedFormat = 'FORMAT' as any;
        const mockedCore = {
            plugins: [],
            darkColorHandler: {
                reset: () => {},
            },
            format: {},
        } as any;

        createEditorCoreSpy.and.returnValue(mockedCore);

        const editor = new StandaloneEditor(div);

        const result1 = editor.getPendingFormat();

        expect(result1).toBeNull();

        mockedCore.format.pendingFormat = {
            format: mockedFormat,
        };
        const result2 = editor.getPendingFormat();

        expect(result2).toBe(mockedFormat);

        editor.dispose();
        expect(() => editor.getPendingFormat()).toThrow();
    });

    it('formatContentModel', () => {
        const div = document.createElement('div');
        const mockedSnapshot = 'SNAPSHOT' as any;
        const addUndoSnapshotSpy = jasmine
            .createSpy('addUndoSnapshot')
            .and.returnValue(mockedSnapshot);
        const mockedCore = {
            plugins: [],
            darkColorHandler: {
                reset: () => {},
            },
            api: {
                addUndoSnapshot: addUndoSnapshotSpy,
            },
        } as any;

        createEditorCoreSpy.and.returnValue(mockedCore);

        const editor = new StandaloneEditor(div);

        const snapshot = editor.takeSnapshot();

        expect(addUndoSnapshotSpy).toHaveBeenCalledWith(mockedCore, false);
        expect(snapshot).toBe(mockedSnapshot);

        editor.dispose();
        expect(() => editor.takeSnapshot()).toThrow();
    });

    it('restoreSnapshot', () => {
        const div = document.createElement('div');
        const mockedSnapshot = 'SNAPSHOT' as any;
        const restoreUndoSnapshotSpy = jasmine.createSpy('restoreUndoSnapshot');
        const mockedCore = {
            plugins: [],
            darkColorHandler: {
                reset: () => {},
            },
            api: {
                restoreUndoSnapshot: restoreUndoSnapshotSpy,
            },
        } as any;

        createEditorCoreSpy.and.returnValue(mockedCore);

        const editor = new StandaloneEditor(div);

        editor.restoreSnapshot(mockedSnapshot);

        expect(restoreUndoSnapshotSpy).toHaveBeenCalledWith(mockedCore, mockedSnapshot);

        editor.dispose();
        expect(() => editor.restoreSnapshot(mockedSnapshot)).toThrow();
    });

    it('focus', () => {
        const div = document.createElement('div');
        const focusSpy = jasmine.createSpy('focus');
        const mockedCore = {
            plugins: [],
            darkColorHandler: {
                reset: () => {},
            },
            api: {
                focus: focusSpy,
            },
        } as any;

        createEditorCoreSpy.and.returnValue(mockedCore);

        const editor = new StandaloneEditor(div);

        editor.focus();
        expect(focusSpy).toHaveBeenCalledWith(mockedCore);

        editor.dispose();

        expect(() => editor.focus()).toThrow();
    });

    it('hasFocus', () => {
        const div = document.createElement('div');
        const mockedResult = 'RESULT' as any;
        const hasFocusSpy = jasmine.createSpy('hasFocus').and.returnValue(mockedResult);
        const mockedCore = {
            plugins: [],
            darkColorHandler: {
                reset: () => {},
            },
            api: {
                hasFocus: hasFocusSpy,
            },
        } as any;

        createEditorCoreSpy.and.returnValue(mockedCore);

        const editor = new StandaloneEditor(div);

        const result = editor.hasFocus();

        expect(result).toBe(mockedResult);
        expect(hasFocusSpy).toHaveBeenCalledWith(mockedCore);

        editor.dispose();

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
        const mockedCore = {
            plugins: [],
            darkColorHandler: {
                reset: () => {},
            },
            api: {
                triggerEvent: triggerEventSpy,
            },
        } as any;

        createEditorCoreSpy.and.returnValue(mockedCore);

        const editor = new StandaloneEditor(div);
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

        expect(() => editor.triggerEvent(mockedEventType, mockedEventData, true)).toThrow();
    });

    it('attachDomEvent', () => {
        const div = document.createElement('div');
        const mockedDisposer = 'DISPOSER' as any;
        const attachDomEventSpy = jasmine
            .createSpy('attachDomEvent')
            .and.returnValue(mockedDisposer);
        const mockedCore = {
            plugins: [],
            darkColorHandler: {
                reset: () => {},
            },
            api: {
                attachDomEvent: attachDomEventSpy,
            },
        } as any;

        createEditorCoreSpy.and.returnValue(mockedCore);

        const mockedEventMap = 'EVENTMAP' as any;
        const editor = new StandaloneEditor(div);

        const result = editor.attachDomEvent(mockedEventMap);

        expect(result).toBe(mockedDisposer);
        expect(attachDomEventSpy).toHaveBeenCalledWith(mockedCore, mockedEventMap);

        editor.dispose();

        expect(() => editor.attachDomEvent(mockedEventMap)).toThrow();
    });

    it('getSnapshotsManager', () => {
        const div = document.createElement('div');
        const mockedSnapshotManager = 'MANAGER' as any;
        const mockedCore = {
            plugins: [],
            darkColorHandler: {
                reset: () => {},
            },
            undo: {
                snapshotsManager: mockedSnapshotManager,
            },
        } as any;

        createEditorCoreSpy.and.returnValue(mockedCore);

        const editor = new StandaloneEditor(div);

        const result = editor.getSnapshotsManager();

        expect(result).toBe(mockedSnapshotManager);

        editor.dispose();

        expect(() => editor.getSnapshotsManager()).toThrow();
    });

    it('shadow edit', () => {
        const div = document.createElement('div');
        const switchShadowEditSpy = jasmine
            .createSpy('switchShadowEdit')
            .and.callFake((core, isOn) => {
                mockedCore.lifecycle.shadowEditFragment = isOn;
            });
        const mockedCore = {
            plugins: [],
            darkColorHandler: {
                reset: () => {},
            },
            lifecycle: {},
            api: {
                switchShadowEdit: switchShadowEditSpy,
            },
        } as any;

        createEditorCoreSpy.and.returnValue(mockedCore);

        const editor = new StandaloneEditor(div);

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

        expect(() => editor.isInShadowEdit()).toThrow();
        expect(() => editor.startShadowEdit()).toThrow();
        expect(() => editor.stopShadowEdit()).toThrow();
    });

    it('pasteFromClipboard', () => {
        const div = document.createElement('div');
        const pasteSpy = jasmine.createSpy('paste');
        const mockedCore = {
            plugins: [],
            darkColorHandler: {
                reset: () => {},
            },
            api: {
                paste: pasteSpy,
            },
        } as any;

        createEditorCoreSpy.and.returnValue(mockedCore);

        const mockedClipboardData = 'ClipboardData' as any;
        const mockedPasteType = 'PASTETYPE' as any;

        const editor = new StandaloneEditor(div);

        editor.pasteFromClipboard(mockedClipboardData);

        expect(pasteSpy).toHaveBeenCalledWith(mockedCore, mockedClipboardData, 'normal');

        editor.pasteFromClipboard(mockedClipboardData, mockedPasteType);

        expect(pasteSpy).toHaveBeenCalledWith(mockedCore, mockedClipboardData, mockedPasteType);

        editor.dispose();

        expect(() => editor.pasteFromClipboard(mockedClipboardData)).toThrow();
    });

    it('getDarkColorHandler', () => {
        const div = document.createElement('div');
        const resetSpy = jasmine.createSpy('reset');
        const mockedColorHandler = {
            reset: resetSpy,
        } as any;
        const mockedCore = {
            plugins: [],
            darkColorHandler: mockedColorHandler,
        } as any;

        createEditorCoreSpy.and.returnValue(mockedCore);

        const editor = new StandaloneEditor(div);

        const result = editor.getDarkColorHandler();

        expect(resetSpy).not.toHaveBeenCalled();
        expect(result).toBe(mockedColorHandler);

        editor.dispose();

        expect(resetSpy).toHaveBeenCalledWith();
        expect(() => editor.getDarkColorHandler()).toThrow();
    });

    it('isNodeInEditor', () => {
        const mockedResult = 'RESULT' as any;
        const containsSpy = jasmine.createSpy('contains').and.returnValue(mockedResult);
        const div = {
            contains: containsSpy,
        } as any;
        const mockedCore = {
            plugins: [],
            darkColorHandler: {
                reset: () => {},
            },
            contentDiv: div,
        } as any;

        createEditorCoreSpy.and.returnValue(mockedCore);

        const editor = new StandaloneEditor(div);
        const mockedNode = 'NODE' as any;

        const result = editor.isNodeInEditor(mockedNode);

        expect(result).toBe(mockedResult);
        expect(containsSpy).toHaveBeenCalledWith(mockedNode);

        editor.dispose();

        expect(() => editor.isNodeInEditor(mockedNode)).toThrow();
    });

    it('dark mode', () => {
        const transformColorSpy = spyOn(transformColor, 'transformColor');
        const triggerEventSpy = jasmine.createSpy('triggerEvent').and.callFake((core, event) => {
            mockedCore.lifecycle.isDarkMode = event.source == ChangeSource.SwitchToDarkMode;
        });
        const div = document.createElement('div');
        const mockedColorHandler = {
            reset: () => {},
        } as any;
        const mockedCore = {
            plugins: [],
            darkColorHandler: mockedColorHandler,
            contentDiv: div,
            lifecycle: {
                isDarkMode: false,
            },
            api: {
                triggerEvent: triggerEventSpy,
            },
        } as any;

        createEditorCoreSpy.and.returnValue(mockedCore);

        const editor = new StandaloneEditor(div);

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
            true,
            'lightToDark',
            mockedColorHandler
        );
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
            true,
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

        editor.dispose();

        expect(() => editor.isDarkMode()).toThrow();
        expect(() => editor.setDarkModeState()).toThrow();
    });
});
