import type { CopyPastePluginState } from './CopyPastePluginState';
import type { EditPluginState, EntityPluginState, UndoPluginState } from 'roosterjs-editor-types';
import type { ContentModelCachePluginState } from './ContentModelCachePluginState';
import type { ContentModelFormatPluginState } from './ContentModelFormatPluginState';
import type { DOMEventPluginState } from './DOMEventPluginState';
import type { LifecyclePluginState } from './LifecyclePluginState';

/**
 * Temporary core plugin state for Content Model editor (ported part)
 * TODO: Create Content Model plugin state from all core plugins once we have standalone Content Model Editor
 */
export interface StandaloneEditorCorePluginState {
    /**
     * Plugin state for ContentModelCachePlugin
     */
    cache: ContentModelCachePluginState;

    /**
     * Plugin state for ContentModelCopyPastePlugin
     */
    copyPaste: CopyPastePluginState;

    /**
     * Plugin state for ContentModelFormatPlugin
     */
    format: ContentModelFormatPluginState;

    /**
     * Plugin state for DOMEventPlugin
     */
    domEvent: DOMEventPluginState;

    /**
     * Plugin state for LifecyclePlugin
     */
    lifecycle: LifecyclePluginState;
}

/**
 * Temporary core plugin state for Content Model editor (unported part)
 * TODO: Port these plugins
 */
export interface UnportedCorePluginState {
    entity: EntityPluginState;
    undo: UndoPluginState;
    edit: EditPluginState;
}
