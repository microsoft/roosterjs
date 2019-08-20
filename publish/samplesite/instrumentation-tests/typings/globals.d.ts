import { EditorInstanceToggleablePlugins } from '../../scripts/controls/editor/EditorInstanceToggleablePlugins';
// import Plugins from '../../scripts/controls/plugins';
import { Editor } from 'roosterjs-editor-core';

declare global {
    interface Window {
        /**
         * Toggleable plugins that are fed into the rooster editor
         */
        globalRoosterEditorNamedPlugins: EditorInstanceToggleablePlugins;
        /**
         * The editor instance for the sample site.
         */
        globalRoosterEditor: Editor;
    }
}
