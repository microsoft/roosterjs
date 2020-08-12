import Editor from '../../lib/editor/Editor';
import UndoPlugin, { UndoPluginState } from '../../lib/corePlugins/undo/UndoPlugin';
import { Keys } from '../../lib/interfaces/ContentEditFeature';
import { PluginEventType, Wrapper } from 'roosterjs-editor-types';

describe('UndoPlugin', () => {
    let plugin: UndoPlugin;
    let state: Wrapper<UndoPluginState>;
    let editor: Editor;
    let isInIME: jasmine.Spy;
    let addUndoSnapshot: jasmine.Spy;

    beforeEach(() => {
        plugin = new UndoPlugin({});
        state = plugin.getState();
        isInIME = jasmine.createSpy('isInIME');
        addUndoSnapshot = jasmine.createSpy('addUndoSnapshot');
        editor = <Editor>(<any>{
            isInIME,
            addUndoSnapshot,
        });
        plugin.initialize(editor);
    });

    afterEach(() => {
        plugin.dispose();
        plugin = null;
        state = null;
        editor = null;
        isInIME = null;
    });

    it('init', () => {
        expect(state.value.hasNewContent).toBeFalse();
        expect(state.value.isRestoring).toBeFalse();
        expect(state.value.outerUndoSnapshot).toBeNull();
        expect(state.value.snapshotsService).toBeDefined();
    });

    it('editor ready event', () => {
        let canUndo = jasmine.createSpy('canUndo').and.returnValue(false);
        let canRedo = jasmine.createSpy('canRedo').and.returnValue(false);
        editor.canUndo = canUndo;
        editor.canRedo = canRedo;

        plugin.onPluginEvent({
            eventType: PluginEventType.EditorReady,
            startPosition: null,
        });

        expect(isInIME).toHaveBeenCalled();
        expect(canUndo).toHaveBeenCalled();
        expect(canRedo).toHaveBeenCalled();
        expect(addUndoSnapshot).toHaveBeenCalled();
    });

    it('editor ready event where can undo', () => {
        let canUndo = jasmine.createSpy('canUndo').and.returnValue(true);
        let canRedo = jasmine.createSpy('canRedo').and.returnValue(false);
        editor.canUndo = canUndo;
        editor.canRedo = canRedo;

        plugin.onPluginEvent({
            eventType: PluginEventType.EditorReady,
            startPosition: null,
        });

        expect(isInIME).toHaveBeenCalled();
        expect(canUndo).toHaveBeenCalled();
        expect(canRedo).not.toHaveBeenCalled();
        expect(addUndoSnapshot).not.toHaveBeenCalledWith(state.value);
    });

    it('editor ready event where can redo', () => {
        let canUndo = jasmine.createSpy('canUndo').and.returnValue(false);
        let canRedo = jasmine.createSpy('canRedo').and.returnValue(true);
        editor.canUndo = canUndo;
        editor.canRedo = canRedo;

        plugin.onPluginEvent({
            eventType: PluginEventType.EditorReady,
            startPosition: null,
        });

        expect(isInIME).toHaveBeenCalled();
        expect(canUndo).toHaveBeenCalled();
        expect(canRedo).toHaveBeenCalled();
        expect(addUndoSnapshot).not.toHaveBeenCalledWith(state.value);
    });

    it('key down event with BACKSPACE, add undo snapshot once', () => {
        editor.getSelectionRange = () => {
            return <any>{
                collapsed: true,
            };
        };
        plugin.onPluginEvent({
            eventType: PluginEventType.KeyDown,
            rawEvent: <any>{
                which: Keys.BACKSPACE,
            },
        });

        expect(addUndoSnapshot).toHaveBeenCalledTimes(1);

        // Backspace again, no need to add undo snapshot now
        (<jasmine.Spy>addUndoSnapshot).calls.reset();
        plugin.onPluginEvent({
            eventType: PluginEventType.KeyDown,
            rawEvent: <any>{
                which: Keys.BACKSPACE,
            },
        });

        expect(addUndoSnapshot).not.toHaveBeenCalled();

        // Backspace again, with ctrl key pressed, addUndoSnapshot
        (<jasmine.Spy>addUndoSnapshot).calls.reset();
        plugin.onPluginEvent({
            eventType: PluginEventType.KeyDown,
            rawEvent: <any>{
                which: Keys.BACKSPACE,
                ctrlKey: true,
            },
        });

        expect(addUndoSnapshot).toHaveBeenCalled();

        // Backspace again, with expanded range, addUndoSnapshot
        (<jasmine.Spy>addUndoSnapshot).calls.reset();
        editor.getSelectionRange = () => {
            return <any>{
                collapsed: false,
            };
        };
        plugin.onPluginEvent({
            eventType: PluginEventType.KeyDown,
            rawEvent: <any>{
                which: Keys.BACKSPACE,
            },
        });

        expect(addUndoSnapshot).toHaveBeenCalled();
    });

    it('key down event with DELETE, add undo snapshot once', () => {
        editor.getSelectionRange = () => {
            return <any>{
                collapsed: true,
            };
        };
        plugin.onPluginEvent({
            eventType: PluginEventType.KeyDown,
            rawEvent: <any>{
                which: Keys.DELETE,
            },
        });

        expect(addUndoSnapshot).toHaveBeenCalledTimes(1);

        // DELETE again, no need to add undo snapshot now
        (<jasmine.Spy>addUndoSnapshot).calls.reset();
        plugin.onPluginEvent({
            eventType: PluginEventType.KeyDown,
            rawEvent: <any>{
                which: Keys.DELETE,
            },
        });

        expect(addUndoSnapshot).not.toHaveBeenCalled();

        // DELETE again, with ctrl key pressed, addUndoSnapshot
        (<jasmine.Spy>addUndoSnapshot).calls.reset();
        plugin.onPluginEvent({
            eventType: PluginEventType.KeyDown,
            rawEvent: <any>{
                which: Keys.DELETE,
                ctrlKey: true,
            },
        });

        expect(addUndoSnapshot).toHaveBeenCalled();

        // DELETE again, with expanded range, addUndoSnapshot
        (<jasmine.Spy>addUndoSnapshot).calls.reset();
        editor.getSelectionRange = () => {
            return <any>{
                collapsed: false,
            };
        };
        plugin.onPluginEvent({
            eventType: PluginEventType.KeyDown,
            rawEvent: <any>{
                which: Keys.DELETE,
            },
        });

        expect(addUndoSnapshot).toHaveBeenCalled();
    });

    it('key down event with DELETE then BACKSPACE, add undo snapshot twice', () => {
        editor.getSelectionRange = () => {
            return <any>{
                collapsed: true,
            };
        };
        plugin.onPluginEvent({
            eventType: PluginEventType.KeyDown,
            rawEvent: <any>{
                which: Keys.DELETE,
            },
        });
        plugin.onPluginEvent({
            eventType: PluginEventType.KeyDown,
            rawEvent: <any>{
                which: Keys.BACKSPACE,
            },
        });

        expect(addUndoSnapshot).toHaveBeenCalledTimes(2);
    });

    it('key down event with cursor moving and has new content, add undo snapshot each time', () => {
        editor.getSelectionRange = () => {
            return <any>{
                collapsed: true,
            };
        };

        const KEY_PAGEUP = 33;
        const KEY_DOWN = 40;
        for (let which = KEY_PAGEUP; which <= KEY_DOWN; which++) {
            state.value.hasNewContent = true;
            plugin.onPluginEvent({
                eventType: PluginEventType.KeyDown,
                rawEvent: <any>{
                    which,
                },
            });
        }

        expect(addUndoSnapshot).toHaveBeenCalledTimes(KEY_DOWN - KEY_PAGEUP + 1);
    });

    it('key down event with cursor moving and but no new content, no undo snapshot each time', () => {
        editor.getSelectionRange = () => {
            return <any>{
                collapsed: true,
            };
        };

        const KEY_PAGEUP = 33;
        const KEY_DOWN = 40;
        for (let which = KEY_PAGEUP; which <= KEY_DOWN; which++) {
            state.value.hasNewContent = false;
            plugin.onPluginEvent({
                eventType: PluginEventType.KeyDown,
                rawEvent: <any>{
                    which,
                },
            });
        }

        expect(addUndoSnapshot).not.toHaveBeenCalled();
    });

    it('delete, page up,  delete, no new content, add undo snapshot twice', () => {
        editor.getSelectionRange = () => {
            return <any>{
                collapsed: true,
            };
        };

        const KEY_PAGEUP = 33;

        [Keys.DELETE, KEY_PAGEUP, Keys.DELETE].forEach(which => {
            state.value.hasNewContent = false;
            plugin.onPluginEvent({
                eventType: PluginEventType.KeyDown,
                rawEvent: <any>{
                    which,
                },
            });
        });

        expect(addUndoSnapshot).toHaveBeenCalledTimes(2);
    });

    it('key press event with expanded range', () => {
        editor.getSelectionRange = () => {
            return <any>{
                collapsed: false,
            };
        };

        state.value.hasNewContent = false;
        plugin.onPluginEvent({
            eventType: PluginEventType.KeyPress,
            rawEvent: <any>{
                which: 65,
            },
        });

        expect(addUndoSnapshot).toHaveBeenCalled();
    });

    it('key press event with collapsed range', () => {
        editor.getSelectionRange = () => {
            return <any>{
                collapsed: true,
            };
        };

        const clearRedo = jasmine.createSpy('clearRedo');
        state.value.hasNewContent = false;
        state.value.snapshotsService.clearRedo = clearRedo;
        plugin.onPluginEvent({
            eventType: PluginEventType.KeyPress,
            rawEvent: <any>{
                which: 65,
            },
        });

        expect(addUndoSnapshot).not.toHaveBeenCalled();
        expect(state.value.hasNewContent).toBeTrue();
        expect(clearRedo).toHaveBeenCalled();
    });

    it('key press event with SPACE key in collapsed range', () => {
        editor.getSelectionRange = () => {
            return <any>{
                collapsed: true,
            };
        };

        state.value.hasNewContent = false;
        plugin.onPluginEvent({
            eventType: PluginEventType.KeyPress,
            rawEvent: <any>{
                which: Keys.SPACE,
            },
        });

        expect(addUndoSnapshot).toHaveBeenCalled();
        expect(state.value.hasNewContent).toBeFalse();

        // Press SPACE again, no undo snapshot added
        (<jasmine.Spy>addUndoSnapshot).calls.reset();
        plugin.onPluginEvent({
            eventType: PluginEventType.KeyPress,
            rawEvent: <any>{
                which: Keys.SPACE,
            },
        });
        expect(addUndoSnapshot).not.toHaveBeenCalled();
    });

    it('key press event with ENTER key in collapsed range', () => {
        editor.getSelectionRange = () => {
            return <any>{
                collapsed: true,
            };
        };

        state.value.hasNewContent = false;
        plugin.onPluginEvent({
            eventType: PluginEventType.KeyPress,
            rawEvent: <any>{
                which: Keys.ENTER,
            },
        });

        expect(addUndoSnapshot).toHaveBeenCalled();
        expect(state.value.hasNewContent).toBeTrue();

        // Press ENTER again, add one more snapshot
        (<jasmine.Spy>addUndoSnapshot).calls.reset();
        plugin.onPluginEvent({
            eventType: PluginEventType.KeyPress,
            rawEvent: <any>{
                which: Keys.SPACE,
            },
        });
        expect(addUndoSnapshot).toHaveBeenCalled();
    });

    it('CompositionEnd event', () => {
        plugin.onPluginEvent({
            eventType: PluginEventType.CompositionEnd,
            rawEvent: <any>{},
        });
        expect(addUndoSnapshot).toHaveBeenCalled();
    });

    it('ContentChanged event', () => {
        state.value.hasNewContent = false;
        const clearRedo = jasmine.createSpy('clearRedo');
        state.value.snapshotsService.clearRedo = clearRedo;
        plugin.onPluginEvent({
            eventType: PluginEventType.ContentChanged,
            source: '',
        });
        expect(addUndoSnapshot).not.toHaveBeenCalled();
        expect(state.value.hasNewContent).toBeTrue();
        expect(clearRedo).toHaveBeenCalled();
    });

    it('customized UndoSnapshotService', () => {
        const canMove = jasmine.createSpy('canMove');
        const move = jasmine.createSpy('move');
        const addSnapshot = jasmine.createSpy('addSnapshot');
        const clearRedo = jasmine.createSpy('clearRedo');

        plugin = new UndoPlugin({
            undoSnapshotService: {
                canMove,
                move,
                addSnapshot,
                clearRedo,
            },
        });

        plugin.initialize(<Editor>(<any>{
            getSelectionRange: () => ({
                collapsed: true,
            }),
            isInIME,
        }));

        plugin.onPluginEvent({
            eventType: PluginEventType.KeyPress,
            rawEvent: <any>{
                which: 65,
            },
        });

        expect(clearRedo).toHaveBeenCalled();
    });
});
