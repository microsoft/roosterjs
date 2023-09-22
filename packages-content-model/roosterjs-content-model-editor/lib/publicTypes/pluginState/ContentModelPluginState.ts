import { ContentModelCachePluginState } from './ContentModelCachePluginState';
import { ContentModelFormatPluginState } from './ContentModelFormatPluginState';
import { CopyPastePluginState } from 'roosterjs-editor-types';

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
}
