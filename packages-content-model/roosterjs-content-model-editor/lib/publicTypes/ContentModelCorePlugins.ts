import type { StandaloneEditorCorePlugins } from 'roosterjs-content-model-types';
import type {
    CopyPastePluginState,
    DOMEventPluginState,
    EditPluginState,
    EditorPlugin,
    EntityPluginState,
    LifecyclePluginState,
    PendingFormatStatePluginState,
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
     * DomEvent plugin helps handle additional DOM events such as IME composition, cut, drop.
     */
    readonly domEvent: PluginWithState<DOMEventPluginState>;

    /**
     * PendingFormatStatePlugin handles pending format state management
     */
    readonly pendingFormatState: PluginWithState<PendingFormatStatePluginState>;

    /**
     * MouseUpPlugin help trigger MouseUp event even when mouse up happens outside editor
     * as long as the mouse was pressed within Editor before
     */
    readonly mouseUp: EditorPlugin;

    /**
     * Copy and paste plugin for handling onCopy and onPaste event
     */
    readonly copyPaste: PluginWithState<CopyPastePluginState>;
    /**
     * Entity Plugin handles all operations related to an entity and generate entity specified events
     */

    readonly entity: PluginWithState<EntityPluginState>;

    /**
     * Image selection Plugin detects image selection and help highlight the image
     */

    readonly imageSelection: EditorPlugin;

    /**
     * NormalizeTable plugin makes sure each table in editor has TBODY/THEAD/TFOOT tag around TR tags
     */
    readonly normalizeTable: EditorPlugin;

    /**
     * Lifecycle plugin handles editor initialization and disposing
     */
    readonly lifecycle: PluginWithState<LifecyclePluginState>;
}
