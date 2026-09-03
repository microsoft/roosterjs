import {
    notifyDevToolsEditorCreated,
    notifyDevToolsEditorDisposed,
    notifyDevToolsPluginEvent,
    RoosterJsDevToolsHookVersion,
} from '../../lib/utils/devtoolsHook';
import type {
    EditorCore,
    IEditor,
    PluginEvent,
    RoosterJsDevToolsHook,
} from 'roosterjs-content-model-types';

describe('devtoolsHook', () => {
    let createdEditors: IEditor[];
    let disposedEditors: IEditor[];
    let events: { editor: IEditor; event: PluginEvent }[];
    let hook: RoosterJsDevToolsHook;
    const win = window as any;
    let originalHook: RoosterJsDevToolsHook | undefined;
    let originalEditors: IEditor[] | undefined;

    beforeEach(() => {
        originalHook = win.__ROOSTERJS_DEVTOOLS_HOOK__;
        originalEditors = win.__ROOSTERJS_DEVTOOLS_EDITORS__;
        delete win.__ROOSTERJS_DEVTOOLS_HOOK__;
        delete win.__ROOSTERJS_DEVTOOLS_EDITORS__;

        createdEditors = [];
        disposedEditors = [];
        events = [];
        hook = {
            onEditorCreated: e => createdEditors.push(e),
            onEditorDisposed: e => disposedEditors.push(e),
            onPluginEvent: (e, ev) => events.push({ editor: e, event: ev }),
        };
    });

    afterEach(() => {
        if (originalHook) {
            win.__ROOSTERJS_DEVTOOLS_HOOK__ = originalHook;
        } else {
            delete win.__ROOSTERJS_DEVTOOLS_HOOK__;
        }

        if (originalEditors) {
            win.__ROOSTERJS_DEVTOOLS_EDITORS__ = originalEditors;
        } else {
            delete win.__ROOSTERJS_DEVTOOLS_EDITORS__;
        }
    });

    function mockEditor(): IEditor {
        return ({ getDocument: () => document } as any) as IEditor;
    }

    function mockCore(): EditorCore {
        return {} as EditorCore;
    }

    function mockEvent(): PluginEvent {
        return ({ eventType: 'input' } as any) as PluginEvent;
    }

    it('tracks live editors in the global array even without a hook', () => {
        const editor = mockEditor();

        notifyDevToolsEditorCreated(editor, mockCore());

        expect(win.__ROOSTERJS_DEVTOOLS_EDITORS__).toEqual([editor]);
    });

    it('calls onEditorCreated and stamps the contract version', () => {
        win.__ROOSTERJS_DEVTOOLS_HOOK__ = hook;
        const editor = mockEditor();

        notifyDevToolsEditorCreated(editor, mockCore());

        expect(createdEditors).toEqual([editor]);
        expect(hook.version).toBe(RoosterJsDevToolsHookVersion);
    });

    it('calls onEditorDisposed and removes the editor from the array', () => {
        win.__ROOSTERJS_DEVTOOLS_HOOK__ = hook;
        const editor = mockEditor();
        const core = mockCore();

        notifyDevToolsEditorCreated(editor, core);
        notifyDevToolsEditorDisposed(editor, core);

        expect(disposedEditors).toEqual([editor]);
        expect(win.__ROOSTERJS_DEVTOOLS_EDITORS__).toEqual([]);
    });

    it('forwards plugin events attributed to the right editor', () => {
        win.__ROOSTERJS_DEVTOOLS_HOOK__ = hook;
        const editor = mockEditor();
        const core = mockCore();
        const event = mockEvent();

        notifyDevToolsEditorCreated(editor, core);
        notifyDevToolsPluginEvent(core, event);

        expect(events).toEqual([{ editor, event }]);
    });

    it('ignores plugin events for unknown cores', () => {
        win.__ROOSTERJS_DEVTOOLS_HOOK__ = hook;

        notifyDevToolsPluginEvent(mockCore(), mockEvent());

        expect(events).toEqual([]);
    });

    it('never throws when no hook is installed', () => {
        const editor = mockEditor();
        const core = mockCore();

        expect(() => {
            notifyDevToolsEditorCreated(editor, core);
            notifyDevToolsPluginEvent(core, mockEvent());
            notifyDevToolsEditorDisposed(editor, core);
        }).not.toThrow();
    });
});
