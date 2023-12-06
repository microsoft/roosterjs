import type { StandaloneEditorCorePlugins } from 'roosterjs-content-model-types';
import type {
    EditPluginState,
    EditorPlugin,
    PluginWithState,
    UndoPluginState,
} from 'roosterjs-editor-types';

/**
 * An interface for unported core plugins
 * TODO: Port these plugins
 */
export interface UnportedCorePlugins {
    /**
     * Translate Standalone editor event type to legacy event type
     */
    readonly eventTranslate: EditorPlugin;

    /**
     * Edit plugin handles ContentEditFeatures
     */
    readonly edit: PluginWithState<EditPluginState>;

    /**
     * Undo plugin provides the ability to undo/redo
     */
    readonly undo: PluginWithState<UndoPluginState>;

    /**
     * Image selection Plugin detects image selection and help highlight the image
     */

    readonly imageSelection: EditorPlugin;

    /**
     * NormalizeTable plugin makes sure each table in editor has TBODY/THEAD/TFOOT tag around TR tags
     */
    readonly normalizeTable: EditorPlugin;
}

/**
 * An interface for Content Model editor core plugins.
 */
export interface ContentModelCorePlugins extends StandaloneEditorCorePlugins, UnportedCorePlugins {}
