import UndoPlugin from '../../lib/corePlugins/UndoPlugin';
import { IEditor, Keys, PluginEventType, UndoPluginState } from 'roosterjs-editor-types';
import { Position } from 'roosterjs-editor-dom';

describe('UndoPlugin', () => {
    let plugin: UndoPlugin;
    let state: UndoPluginState;
    let editor: IEditor;
    let isInIME: jasmine.Spy;
    let addUndoSnapshot: jasmine.Spy;

    beforeEach(() => {
        plugin = new UndoPlugin({});
        state = plugin.getState();
        isInIME = jasmine.createSpy('isInIME');
        addUndoSnapshot = jasmine.createSpy('addUndoSnapshot');
        editor = <IEditor>(<any>{
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
        expect(state.hasNewContent).toBeFalse();
        expect(state.isRestoring).toBeFalse();
        expect(state.isNested).toBeFalsy();
        expect(state.snapshotsService).toBeDefined();
    });

    it('editor ready event', () => {
        let getUndoState = jasmine.createSpy('getUndoState').and.returnValue({
            canUndo: false,
            canRedo: false,
        });
        editor.getUndoState = getUndoState;

        plugin.onPluginEvent({
            eventType: PluginEventType.EditorReady,
        });

        expect(isInIME).toHaveBeenCalled();
        expect(getUndoState).toHaveBeenCalled();
        expect(addUndoSnapshot).toHaveBeenCalled();
    });

    it('editor ready event where can undo', () => {
        let getUndoState = jasmine.createSpy('getUndoState').and.returnValue({
            canUndo: true,
            canRedo: false,
        });
        editor.getUndoState = getUndoState;

        plugin.onPluginEvent({
            eventType: PluginEventType.EditorReady,
        });

        expect(isInIME).toHaveBeenCalled();
        expect(getUndoState).toHaveBeenCalled();
        expect(addUndoSnapshot).not.toHaveBeenCalledWith(state);
    });

    it('editor ready event where can redo', () => {
        let getUndoState = jasmine.createSpy('getUndoState').and.returnValue({
            canUndo: false,
            canRedo: true,
        });
        editor.getUndoState = getUndoState;

        plugin.onPluginEvent({
            eventType: PluginEventType.EditorReady,
        });

        expect(isInIME).toHaveBeenCalled();
        expect(getUndoState).toHaveBeenCalled();
        expect(addUndoSnapshot).not.toHaveBeenCalledWith(state);
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
            state.hasNewContent = true;
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
            state.hasNewContent = false;
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
            state.hasNewContent = false;
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

        state.hasNewContent = false;
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
        state.hasNewContent = false;
        state.snapshotsService.clearRedo = clearRedo;
        plugin.onPluginEvent({
            eventType: PluginEventType.KeyPress,
            rawEvent: <any>{
                which: 65,
            },
        });

        expect(addUndoSnapshot).not.toHaveBeenCalled();
        expect(state.hasNewContent).toBeTrue();
        expect(clearRedo).toHaveBeenCalled();
    });

    it('key press event with SPACE key in collapsed range', () => {
        editor.getSelectionRange = () => {
            return <any>{
                collapsed: true,
            };
        };

        state.hasNewContent = false;
        plugin.onPluginEvent({
            eventType: PluginEventType.KeyPress,
            rawEvent: <any>{
                which: Keys.SPACE,
            },
        });

        expect(addUndoSnapshot).toHaveBeenCalled();
        expect(state.hasNewContent).toBeFalse();

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

        state.hasNewContent = false;
        plugin.onPluginEvent({
            eventType: PluginEventType.KeyPress,
            rawEvent: <any>{
                which: Keys.ENTER,
            },
        });

        expect(addUndoSnapshot).toHaveBeenCalled();
        expect(state.hasNewContent).toBeTrue();

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
        state.hasNewContent = false;
        const clearRedo = jasmine.createSpy('clearRedo');
        state.snapshotsService.clearRedo = clearRedo;
        plugin.onPluginEvent({
            eventType: PluginEventType.ContentChanged,
            source: '',
        });
        expect(addUndoSnapshot).not.toHaveBeenCalled();
        expect(state.hasNewContent).toBeTrue();
        expect(clearRedo).toHaveBeenCalled();
    });

    it('customized UndoSnapshotService', () => {
        const canMove = jasmine.createSpy('canMove');
        const move = jasmine.createSpy('move');
        const addSnapshot = jasmine.createSpy('addSnapshot');
        const clearRedo = jasmine.createSpy('clearRedo');
        const canUndoAutoComplete = jasmine.createSpy('canUndoAutoComplete');

        plugin = new UndoPlugin({
            undoSnapshotService: {
                canMove,
                move,
                addSnapshot,
                clearRedo,
                canUndoAutoComplete,
            },
        });

        plugin.initialize(<IEditor>(<any>{
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

    it('can undo autoComplete', () => {
        state.snapshotsService.addSnapshot('snapshot 1', false);
        state.snapshotsService.addSnapshot('snapshot 2', true);
        state.snapshotsService.addSnapshot('snapshot 3', false);
        expect(state.snapshotsService.canUndoAutoComplete()).toBeTrue();
    });

    it('cannot undo autoComplete', () => {
        state.snapshotsService.addSnapshot('snapshot 1', false);
        state.snapshotsService.addSnapshot('snapshot 2', true);
        state.snapshotsService.addSnapshot('snapshot 3', false);
        state.snapshotsService.addSnapshot('snapshot 4', false);
        expect(state.snapshotsService.canUndoAutoComplete()).toBeFalse();
    });

    it('Backspace trigger undo when can undo autoComplete', () => {
        state.snapshotsService.addSnapshot('snapshot 1', false);
        state.snapshotsService.addSnapshot('snapshot 2', true);
        state.snapshotsService.addSnapshot('snapshot 3', false);

        const undo = jasmine.createSpy('undo');
        const preventDefault = jasmine.createSpy('preventDefault');
        const range = document.createRange();
        const pos = Position.getStart(range);
        editor.undo = undo;
        editor.getSelectionRange = () => range;
        editor.getFocusedPosition = () => pos;
        state.autoCompletePosition = pos;

        plugin.onPluginEvent({
            eventType: PluginEventType.KeyDown,
            rawEvent: <KeyboardEvent>(<any>{
                which: Keys.BACKSPACE,
                preventDefault,
            }),
        });

        expect(undo).toHaveBeenCalled();
        expect(preventDefault).toHaveBeenCalled();
        expect(state.autoCompletePosition).toBeNull();
    });

    it('Other key does not trigger undo auto complete', () => {
        state.snapshotsService.addSnapshot('snapshot 1', false);
        state.snapshotsService.addSnapshot('snapshot 2', true);
        state.snapshotsService.addSnapshot('snapshot 3', false);

        const undo = jasmine.createSpy('undo');
        const preventDefault = jasmine.createSpy('preventDefault');
        const range = document.createRange();
        const pos = Position.getStart(range);
        editor.undo = undo;
        editor.getSelectionRange = () => range;
        editor.getFocusedPosition = () => pos;
        state.autoCompletePosition = pos;

        plugin.onPluginEvent({
            eventType: PluginEventType.KeyDown,
            rawEvent: <KeyboardEvent>(<any>{
                which: Keys.ENTER,
                preventDefault,
            }),
        });

        expect(undo).not.toHaveBeenCalled();
        expect(preventDefault).not.toHaveBeenCalled();
        expect(state.autoCompletePosition).not.toBeNull();
        expect(state.snapshotsService.canUndoAutoComplete()).toBeTrue();
    });

    it('Another undo snapshot is added, cannot undo autocomplete any more', () => {
        state.snapshotsService.addSnapshot('snapshot 1', false);
        state.snapshotsService.addSnapshot('snapshot 2', true);
        state.snapshotsService.addSnapshot('snapshot 3', false);

        const undo = jasmine.createSpy('undo');
        const preventDefault = jasmine.createSpy('preventDefault');
        const range = document.createRange();
        const pos = Position.getStart(range);
        editor.undo = undo;
        editor.getSelectionRange = () => range;
        editor.getFocusedPosition = () => pos;
        editor.addUndoSnapshot = () => state.snapshotsService.addSnapshot('snapshot 4', false);
        state.autoCompletePosition = pos;

        plugin.onPluginEvent({
            eventType: PluginEventType.KeyDown,
            rawEvent: <KeyboardEvent>(<any>{
                which: Keys.DELETE,
                ctrlKey: true,
                preventDefault,
            }),
        });

        expect(undo).not.toHaveBeenCalled();
        expect(preventDefault).not.toHaveBeenCalled();
        expect(state.autoCompletePosition).toBeNull();
        expect(state.snapshotsService.canUndoAutoComplete()).toBeFalse();
    });

    it('Position changed, cannot undo autocomplete for Backspace', () => {
        state.snapshotsService.addSnapshot('snapshot 1', false);

        const undo = jasmine.createSpy('undo');
        const preventDefault = jasmine.createSpy('preventDefault');
        const range = document.createRange();
        const pos = Position.getStart(range);
        editor.undo = undo;
        editor.getSelectionRange = () => range;

        const pos2 = new Position(pos);
        (<any>pos2).offset++; // hack, just want to make pos2 different from pos

        editor.getFocusedPosition = () => pos2;
        editor.addUndoSnapshot = () => state.snapshotsService.addSnapshot('snapshot 4', false);

        // Press backspace first time, to let plugin remember last pressed key
        plugin.onPluginEvent({
            eventType: PluginEventType.KeyDown,
            rawEvent: <KeyboardEvent>(<any>{
                which: Keys.BACKSPACE,
                preventDefault,
            }),
        });

        state.snapshotsService.addSnapshot('snapshot 2', true);
        state.snapshotsService.addSnapshot('snapshot 3', false);
        state.autoCompletePosition = pos;

        plugin.onPluginEvent({
            eventType: PluginEventType.KeyDown,
            rawEvent: <KeyboardEvent>(<any>{
                which: Keys.BACKSPACE,
                preventDefault,
            }),
        });

        expect(undo).not.toHaveBeenCalled();
        expect(preventDefault).not.toHaveBeenCalled();
        expect(state.autoCompletePosition).not.toBeNull();
        expect(state.snapshotsService.canUndoAutoComplete()).toBeTrue();
    });
});
