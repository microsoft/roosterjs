import type { LifecyclePluginState } from './LifecyclePluginState';
import type { ContentModelCachePluginState } from './ContentModelCachePluginState';
import type { ContentModelFormatPluginState } from './ContentModelFormatPluginState';
import type { DOMEventPluginState } from './DOMEventPluginState';
import type {
    CopyPastePluginState,
    EditPluginState,
    EntityPluginState,
    UndoPluginState,
} from 'roosterjs-editor-types';

/**
 * Temporary core plugin state for Content Model editor
 * TODO: Create Content Model plugin state from all core plugins once we have standalone Content Model Editor
 */
export interface ContentModelPluginState {
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

    // Plugins copied from legacy editor
    entity: EntityPluginState;
    undo: UndoPluginState;
    edit: EditPluginState;
}
