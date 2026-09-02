import type { IEditor } from './IEditor';
import type { PluginEvent } from '../event/PluginEvent';

/**
 * An optional global hook for developer tools (such as the RoosterJS DevTools browser extension) to
 * discover and inspect editor instances on a page.
 *
 * A developer tool installs an object implementing this interface on
 * `window.__ROOSTERJS_DEVTOOLS_HOOK__`. When present, each editor will call its callbacks on
 * creation, disposal and for every plugin event. This mirrors the React DevTools global hook
 * pattern: the editor only detects and calls the hook, while all developer-tools logic lives in the
 * tool that installs it.
 *
 * For tools that attach after editors are created (for example, a script pasted into the console),
 * the library also maintains the array of live editors on `window.__ROOSTERJS_DEVTOOLS_EDITORS__`.
 *
 * All members are optional so the contract can grow without breaking older tools. The editor calls
 * each callback defensively and swallows any error, so a faulty tool can never break editing.
 */
export interface RoosterJsDevToolsHook {
    /**
     * The contract version the editor was built against. The editor stamps this onto the hook when
     * it detects it, so a tool can read it to stay compatible across editor versions. The current
     * contract version is exported as `RoosterJsDevToolsHookVersion` from
     * `roosterjs-content-model-core`.
     */
    version?: number;

    /**
     * Called right after an editor finishes initialization.
     * @param editor The editor that was created
     */
    onEditorCreated?: (editor: IEditor) => void;

    /**
     * Called right before an editor is disposed.
     * @param editor The editor that is being disposed
     */
    onEditorDisposed?: (editor: IEditor) => void;

    /**
     * Called for every plugin event dispatched by an editor, so a tool can react to content and
     * selection changes. Tools are expected to filter and debounce as needed.
     * @param editor The editor that dispatched the event
     * @param event The plugin event being dispatched
     */
    onPluginEvent?: (editor: IEditor, event: PluginEvent) => void;
}
