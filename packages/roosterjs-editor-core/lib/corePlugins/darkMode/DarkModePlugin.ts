import { createWrapper } from 'roosterjs-editor-dom';
import {
    DarkModePluginState,
    EditorOptions,
    IEditor,
    PluginWithState,
    Wrapper,
} from 'roosterjs-editor-types';

/**
 * @internal
 * Dark mode plugin, handles dark mode related color transform events
 */
export default class DarkModePlugin implements PluginWithState<DarkModePluginState> {
    private state: Wrapper<DarkModePluginState>;

    /**
     * Construct a new instance of DarkModePlugin
     * @param options The editor options
     */
    constructor(options: EditorOptions) {
        this.state = createWrapper({
            isDarkMode: options.inDarkMode,
            onExternalContentTransform: options.onExternalContentTransform,
        });
    }

    /**
     * Get a friendly name of  this plugin
     */
    getName() {
        return 'DarkMode';
    }

    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    initialize(editor: IEditor) {}

    /**
     * Dispose this plugin
     */
    dispose() {}

    /**
     * Get plugin state object
     */
    getState() {
        return this.state;
    }
}
