import * as createUndoSnapshotsService from '../../lib/editor/UndoSnapshotsServiceImpl';
import { ChangeSource } from '../../lib/constants/ChangeSource';
import { createUndoPlugin } from '../../lib/corePlugin/UndoPlugin';
import { IStandaloneEditor, Snapshot, UndoPluginState } from 'roosterjs-content-model-types';
import {
    IEditor,
    PluginEventType,
    PluginWithState,
    UndoSnapshotsService,
} from 'roosterjs-editor-types';

describe('UndoPlugin', () => {
    let editor: IEditor & IStandaloneEditor;
    let createUndoSnapshotsServiceSpy: jasmine.Spy;
    let getDOMSelectionSpy: jasmine.Spy;
    let canUndoAutoCompleteSpy: jasmine.Spy;
    let isInIMESpy: jasmine.Spy;
    let getUndoStateSpy: jasmine.Spy;
    let takeSnapshotSpy: jasmine.Spy;
    let undoSpy: jasmine.Spy;
    let clearRedoSpy: jasmine.Spy;
    let mockedUndoSnapshotsService: UndoSnapshotsService<Snapshot>;

    beforeEach(() => {
        getDOMSelectionSpy = jasmine.createSpy('getDOMSelection');
        canUndoAutoCompleteSpy = jasmine.createSpy('canUndoAutoComplete');
        isInIMESpy = jasmine.createSpy('isInIME');
        getUndoStateSpy = jasmine.createSpy('getUndoState');
        takeSnapshotSpy = jasmine.createSpy('takeUndoSnapshot');
        undoSpy = jasmine.createSpy('undo');
        clearRedoSpy = jasmine.createSpy('clearRedo');

        mockedUndoSnapshotsService = {
            canUndoAutoComplete: canUndoAutoCompleteSpy,
            clearRedo: clearRedoSpy,
        } as any;

        createUndoSnapshotsServiceSpy = spyOn(
            createUndoSnapshotsService,
            'createUndoSnapshotsService'
        ).and.returnValue(mockedUndoSnapshotsService);

        editor = {
            getDOMSelection: getDOMSelectionSpy,
            isInIME: isInIMESpy,
            getUndoState: getUndoStateSpy,
            takeSnapshot: takeSnapshotSpy,
            undo: undoSpy,
        } as any;
    });

    describe('Ctor', () => {
        it('ctor without option', () => {
            const plugin = createUndoPlugin({});
            const state = plugin.getState();

            expect(state).toEqual({
                snapshotsService: mockedUndoSnapshotsService,
                isRestoring: false,
                hasNewContent: false,
                isNested: false,
                posContainer: null,
                posOffset: null,
                lastKeyPress: null,
            });
            expect(createUndoSnapshotsServiceSpy).toHaveBeenCalledWith();
            expect(clearRedoSpy).toHaveBeenCalledTimes(0);
        });

        it('ctor with option', () => {
            const mockedService = 'SERVICE' as any;
            const plugin = createUndoPlugin({
                undoSnapshotService: mockedService,
            });
            const state = plugin.getState();

            expect(state).toEqual({
                snapshotsService: mockedService,
                isRestoring: false,
                hasNewContent: false,
                isNested: false,
                posContainer: null,
                posOffset: null,
                lastKeyPress: null,
            });
            expect(createUndoSnapshotsServiceSpy).not.toHaveBeenCalled();
            expect(undoSpy).not.toHaveBeenCalled();
            expect(clearRedoSpy).toHaveBeenCalledTimes(0);
        });
    });

    describe('willHandleEventExclusively', () => {
        let plugin: PluginWithState<UndoPluginState>;

        beforeEach(() => {
            plugin = createUndoPlugin({});
            plugin.initialize(editor);
        });

        afterEach(() => {
            plugin.dispose();
        });

        it('Not handled exclusively for EditorReady event', () => {
            const result = plugin.willHandleEventExclusively({
                eventType: PluginEventType.EditorReady,
            });

            expect(result).toBeFalse();
            expect(undoSpy).not.toHaveBeenCalled();
            expect(clearRedoSpy).toHaveBeenCalledTimes(0);
        });

        it('Not handled exclusively for ContentChanged event', () => {
            const result = plugin.willHandleEventExclusively({
                eventType: PluginEventType.ContentChanged,
            } as any);

            expect(result).toBeFalse();
            expect(undoSpy).not.toHaveBeenCalled();
            expect(clearRedoSpy).toHaveBeenCalledTimes(0);
        });

        it('Not handled exclusively for MouseDown event', () => {
            const result = plugin.willHandleEventExclusively({
                eventType: PluginEventType.MouseDown,
            } as any);

            expect(result).toBeFalse();
            expect(undoSpy).not.toHaveBeenCalled();
            expect(clearRedoSpy).toHaveBeenCalledTimes(0);
        });

        it('Not handled exclusively for KeyDown event with Enter key', () => {
            const result = plugin.willHandleEventExclusively({
                eventType: PluginEventType.KeyDown,
                rawEvent: {
                    key: 'Enter',
                },
            } as any);

            expect(result).toBeFalse();
            expect(undoSpy).not.toHaveBeenCalled();
            expect(clearRedoSpy).toHaveBeenCalledTimes(0);
        });

        it('Not handled exclusively for KeyDown event with Ctrl key', () => {
            const result = plugin.willHandleEventExclusively({
                eventType: PluginEventType.KeyDown,
                rawEvent: {
                    key: 'Backspace',
                    ctrlKey: true,
                },
            } as any);

            expect(result).toBeFalse();
            expect(undoSpy).not.toHaveBeenCalled();
            expect(clearRedoSpy).toHaveBeenCalledTimes(0);
        });

        it('Not handled exclusively for KeyDown event, canUndoAutoComplete returns false', () => {
            canUndoAutoCompleteSpy.and.returnValue(false);

            const result = plugin.willHandleEventExclusively({
                eventType: PluginEventType.KeyDown,
                rawEvent: {
                    key: 'Backspace',
                },
            } as any);

            expect(result).toBeFalse();
            expect(undoSpy).not.toHaveBeenCalled();
            expect(clearRedoSpy).toHaveBeenCalledTimes(0);
        });

        it('Not handled exclusively for KeyDown event, selection is not range selection', () => {
            canUndoAutoCompleteSpy.and.returnValue(true);
            getDOMSelectionSpy.and.returnValue({
                type: 'image',
            });

            const result = plugin.willHandleEventExclusively({
                eventType: PluginEventType.KeyDown,
                rawEvent: {
                    key: 'Backspace',
                },
            } as any);

            expect(result).toBeFalse();
            expect(undoSpy).not.toHaveBeenCalled();
            expect(clearRedoSpy).toHaveBeenCalledTimes(0);
        });

        it('Not handled exclusively for KeyDown event, selection is not collapsed', () => {
            canUndoAutoCompleteSpy.and.returnValue(true);
            getDOMSelectionSpy.and.returnValue({
                type: 'range',
                range: {
                    collapsed: false,
                },
            });

            const result = plugin.willHandleEventExclusively({
                eventType: PluginEventType.KeyDown,
                rawEvent: {
                    key: 'Backspace',
                },
            } as any);

            expect(result).toBeFalse();
            expect(undoSpy).not.toHaveBeenCalled();
            expect(clearRedoSpy).toHaveBeenCalledTimes(0);
        });

        it('Not handled exclusively for KeyDown event, selection is not the same', () => {
            const state = plugin.getState();

            state.posContainer = 'P1' as any;
            state.posOffset = 'O1' as any;

            canUndoAutoCompleteSpy.and.returnValue(true);
            getDOMSelectionSpy.and.returnValue({
                type: 'range',
                range: {
                    collapsed: true,
                    startContainer: 'P2' as any,
                    startOffset: 'O2' as any,
                },
            });

            const result = plugin.willHandleEventExclusively({
                eventType: PluginEventType.KeyDown,
                rawEvent: {
                    key: 'Backspace',
                },
            } as any);

            expect(result).toBeFalse();
            expect(undoSpy).not.toHaveBeenCalled();
            expect(clearRedoSpy).toHaveBeenCalledTimes(0);
        });

        it('Handled exclusively for KeyDown event', () => {
            const state = plugin.getState();

            state.posContainer = 'P1' as any;
            state.posOffset = 'O1' as any;

            canUndoAutoCompleteSpy.and.returnValue(true);
            getDOMSelectionSpy.and.returnValue({
                type: 'range',
                range: {
                    collapsed: true,
                    startContainer: 'P1' as any,
                    startOffset: 'O1' as any,
                },
            });

            const result = plugin.willHandleEventExclusively({
                eventType: PluginEventType.KeyDown,
                rawEvent: {
                    key: 'Backspace',
                },
            } as any);

            expect(result).toBeTrue();
            expect(undoSpy).not.toHaveBeenCalled();
            expect(clearRedoSpy).toHaveBeenCalledTimes(0);
        });
    });

    describe('onPluginEvent', () => {
        let plugin: PluginWithState<UndoPluginState>;

        beforeEach(() => {
            plugin = createUndoPlugin({});
            plugin.initialize(editor);
        });

        afterEach(() => {
            plugin.dispose();
        });

        it('EditorReady event, no undo/redo', () => {
            getUndoStateSpy.and.returnValue({
                canUndo: false,
                canRedo: false,
            });

            plugin.onPluginEvent({
                eventType: PluginEventType.EditorReady,
            });

            expect(takeSnapshotSpy).toHaveBeenCalledTimes(1);
            expect(plugin.getState()).toEqual({
                snapshotsService: mockedUndoSnapshotsService,
                isRestoring: false,
                hasNewContent: false,
                isNested: false,
                posContainer: null,
                posOffset: null,
                lastKeyPress: null,
            });
            expect(undoSpy).not.toHaveBeenCalled();
            expect(clearRedoSpy).toHaveBeenCalledTimes(0);
        });

        it('EditorReady event, has undo', () => {
            getUndoStateSpy.and.returnValue({
                canUndo: true,
                canRedo: false,
            });

            plugin.onPluginEvent({
                eventType: PluginEventType.EditorReady,
            });

            expect(takeSnapshotSpy).toHaveBeenCalledTimes(0);
            expect(plugin.getState()).toEqual({
                snapshotsService: mockedUndoSnapshotsService,
                isRestoring: false,
                hasNewContent: false,
                isNested: false,
                posContainer: null,
                posOffset: null,
                lastKeyPress: null,
            });
            expect(undoSpy).not.toHaveBeenCalled();
            expect(clearRedoSpy).toHaveBeenCalledTimes(0);
        });

        it('EditorReady event, has redo', () => {
            getUndoStateSpy.and.returnValue({
                canUndo: true,
                canRedo: false,
            });

            plugin.onPluginEvent({
                eventType: PluginEventType.EditorReady,
            });

            expect(takeSnapshotSpy).toHaveBeenCalledTimes(0);
            expect(plugin.getState()).toEqual({
                snapshotsService: mockedUndoSnapshotsService,
                isRestoring: false,
                hasNewContent: false,
                isNested: false,
                posContainer: null,
                posOffset: null,
                lastKeyPress: null,
            });
            expect(undoSpy).not.toHaveBeenCalled();
            expect(clearRedoSpy).toHaveBeenCalledTimes(0);
        });

        it('KeyDown event, Backspace, no ALT key, no CTRL key: undo auto complete', () => {
            canUndoAutoCompleteSpy.and.returnValue(true);
            getDOMSelectionSpy.and.returnValue({
                type: 'range',
                range: {
                    collapsed: true,
                    startContainer: 'C1',
                    startOffset: 'O1',
                },
            });

            const state = plugin.getState();

            state.posContainer = 'C1' as any;
            state.posOffset = 'O1' as any;

            const preventDefaultSpy = jasmine.createSpy('preventDefault');

            plugin.onPluginEvent({
                eventType: PluginEventType.KeyDown,
                rawEvent: {
                    key: 'Backspace',
                    altKey: false,
                    ctrlKey: false,
                    preventDefault: preventDefaultSpy,
                } as any,
            });

            expect(takeSnapshotSpy).toHaveBeenCalledTimes(0);
            expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
            expect(undoSpy).toHaveBeenCalledTimes(1);
            expect(plugin.getState()).toEqual({
                snapshotsService: mockedUndoSnapshotsService,
                isRestoring: false,
                hasNewContent: false,
                isNested: false,
                posContainer: null,
                posOffset: null,
                lastKeyPress: 'Backspace',
            });
            expect(clearRedoSpy).toHaveBeenCalledTimes(0);
        });

        it('KeyDown event, Backspace, expanded range do not undo auto complete', () => {
            canUndoAutoCompleteSpy.and.returnValue(false);

            const preventDefaultSpy = jasmine.createSpy('preventDefault');

            getDOMSelectionSpy.and.returnValue({
                type: 'image',
            });

            plugin.onPluginEvent({
                eventType: PluginEventType.KeyDown,
                rawEvent: {
                    key: 'Backspace',
                    altKey: false,
                    ctrlKey: false,
                    preventDefault: preventDefaultSpy,
                } as any,
            });

            expect(takeSnapshotSpy).toHaveBeenCalledTimes(1);
            expect(preventDefaultSpy).toHaveBeenCalledTimes(0);
            expect(undoSpy).toHaveBeenCalledTimes(0);
            expect(plugin.getState()).toEqual({
                snapshotsService: mockedUndoSnapshotsService,
                isRestoring: false,
                hasNewContent: true,
                isNested: false,
                posContainer: null,
                posOffset: null,
                lastKeyPress: 'Backspace',
            });
            expect(clearRedoSpy).toHaveBeenCalledTimes(0);
        });

        it('KeyDown event, Delete', () => {
            canUndoAutoCompleteSpy.and.returnValue(false);

            const preventDefaultSpy = jasmine.createSpy('preventDefault');

            plugin.onPluginEvent({
                eventType: PluginEventType.KeyDown,
                rawEvent: {
                    key: 'Delete',
                    altKey: false,
                    ctrlKey: false,
                    preventDefault: preventDefaultSpy,
                } as any,
            });

            expect(takeSnapshotSpy).toHaveBeenCalledTimes(0);
            expect(preventDefaultSpy).toHaveBeenCalledTimes(0);
            expect(undoSpy).toHaveBeenCalledTimes(0);
            expect(plugin.getState()).toEqual({
                snapshotsService: mockedUndoSnapshotsService,
                isRestoring: false,
                hasNewContent: true,
                isNested: false,
                posContainer: null,
                posOffset: null,
                lastKeyPress: 'Delete',
            });
            expect(clearRedoSpy).toHaveBeenCalledTimes(0);
        });

        it('KeyDown event, Up', () => {
            canUndoAutoCompleteSpy.and.returnValue(false);

            const preventDefaultSpy = jasmine.createSpy('preventDefault');

            plugin.onPluginEvent({
                eventType: PluginEventType.KeyDown,
                rawEvent: {
                    key: 'Up',
                    altKey: false,
                    ctrlKey: false,
                    preventDefault: preventDefaultSpy,
                } as any,
            });

            expect(takeSnapshotSpy).toHaveBeenCalledTimes(0);
            expect(preventDefaultSpy).toHaveBeenCalledTimes(0);
            expect(undoSpy).toHaveBeenCalledTimes(0);
            expect(plugin.getState()).toEqual({
                snapshotsService: mockedUndoSnapshotsService,
                isRestoring: false,
                hasNewContent: false,
                isNested: false,
                posContainer: null,
                posOffset: null,
                lastKeyPress: null,
            });
            expect(clearRedoSpy).toHaveBeenCalledTimes(0);
        });

        it('KeyDown event, Up, has new content', () => {
            canUndoAutoCompleteSpy.and.returnValue(false);

            const preventDefaultSpy = jasmine.createSpy('preventDefault');
            const state = plugin.getState();

            state.hasNewContent = true;

            plugin.onPluginEvent({
                eventType: PluginEventType.KeyDown,
                rawEvent: {
                    key: 'Up',
                    altKey: false,
                    ctrlKey: false,
                    preventDefault: preventDefaultSpy,
                } as any,
            });

            expect(takeSnapshotSpy).toHaveBeenCalledTimes(0);
            expect(preventDefaultSpy).toHaveBeenCalledTimes(0);
            expect(undoSpy).toHaveBeenCalledTimes(0);
            expect(plugin.getState()).toEqual({
                snapshotsService: mockedUndoSnapshotsService,
                isRestoring: false,
                hasNewContent: true,
                isNested: false,
                posContainer: null,
                posOffset: null,
                lastKeyPress: null,
            });
            expect(clearRedoSpy).toHaveBeenCalledTimes(0);
        });

        it('KeyDown event, other key, has new content, lastKey is Backspace', () => {
            canUndoAutoCompleteSpy.and.returnValue(false);

            const preventDefaultSpy = jasmine.createSpy('preventDefault');
            const state = plugin.getState();

            state.hasNewContent = true;
            state.lastKeyPress = 'Backspace';

            plugin.onPluginEvent({
                eventType: PluginEventType.KeyDown,
                rawEvent: {
                    key: 'A',
                    altKey: false,
                    ctrlKey: false,
                    preventDefault: preventDefaultSpy,
                } as any,
            });

            expect(takeSnapshotSpy).toHaveBeenCalledTimes(1);
            expect(preventDefaultSpy).toHaveBeenCalledTimes(0);
            expect(undoSpy).toHaveBeenCalledTimes(0);
            expect(plugin.getState()).toEqual({
                snapshotsService: mockedUndoSnapshotsService,
                isRestoring: false,
                hasNewContent: true,
                isNested: false,
                posContainer: null,
                posOffset: null,
                lastKeyPress: 'Backspace',
            });
            expect(clearRedoSpy).toHaveBeenCalledTimes(0);
        });

        it('KeyDown event, Delete key, defaultPrevented', () => {
            canUndoAutoCompleteSpy.and.returnValue(false);

            const preventDefaultSpy = jasmine.createSpy('preventDefault');

            plugin.onPluginEvent({
                eventType: PluginEventType.KeyDown,
                rawEvent: {
                    key: 'A',
                    altKey: false,
                    ctrlKey: false,
                    preventDefault: preventDefaultSpy,
                    defaultPrevented: true,
                } as any,
            });

            expect(takeSnapshotSpy).toHaveBeenCalledTimes(0);
            expect(preventDefaultSpy).toHaveBeenCalledTimes(0);
            expect(undoSpy).toHaveBeenCalledTimes(0);
            expect(plugin.getState()).toEqual({
                snapshotsService: mockedUndoSnapshotsService,
                isRestoring: false,
                hasNewContent: false,
                isNested: false,
                posContainer: null,
                posOffset: null,
                lastKeyPress: null,
            });
            expect(clearRedoSpy).toHaveBeenCalledTimes(0);
        });

        it('KeyPress event, Enter key, expanded selection', () => {
            const preventDefaultSpy = jasmine.createSpy('preventDefault');

            getDOMSelectionSpy.and.returnValue({
                type: 'range',
                range: {
                    collapsed: false,
                },
            });

            plugin.onPluginEvent({
                eventType: PluginEventType.KeyPress,
                rawEvent: {
                    key: 'Enter',
                    altKey: false,
                    ctrlKey: false,
                    preventDefault: preventDefaultSpy,
                } as any,
            });

            expect(takeSnapshotSpy).toHaveBeenCalledTimes(1);
            expect(preventDefaultSpy).toHaveBeenCalledTimes(0);
            expect(undoSpy).toHaveBeenCalledTimes(0);
            expect(plugin.getState()).toEqual({
                snapshotsService: mockedUndoSnapshotsService,
                isRestoring: false,
                hasNewContent: true,
                isNested: false,
                posContainer: null,
                posOffset: null,
                lastKeyPress: 'Enter',
            });
            expect(clearRedoSpy).toHaveBeenCalledTimes(0);
        });

        it('KeyPress event, other key, expanded selection', () => {
            const preventDefaultSpy = jasmine.createSpy('preventDefault');

            getDOMSelectionSpy.and.returnValue({
                type: 'range',
                range: {
                    collapsed: false,
                },
            });

            plugin.onPluginEvent({
                eventType: PluginEventType.KeyPress,
                rawEvent: {
                    key: 'A',
                    altKey: false,
                    ctrlKey: false,
                    preventDefault: preventDefaultSpy,
                } as any,
            });

            expect(takeSnapshotSpy).toHaveBeenCalledTimes(1);
            expect(preventDefaultSpy).toHaveBeenCalledTimes(0);
            expect(undoSpy).toHaveBeenCalledTimes(0);
            expect(plugin.getState()).toEqual({
                snapshotsService: mockedUndoSnapshotsService,
                isRestoring: false,
                hasNewContent: false,
                isNested: false,
                posContainer: null,
                posOffset: null,
                lastKeyPress: 'A',
            });
            expect(clearRedoSpy).toHaveBeenCalledTimes(0);
        });

        it('KeyPress event, Space key, last key is not space', () => {
            const preventDefaultSpy = jasmine.createSpy('preventDefault');
            const state = plugin.getState();

            state.lastKeyPress = 'A';

            plugin.onPluginEvent({
                eventType: PluginEventType.KeyPress,
                rawEvent: {
                    key: ' ',
                    altKey: false,
                    ctrlKey: false,
                    preventDefault: preventDefaultSpy,
                } as any,
            });

            expect(takeSnapshotSpy).toHaveBeenCalledTimes(1);
            expect(preventDefaultSpy).toHaveBeenCalledTimes(0);
            expect(undoSpy).toHaveBeenCalledTimes(0);
            expect(plugin.getState()).toEqual({
                snapshotsService: mockedUndoSnapshotsService,
                isRestoring: false,
                hasNewContent: false,
                isNested: false,
                posContainer: null,
                posOffset: null,
                lastKeyPress: ' ',
            });
            expect(clearRedoSpy).toHaveBeenCalledTimes(0);
        });

        it('KeyPress event, Space key, last key is space', () => {
            const preventDefaultSpy = jasmine.createSpy('preventDefault');
            const state = plugin.getState();

            state.lastKeyPress = ' ';

            plugin.onPluginEvent({
                eventType: PluginEventType.KeyPress,
                rawEvent: {
                    key: ' ',
                    altKey: false,
                    ctrlKey: false,
                    preventDefault: preventDefaultSpy,
                } as any,
            });

            expect(takeSnapshotSpy).toHaveBeenCalledTimes(0);
            expect(preventDefaultSpy).toHaveBeenCalledTimes(0);
            expect(undoSpy).toHaveBeenCalledTimes(0);
            expect(plugin.getState()).toEqual({
                snapshotsService: mockedUndoSnapshotsService,
                isRestoring: false,
                hasNewContent: true,
                isNested: false,
                posContainer: null,
                posOffset: null,
                lastKeyPress: ' ',
            });
            expect(clearRedoSpy).toHaveBeenCalledTimes(1);
        });

        it('KeyPress event, Enter key', () => {
            const preventDefaultSpy = jasmine.createSpy('preventDefault');

            plugin.onPluginEvent({
                eventType: PluginEventType.KeyPress,
                rawEvent: {
                    key: 'Enter',
                    altKey: false,
                    ctrlKey: false,
                    preventDefault: preventDefaultSpy,
                } as any,
            });

            expect(takeSnapshotSpy).toHaveBeenCalledTimes(1);
            expect(preventDefaultSpy).toHaveBeenCalledTimes(0);
            expect(undoSpy).toHaveBeenCalledTimes(0);
            expect(plugin.getState()).toEqual({
                snapshotsService: mockedUndoSnapshotsService,
                isRestoring: false,
                hasNewContent: true,
                isNested: false,
                posContainer: null,
                posOffset: null,
                lastKeyPress: 'Enter',
            });
            expect(clearRedoSpy).toHaveBeenCalledTimes(0);
        });

        it('KeyPress event, other key', () => {
            const preventDefaultSpy = jasmine.createSpy('preventDefault');

            plugin.onPluginEvent({
                eventType: PluginEventType.KeyPress,
                rawEvent: {
                    key: 'A',
                    altKey: false,
                    ctrlKey: false,
                    preventDefault: preventDefaultSpy,
                } as any,
            });

            expect(takeSnapshotSpy).toHaveBeenCalledTimes(0);
            expect(preventDefaultSpy).toHaveBeenCalledTimes(0);
            expect(undoSpy).toHaveBeenCalledTimes(0);
            expect(plugin.getState()).toEqual({
                snapshotsService: mockedUndoSnapshotsService,
                isRestoring: false,
                hasNewContent: true,
                isNested: false,
                posContainer: null,
                posOffset: null,
                lastKeyPress: 'A',
            });
            expect(clearRedoSpy).toHaveBeenCalledTimes(1);
        });

        it('CompositionEnd event', () => {
            const preventDefaultSpy = jasmine.createSpy('preventDefault');

            plugin.onPluginEvent({
                eventType: PluginEventType.CompositionEnd,
                rawEvent: {
                    key: 'Test',
                },
            } as any);

            expect(takeSnapshotSpy).toHaveBeenCalledTimes(1);
            expect(preventDefaultSpy).toHaveBeenCalledTimes(0);
            expect(undoSpy).toHaveBeenCalledTimes(0);
            expect(plugin.getState()).toEqual({
                snapshotsService: mockedUndoSnapshotsService,
                isRestoring: false,
                hasNewContent: true,
                isNested: false,
                posContainer: null,
                posOffset: null,
                lastKeyPress: null,
            });
            expect(clearRedoSpy).toHaveBeenCalledTimes(1);
        });

        it('onContentChanged event, isRestoring, other source', () => {
            const preventDefaultSpy = jasmine.createSpy('preventDefault');
            const state = plugin.getState();

            state.isRestoring = true;

            plugin.onPluginEvent({
                eventType: PluginEventType.ContentChanged,
                source: 'Test',
            } as any);

            expect(takeSnapshotSpy).toHaveBeenCalledTimes(0);
            expect(preventDefaultSpy).toHaveBeenCalledTimes(0);
            expect(undoSpy).toHaveBeenCalledTimes(0);
            expect(plugin.getState()).toEqual({
                snapshotsService: mockedUndoSnapshotsService,
                isRestoring: true,
                hasNewContent: false,
                isNested: false,
                posContainer: null,
                posOffset: null,
                lastKeyPress: null,
            });
            expect(clearRedoSpy).toHaveBeenCalledTimes(0);
        });

        it('onContentChanged event, SwitchToDarkMode', () => {
            const preventDefaultSpy = jasmine.createSpy('preventDefault');

            plugin.onPluginEvent({
                eventType: PluginEventType.ContentChanged,
                source: ChangeSource.SwitchToDarkMode,
            } as any);

            expect(takeSnapshotSpy).toHaveBeenCalledTimes(0);
            expect(preventDefaultSpy).toHaveBeenCalledTimes(0);
            expect(undoSpy).toHaveBeenCalledTimes(0);
            expect(plugin.getState()).toEqual({
                snapshotsService: mockedUndoSnapshotsService,
                isRestoring: false,
                hasNewContent: false,
                isNested: false,
                posContainer: null,
                posOffset: null,
                lastKeyPress: null,
            });
            expect(clearRedoSpy).toHaveBeenCalledTimes(0);
        });

        it('onContentChanged event, SwitchToLightMode', () => {
            const preventDefaultSpy = jasmine.createSpy('preventDefault');

            plugin.onPluginEvent({
                eventType: PluginEventType.ContentChanged,
                source: ChangeSource.SwitchToLightMode,
            } as any);

            expect(takeSnapshotSpy).toHaveBeenCalledTimes(0);
            expect(preventDefaultSpy).toHaveBeenCalledTimes(0);
            expect(undoSpy).toHaveBeenCalledTimes(0);
            expect(plugin.getState()).toEqual({
                snapshotsService: mockedUndoSnapshotsService,
                isRestoring: false,
                hasNewContent: false,
                isNested: false,
                posContainer: null,
                posOffset: null,
                lastKeyPress: null,
            });
            expect(clearRedoSpy).toHaveBeenCalledTimes(0);
        });

        it('onContentChanged event, Keyboard', () => {
            const preventDefaultSpy = jasmine.createSpy('preventDefault');

            plugin.onPluginEvent({
                eventType: PluginEventType.ContentChanged,
                source: ChangeSource.Keyboard,
            } as any);

            expect(takeSnapshotSpy).toHaveBeenCalledTimes(0);
            expect(preventDefaultSpy).toHaveBeenCalledTimes(0);
            expect(undoSpy).toHaveBeenCalledTimes(0);
            expect(plugin.getState()).toEqual({
                snapshotsService: mockedUndoSnapshotsService,
                isRestoring: false,
                hasNewContent: false,
                isNested: false,
                posContainer: null,
                posOffset: null,
                lastKeyPress: null,
            });
            expect(clearRedoSpy).toHaveBeenCalledTimes(0);
        });

        it('onContentChanged event, other source', () => {
            const preventDefaultSpy = jasmine.createSpy('preventDefault');

            plugin.onPluginEvent({
                eventType: PluginEventType.ContentChanged,
                source: 'Test',
            } as any);

            expect(takeSnapshotSpy).toHaveBeenCalledTimes(0);
            expect(preventDefaultSpy).toHaveBeenCalledTimes(0);
            expect(undoSpy).toHaveBeenCalledTimes(0);
            expect(plugin.getState()).toEqual({
                snapshotsService: mockedUndoSnapshotsService,
                isRestoring: false,
                hasNewContent: true,
                isNested: false,
                posContainer: null,
                posOffset: null,
                lastKeyPress: null,
            });
            expect(clearRedoSpy).toHaveBeenCalledTimes(1);
        });

        it('BeforeKeyboardEditing event, key is not same', () => {
            const preventDefaultSpy = jasmine.createSpy('preventDefault');
            const state = plugin.getState();

            state.lastKeyPress = 'A';

            plugin.onPluginEvent({
                eventType: PluginEventType.BeforeKeyboardEditing,
                rawEvent: {
                    key: 'B',
                },
            } as any);

            expect(takeSnapshotSpy).toHaveBeenCalledTimes(1);
            expect(preventDefaultSpy).toHaveBeenCalledTimes(0);
            expect(undoSpy).toHaveBeenCalledTimes(0);
            expect(plugin.getState()).toEqual({
                snapshotsService: mockedUndoSnapshotsService,
                isRestoring: false,
                hasNewContent: true,
                isNested: false,
                posContainer: null,
                posOffset: null,
                lastKeyPress: 'B',
            });
            expect(clearRedoSpy).toHaveBeenCalledTimes(0);
        });

        it('BeforeKeyboardEditing event, key is the same', () => {
            const preventDefaultSpy = jasmine.createSpy('preventDefault');
            const state = plugin.getState();

            state.lastKeyPress = 'A';

            plugin.onPluginEvent({
                eventType: PluginEventType.BeforeKeyboardEditing,
                rawEvent: {
                    key: 'A',
                },
            } as any);

            expect(takeSnapshotSpy).toHaveBeenCalledTimes(0);
            expect(preventDefaultSpy).toHaveBeenCalledTimes(0);
            expect(undoSpy).toHaveBeenCalledTimes(0);
            expect(plugin.getState()).toEqual({
                snapshotsService: mockedUndoSnapshotsService,
                isRestoring: false,
                hasNewContent: true,
                isNested: false,
                posContainer: null,
                posOffset: null,
                lastKeyPress: 'A',
            });
            expect(clearRedoSpy).toHaveBeenCalledTimes(0);
        });
    });
});
