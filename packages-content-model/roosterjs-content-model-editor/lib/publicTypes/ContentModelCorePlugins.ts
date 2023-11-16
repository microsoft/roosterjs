import type { StandaloneEditorCorePlugins } from 'roosterjs-content-model-types';
import type {
    CopyPastePluginState,
    EditPluginState,
    EditorPlugin,
    PluginWithState,
    UndoPluginState,
} from 'roosterjs-editor-types';

/**
 * An interface for Content Model editor core plugins.
 */
export interface ContentModelCorePlugins extends StandaloneEditorCorePlugins {
    /**
     * Edit plugin handles ContentEditFeatures
     */
    readonly edit: PluginWithState<EditPluginState>;

    /**
     * Undo plugin provides the ability to undo/redo
     */
    readonly undo: PluginWithState<UndoPluginState>;

    /**
     * Copy and paste plugin for handling onCopy and onPaste event
     */
    readonly copyPaste: PluginWithState<CopyPastePluginState>;

    /**
     * Image selection Plugin detects image selection and help highlight the image
     */

    readonly imageSelection: EditorPlugin;

    /**
     * NormalizeTable plugin makes sure each table in editor has TBODY/THEAD/TFOOT tag around TR tags
     */
    readonly normalizeTable: EditorPlugin;
}
