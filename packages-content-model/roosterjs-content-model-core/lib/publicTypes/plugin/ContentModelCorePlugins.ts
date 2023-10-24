import { ContentModelCachePluginState } from '../pluginState/ContentModelCachePluginState';
import { ContentModelEditorPlugin } from './ContentModelEditorPlugin';
import { ContentModelFormatPluginState } from '../pluginState/ContentModelFormatPluginState';
import { ContentModelPluginWithState } from './ContentModelPluginWithState';

/**
 * An interface for editor core plugins.
 * These plugins are built-in and most of them are not able to be replaced
 */
export interface ContentModelCorePlugins {
    /**
     * Manage cached Content Model
     */
    readonly cache: ContentModelPluginWithState<ContentModelCachePluginState>;

    /**
     * Manage pending format of Content Model editor
     */
    readonly format: ContentModelPluginWithState<ContentModelFormatPluginState>;

    /**
     * Edit plugin handles ContentEditFeatures
     */
    readonly edit: ContentModelEditorPlugin;
}
