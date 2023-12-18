import type { CopyPastePluginState } from '../pluginState/CopyPastePluginState';
import type { UndoPluginState } from '../pluginState/UndoPluginState';
import type { SelectionPluginState } from '../pluginState/SelectionPluginState';
import type { EntityPluginState } from '../pluginState/EntityPluginState';
import type { LifecyclePluginState } from '../pluginState/LifecyclePluginState';
import type { DOMEventPluginState } from '../pluginState/DOMEventPluginState';
import type { ContentModelCachePluginState } from '../pluginState/ContentModelCachePluginState';
import type { ContentModelFormatPluginState } from '../pluginState/ContentModelFormatPluginState';
import type { PluginWithState } from 'roosterjs-editor-types';

/**
 * Core plugins for standalone editor
 */
export interface StandaloneEditorCorePlugins {
    /**
     * ContentModel cache plugin manages cached Content Model, and refresh the cache when necessary
     */
    readonly cache: PluginWithState<ContentModelCachePluginState>;

    /**
     * ContentModelFormat plugins helps editor to do formatting on top of content model.
     */
    readonly format: PluginWithState<ContentModelFormatPluginState>;

    /**
     * Copy and paste plugin for handling onCopy and onPaste event
     */
    readonly copyPaste: PluginWithState<CopyPastePluginState>;

    /**
     * DomEvent plugin helps handle additional DOM events such as IME composition, cut, drop.
     */
    readonly domEvent: PluginWithState<DOMEventPluginState>;

    /**
     * Selection plugin handles selection, including range selection, table selection, and image selection
     */
    readonly selection: PluginWithState<SelectionPluginState>;

    /**
     * Entity Plugin handles all operations related to an entity and generate entity specified events
     */
    readonly entity: PluginWithState<EntityPluginState>;

    /**
     * Undo plugin provides the ability to undo/redo
     */
    readonly undo: PluginWithState<UndoPluginState>;

    /**
     * Lifecycle plugin handles editor initialization and disposing
     */
    readonly lifecycle: PluginWithState<LifecyclePluginState>;
}
