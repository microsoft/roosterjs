import type {
    EditorCore,
    IEditor,
    PluginEvent,
    RoosterJsDevToolsHook,
} from 'roosterjs-content-model-types';

/**
 * The current version of the RoosterJS DevTools hook contract (see
 * {@link RoosterJsDevToolsHook}). The editor stamps this onto the installed hook so a developer
 * tool can adapt to the editor's capabilities. Bump this whenever the shape of the contract changes
 * in a way tools may need to detect.
 *
 * History:
 * - 1: onEditorCreated, onEditorDisposed, onPluginEvent
 */
export const RoosterJsDevToolsHookVersion: number = 1;

interface DevToolsGlobals {
    /**
     * The hook object installed by a developer tool to receive editor notifications
     */
    __ROOSTERJS_DEVTOOLS_HOOK__?: RoosterJsDevToolsHook;

    /**
     * An array maintained by the library that always tracks the currently live editor instances on
     * the page, so a tool attaching after editors are created can still discover them.
     */
    __ROOSTERJS_DEVTOOLS_EDITORS__?: IEditor[];
}

// Maps an editor core back to its IEditor wrapper, so plugin events (which only carry the core)
// can be attributed to the right editor when forwarded to developer tools.
const coreToEditor = new WeakMap<EditorCore, IEditor>();

/**
 * @internal
 * Notify developer tools that an editor has been created. Failures are swallowed so developer
 * tools can never break the editor.
 * @param editor The editor that was created
 * @param core The editor core, used to attribute later plugin events to this editor
 */
export function notifyDevToolsEditorCreated(editor: IEditor, core: EditorCore) {
    safeCall(() => {
        coreToEditor.set(core, editor);

        const win = editor.getDocument().defaultView as (Window & DevToolsGlobals) | null;

        if (win) {
            const editors = win.__ROOSTERJS_DEVTOOLS_EDITORS__ ?? [];

            editors.push(editor);
            win.__ROOSTERJS_DEVTOOLS_EDITORS__ = editors;

            const hook = win.__ROOSTERJS_DEVTOOLS_HOOK__;

            if (hook) {
                hook.version = RoosterJsDevToolsHookVersion;
                hook.onEditorCreated?.(editor);
            }
        }
    });
}

/**
 * @internal
 * Notify developer tools that an editor is about to be disposed. Failures are swallowed so
 * developer tools can never break the editor.
 * @param editor The editor that is being disposed
 * @param core The editor core to stop tracking
 */
export function notifyDevToolsEditorDisposed(editor: IEditor, core: EditorCore) {
    safeCall(() => {
        coreToEditor.delete(core);

        const win = editor.getDocument().defaultView as (Window & DevToolsGlobals) | null;

        if (win) {
            const editors = win.__ROOSTERJS_DEVTOOLS_EDITORS__;
            const index = editors ? editors.indexOf(editor) : -1;

            if (editors && index >= 0) {
                editors.splice(index, 1);
            }

            win.__ROOSTERJS_DEVTOOLS_HOOK__?.onEditorDisposed?.(editor);
        }
    });
}

/**
 * @internal
 * Forward a plugin event to developer tools, if a hook is installed. Failures are swallowed so
 * developer tools can never break the editor.
 * @param core The editor core that dispatched the event
 * @param event The plugin event being dispatched
 */
export function notifyDevToolsPluginEvent(core: EditorCore, event: PluginEvent) {
    safeCall(() => {
        const editor = coreToEditor.get(core);
        const win = editor?.getDocument().defaultView as (Window & DevToolsGlobals) | null;

        if (editor && win) {
            win.__ROOSTERJS_DEVTOOLS_HOOK__?.onPluginEvent?.(editor, event);
        }
    });
}

function safeCall(callback: () => void) {
    try {
        callback();
    } catch {}
}
