import * as SnapshotsManagerImpl from '../../../lib/corePlugin/undo/SnapshotsManagerImpl';
import * as undo from '../../../lib/publicApi/undo/undo';
import { ChangeSource } from '../../../lib/constants/ChangeSource';
import { createUndoPlugin } from '../../../lib/corePlugin/undo/UndoPlugin';
import {
    IEditor,
    PluginWithState,
    SnapshotsManager,
    UndoPluginState,
} from 'roosterjs-content-model-types';

describe('UndoPlugin', () => {
    let editor: IEditor;
    let createSnapshotsManagerSpy: jasmine.Spy;
    let getDOMSelectionSpy: jasmine.Spy;
    let canUndoAutoCompleteSpy: jasmine.Spy;
    let isInIMESpy: jasmine.Spy;
    let takeSnapshotSpy: jasmine.Spy;
    let undoSpy: jasmine.Spy;
    let clearRedoSpy: jasmine.Spy;
    let canMoveSpy: jasmine.Spy;
    let mockedSnapshotsManager: SnapshotsManager;

    beforeEach(() => {
        getDOMSelectionSpy = jasmine.createSpy('getDOMSelection');
        canUndoAutoCompleteSpy = jasmine.createSpy('canUndoAutoComplete');
        isInIMESpy = jasmine.createSpy('isInIME');
        canMoveSpy = jasmine.createSpy('canMove');
        takeSnapshotSpy = jasmine.createSpy('takeUndoSnapshot');
        undoSpy = spyOn(undo, 'undo');
        clearRedoSpy = jasmine.createSpy('clearRedo');

        mockedSnapshotsManager = {
            canUndoAutoComplete: canUndoAutoCompleteSpy,
            clearRedo: clearRedoSpy,
            hasNewContent: false,
            canMove: canMoveSpy,
        } as any;

        createSnapshotsManagerSpy = spyOn(
            SnapshotsManagerImpl,
            'createSnapshotsManager'
        ).and.returnValue(mockedSnapshotsManager);

        editor = {
            getDOMSelection: getDOMSelectionSpy,
            isInIME: isInIMESpy,
            takeSnapshot: takeSnapshotSpy,
        } as any;
    });

    describe('Ctor', () => {
        it('ctor without option', () => {
            const plugin = createUndoPlugin({});
            const state = plugin.getState();

            expect(state).toEqual({
                snapshotsManager: mockedSnapshotsManager,
                isRestoring: false,
                isNested: false,
                posContainer: null,
                posOffset: null,
                lastKeyPress: null,
            });
            expect(createSnapshotsManagerSpy).toHaveBeenCalledWith(undefined);
            expect(clearRedoSpy).toHaveBeenCalledTimes(0);
        });

        it('ctor with option', () => {
            const mockedSnapshots = 'SNAPSHOTS' as any;
            const mockedManager = 'MANAGER' as any;

            createSnapshotsManagerSpy.and.returnValue(mockedManager);

            const plugin = createUndoPlugin({
                snapshots: mockedSnapshots,
            });
            const state = plugin.getState();

            expect(state).toEqual({
                snapshotsManager: mockedManager,
                isRestoring: false,
                isNested: false,
                posContainer: null,
                posOffset: null,
                lastKeyPress: null,
            });
            expect(createSnapshotsManagerSpy).toHaveBeenCalledWith(mockedSnapshots);
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
                eventType: 'editorReady',
            });

            expect(result).toBeFalse();
            expect(undoSpy).not.toHaveBeenCalled();
            expect(clearRedoSpy).toHaveBeenCalledTimes(0);
        });

        it('Not handled exclusively for ContentChanged event', () => {
            const result = plugin.willHandleEventExclusively({
                eventType: 'contentChanged',
            } as any);

            expect(result).toBeFalse();
            expect(undoSpy).not.toHaveBeenCalled();
            expect(clearRedoSpy).toHaveBeenCalledTimes(0);
        });

        it('Not handled exclusively for MouseDown event', () => {
            const result = plugin.willHandleEventExclusively({
                eventType: 'mouseDown',
            } as any);

            expect(result).toBeFalse();
            expect(undoSpy).not.toHaveBeenCalled();
            expect(clearRedoSpy).toHaveBeenCalledTimes(0);
        });

        it('Not handled exclusively for KeyDown event with Enter key', () => {
            const result = plugin.willHandleEventExclusively({
                eventType: 'keyDown',
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
                eventType: 'keyDown',
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
                eventType: 'keyDown',
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
                eventType: 'keyDown',
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
                eventType: 'keyDown',
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
                eventType: 'keyDown',
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
                eventType: 'keyDown',
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
            canMoveSpy.and.returnValue(false);
            plugin.getState().snapshotsManager.hasNewContent = false;

            plugin.onPluginEvent({
                eventType: 'editorReady',
            });

            expect(takeSnapshotSpy).toHaveBeenCalledTimes(1);
            expect(plugin.getState()).toEqual({
                snapshotsManager: mockedSnapshotsManager,
                isRestoring: false,
                isNested: false,
                posContainer: null,
                posOffset: null,
                lastKeyPress: null,
            });
            expect(mockedSnapshotsManager.hasNewContent).toBeFalse();
            expect(undoSpy).not.toHaveBeenCalled();
            expect(clearRedoSpy).toHaveBeenCalledTimes(0);
        });

        it('EditorReady event, has undo', () => {
            canMoveSpy.and.callFake((step: number) => step < 0);
            plugin.getState().snapshotsManager.hasNewContent = false;

            plugin.onPluginEvent({
                eventType: 'editorReady',
            });

            expect(takeSnapshotSpy).toHaveBeenCalledTimes(0);
            expect(plugin.getState()).toEqual({
                snapshotsManager: mockedSnapshotsManager,
                isRestoring: false,
                isNested: false,
                posContainer: null,
                posOffset: null,
                lastKeyPress: null,
            });
            expect(mockedSnapshotsManager.hasNewContent).toBeFalse();
            expect(undoSpy).not.toHaveBeenCalled();
            expect(clearRedoSpy).toHaveBeenCalledTimes(0);
        });

        it('EditorReady event, has redo', () => {
            canMoveSpy.and.callFake((step: number) => step > 0);
            plugin.getState().snapshotsManager.hasNewContent = false;

            plugin.onPluginEvent({
                eventType: 'editorReady',
            });

            expect(takeSnapshotSpy).toHaveBeenCalledTimes(0);
            expect(plugin.getState()).toEqual({
                snapshotsManager: mockedSnapshotsManager,
                isRestoring: false,
                isNested: false,
                posContainer: null,
                posOffset: null,
                lastKeyPress: null,
            });
            expect(mockedSnapshotsManager.hasNewContent).toBeFalse();
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
                eventType: 'keyDown',
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
                snapshotsManager: mockedSnapshotsManager,
                isRestoring: false,
                isNested: false,
                posContainer: null,
                posOffset: null,
                lastKeyPress: 'Backspace',
            });
            expect(mockedSnapshotsManager.hasNewContent).toBeFalse();
            expect(clearRedoSpy).toHaveBeenCalledTimes(0);
        });

        it('KeyDown event, Backspace, expanded range do not undo auto complete', () => {
            canUndoAutoCompleteSpy.and.returnValue(false);

            const preventDefaultSpy = jasmine.createSpy('preventDefault');

            getDOMSelectionSpy.and.returnValue({
                type: 'image',
            });

            plugin.onPluginEvent({
                eventType: 'keyDown',
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
                snapshotsManager: mockedSnapshotsManager,
                isRestoring: false,
                isNested: false,
                posContainer: null,
                posOffset: null,
                lastKeyPress: 'Backspace',
            });
            expect(mockedSnapshotsManager.hasNewContent).toBeTrue();
            expect(clearRedoSpy).toHaveBeenCalledTimes(0);
        });

        it('KeyDown event, Delete', () => {
            canUndoAutoCompleteSpy.and.returnValue(false);

            const preventDefaultSpy = jasmine.createSpy('preventDefault');

            plugin.onPluginEvent({
                eventType: 'keyDown',
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
                snapshotsManager: mockedSnapshotsManager,
                isRestoring: false,
                isNested: false,
                posContainer: null,
                posOffset: null,
                lastKeyPress: 'Delete',
            });
            expect(mockedSnapshotsManager.hasNewContent).toBeTrue();
            expect(clearRedoSpy).toHaveBeenCalledTimes(0);
        });

        it('KeyDown event, Up', () => {
            canUndoAutoCompleteSpy.and.returnValue(false);

            const preventDefaultSpy = jasmine.createSpy('preventDefault');

            plugin.onPluginEvent({
                eventType: 'keyDown',
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
                snapshotsManager: mockedSnapshotsManager,
                isRestoring: false,
                isNested: false,
                posContainer: null,
                posOffset: null,
                lastKeyPress: null,
            });
            expect(mockedSnapshotsManager.hasNewContent).toBeFalsy();
            expect(clearRedoSpy).toHaveBeenCalledTimes(0);
        });

        it('KeyDown event, Up, has new content', () => {
            canUndoAutoCompleteSpy.and.returnValue(false);

            const preventDefaultSpy = jasmine.createSpy('preventDefault');
            const state = plugin.getState();

            state.snapshotsManager.hasNewContent = true;

            plugin.onPluginEvent({
                eventType: 'keyDown',
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
                snapshotsManager: mockedSnapshotsManager,
                isRestoring: false,
                isNested: false,
                posContainer: null,
                posOffset: null,
                lastKeyPress: null,
            });
            expect(mockedSnapshotsManager.hasNewContent).toBeTrue();
            expect(clearRedoSpy).toHaveBeenCalledTimes(0);
        });

        it('KeyDown event, other key, has new content, lastKey is Backspace', () => {
            canUndoAutoCompleteSpy.and.returnValue(false);

            const preventDefaultSpy = jasmine.createSpy('preventDefault');
            const state = plugin.getState();

            state.snapshotsManager.hasNewContent = true;
            state.lastKeyPress = 'Backspace';

            plugin.onPluginEvent({
                eventType: 'keyDown',
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
                snapshotsManager: mockedSnapshotsManager,
                isRestoring: false,
                isNested: false,
                posContainer: null,
                posOffset: null,
                lastKeyPress: 'Backspace',
            });
            expect(mockedSnapshotsManager.hasNewContent).toBeTrue();
            expect(clearRedoSpy).toHaveBeenCalledTimes(0);
        });

        it('KeyDown event, Delete key, defaultPrevented', () => {
            canUndoAutoCompleteSpy.and.returnValue(false);

            const preventDefaultSpy = jasmine.createSpy('preventDefault');

            plugin.onPluginEvent({
                eventType: 'keyDown',
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
                snapshotsManager: mockedSnapshotsManager,
                isRestoring: false,
                isNested: false,
                posContainer: null,
                posOffset: null,
                lastKeyPress: null,
            });
            expect(mockedSnapshotsManager.hasNewContent).toBeFalsy();
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
                eventType: 'keyPress',
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
                snapshotsManager: mockedSnapshotsManager,
                isRestoring: false,
                isNested: false,
                posContainer: null,
                posOffset: null,
                lastKeyPress: 'Enter',
            });
            expect(mockedSnapshotsManager.hasNewContent).toBeTrue();
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
                eventType: 'keyPress',
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
                snapshotsManager: mockedSnapshotsManager,
                isRestoring: false,
                isNested: false,
                posContainer: null,
                posOffset: null,
                lastKeyPress: 'A',
            });
            expect(mockedSnapshotsManager.hasNewContent).toBeFalsy();
            expect(clearRedoSpy).toHaveBeenCalledTimes(0);
        });

        it('KeyPress event, Space key, last key is not space', () => {
            const preventDefaultSpy = jasmine.createSpy('preventDefault');
            const state = plugin.getState();

            state.lastKeyPress = 'A';

            plugin.onPluginEvent({
                eventType: 'keyPress',
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
                snapshotsManager: mockedSnapshotsManager,
                isRestoring: false,
                isNested: false,
                posContainer: null,
                posOffset: null,
                lastKeyPress: ' ',
            });
            expect(mockedSnapshotsManager.hasNewContent).toBeFalsy();
            expect(clearRedoSpy).toHaveBeenCalledTimes(0);
        });

        it('KeyPress event, Space key, last key is space', () => {
            const preventDefaultSpy = jasmine.createSpy('preventDefault');
            const state = plugin.getState();

            state.lastKeyPress = ' ';

            plugin.onPluginEvent({
                eventType: 'keyPress',
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
                snapshotsManager: mockedSnapshotsManager,
                isRestoring: false,
                isNested: false,
                posContainer: null,
                posOffset: null,
                lastKeyPress: ' ',
            });
            expect(mockedSnapshotsManager.hasNewContent).toBeTrue();
            expect(clearRedoSpy).toHaveBeenCalledTimes(1);
        });

        it('KeyPress event, Enter key', () => {
            const preventDefaultSpy = jasmine.createSpy('preventDefault');

            plugin.onPluginEvent({
                eventType: 'keyPress',
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
                snapshotsManager: mockedSnapshotsManager,
                isRestoring: false,
                isNested: false,
                posContainer: null,
                posOffset: null,
                lastKeyPress: 'Enter',
            });
            expect(mockedSnapshotsManager.hasNewContent).toBeTrue();
            expect(clearRedoSpy).toHaveBeenCalledTimes(0);
        });

        it('KeyPress event, other key', () => {
            const preventDefaultSpy = jasmine.createSpy('preventDefault');

            plugin.onPluginEvent({
                eventType: 'keyPress',
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
                snapshotsManager: mockedSnapshotsManager,
                isRestoring: false,
                isNested: false,
                posContainer: null,
                posOffset: null,
                lastKeyPress: 'A',
            });
            expect(mockedSnapshotsManager.hasNewContent).toBeTrue();
            expect(clearRedoSpy).toHaveBeenCalledTimes(1);
        });

        it('CompositionEnd event', () => {
            const preventDefaultSpy = jasmine.createSpy('preventDefault');

            plugin.onPluginEvent({
                eventType: 'compositionEnd',
                rawEvent: {
                    key: 'Test',
                },
            } as any);

            expect(takeSnapshotSpy).toHaveBeenCalledTimes(1);
            expect(preventDefaultSpy).toHaveBeenCalledTimes(0);
            expect(undoSpy).toHaveBeenCalledTimes(0);
            expect(plugin.getState()).toEqual({
                snapshotsManager: mockedSnapshotsManager,
                isRestoring: false,
                isNested: false,
                posContainer: null,
                posOffset: null,
                lastKeyPress: null,
            });
            expect(mockedSnapshotsManager.hasNewContent).toBeTrue();
            expect(clearRedoSpy).toHaveBeenCalledTimes(1);
        });

        it('onContentChanged event, isRestoring, other source', () => {
            const preventDefaultSpy = jasmine.createSpy('preventDefault');
            const state = plugin.getState();

            state.isRestoring = true;

            plugin.onPluginEvent({
                eventType: 'contentChanged',
                source: 'Test',
            } as any);

            expect(takeSnapshotSpy).toHaveBeenCalledTimes(0);
            expect(preventDefaultSpy).toHaveBeenCalledTimes(0);
            expect(undoSpy).toHaveBeenCalledTimes(0);
            expect(plugin.getState()).toEqual({
                snapshotsManager: mockedSnapshotsManager,
                isRestoring: true,
                isNested: false,
                posContainer: null,
                posOffset: null,
                lastKeyPress: null,
            });
            expect(mockedSnapshotsManager.hasNewContent).toBeFalsy();
            expect(clearRedoSpy).toHaveBeenCalledTimes(0);
        });

        it('onContentChanged event, SwitchToDarkMode', () => {
            const preventDefaultSpy = jasmine.createSpy('preventDefault');

            plugin.onPluginEvent({
                eventType: 'contentChanged',
                source: ChangeSource.SwitchToDarkMode,
            } as any);

            expect(takeSnapshotSpy).toHaveBeenCalledTimes(0);
            expect(preventDefaultSpy).toHaveBeenCalledTimes(0);
            expect(undoSpy).toHaveBeenCalledTimes(0);
            expect(plugin.getState()).toEqual({
                snapshotsManager: mockedSnapshotsManager,
                isRestoring: false,
                isNested: false,
                posContainer: null,
                posOffset: null,
                lastKeyPress: null,
            });
            expect(mockedSnapshotsManager.hasNewContent).toBeFalsy();
            expect(clearRedoSpy).toHaveBeenCalledTimes(0);
        });

        it('onContentChanged event, SwitchToLightMode', () => {
            const preventDefaultSpy = jasmine.createSpy('preventDefault');

            plugin.onPluginEvent({
                eventType: 'contentChanged',
                source: ChangeSource.SwitchToLightMode,
            } as any);

            expect(takeSnapshotSpy).toHaveBeenCalledTimes(0);
            expect(preventDefaultSpy).toHaveBeenCalledTimes(0);
            expect(undoSpy).toHaveBeenCalledTimes(0);
            expect(plugin.getState()).toEqual({
                snapshotsManager: mockedSnapshotsManager,
                isRestoring: false,
                isNested: false,
                posContainer: null,
                posOffset: null,
                lastKeyPress: null,
            });
            expect(mockedSnapshotsManager.hasNewContent).toBeFalsy();
            expect(clearRedoSpy).toHaveBeenCalledTimes(0);
        });

        it('onContentChanged event, Keyboard', () => {
            const preventDefaultSpy = jasmine.createSpy('preventDefault');

            plugin.onPluginEvent({
                eventType: 'contentChanged',
                source: ChangeSource.Keyboard,
            } as any);

            expect(takeSnapshotSpy).toHaveBeenCalledTimes(0);
            expect(preventDefaultSpy).toHaveBeenCalledTimes(0);
            expect(undoSpy).toHaveBeenCalledTimes(0);
            expect(plugin.getState()).toEqual({
                snapshotsManager: mockedSnapshotsManager,
                isRestoring: false,
                isNested: false,
                posContainer: null,
                posOffset: null,
                lastKeyPress: null,
            });
            expect(mockedSnapshotsManager.hasNewContent).toBeFalsy();
            expect(clearRedoSpy).toHaveBeenCalledTimes(0);
        });

        it('onContentChanged event, other source', () => {
            const preventDefaultSpy = jasmine.createSpy('preventDefault');

            plugin.onPluginEvent({
                eventType: 'contentChanged',
                source: 'Test',
            } as any);

            expect(takeSnapshotSpy).toHaveBeenCalledTimes(0);
            expect(preventDefaultSpy).toHaveBeenCalledTimes(0);
            expect(undoSpy).toHaveBeenCalledTimes(0);
            expect(plugin.getState()).toEqual({
                snapshotsManager: mockedSnapshotsManager,
                isRestoring: false,
                isNested: false,
                posContainer: null,
                posOffset: null,
                lastKeyPress: null,
            });
            expect(mockedSnapshotsManager.hasNewContent).toBeTrue();
            expect(clearRedoSpy).toHaveBeenCalledTimes(1);
        });

        it('BeforeKeyboardEditing event, key is not same', () => {
            const preventDefaultSpy = jasmine.createSpy('preventDefault');
            const state = plugin.getState();

            state.lastKeyPress = 'A';

            plugin.onPluginEvent({
                eventType: 'beforeKeyboardEditing',
                rawEvent: {
                    key: 'B',
                },
            } as any);

            expect(takeSnapshotSpy).toHaveBeenCalledTimes(1);
            expect(preventDefaultSpy).toHaveBeenCalledTimes(0);
            expect(undoSpy).toHaveBeenCalledTimes(0);
            expect(plugin.getState()).toEqual({
                snapshotsManager: mockedSnapshotsManager,
                isRestoring: false,
                isNested: false,
                posContainer: null,
                posOffset: null,
                lastKeyPress: 'B',
            });
            expect(mockedSnapshotsManager.hasNewContent).toBeTrue();
            expect(clearRedoSpy).toHaveBeenCalledTimes(0);
        });

        it('BeforeKeyboardEditing event, key is the same', () => {
            const preventDefaultSpy = jasmine.createSpy('preventDefault');
            const state = plugin.getState();

            state.lastKeyPress = 'A';

            plugin.onPluginEvent({
                eventType: 'beforeKeyboardEditing',
                rawEvent: {
                    key: 'A',
                },
            } as any);

            expect(takeSnapshotSpy).toHaveBeenCalledTimes(0);
            expect(preventDefaultSpy).toHaveBeenCalledTimes(0);
            expect(undoSpy).toHaveBeenCalledTimes(0);
            expect(plugin.getState()).toEqual({
                snapshotsManager: mockedSnapshotsManager,
                isRestoring: false,
                isNested: false,
                posContainer: null,
                posOffset: null,
                lastKeyPress: 'A',
            });
            expect(mockedSnapshotsManager.hasNewContent).toBeTrue();
            expect(clearRedoSpy).toHaveBeenCalledTimes(0);
        });
    });
});
