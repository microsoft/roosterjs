import { ContentModelLifecyclePluginState } from '../pluginState/ContentModelLifecyclePluginState';
import { ContentModelSelectionPluginState } from '../pluginState/ContentModelSelectionPluginState';
import type { ContentModelCachePluginState } from '../pluginState/ContentModelCachePluginState';
import type { ContentModelFormatPluginState } from '../pluginState/ContentModelFormatPluginState';
import type { PluginWithState } from './PluginWithState';

/**
 * An interface for editor core plugins.
 * These plugins are built-in and most of them are not able to be replaced
 */
export interface CorePlugins {
    /**
     * Manage cached Content Model
     */
    readonly cache: PluginWithState<ContentModelCachePluginState>;

    /**
     * Manage pending format of Content Model editor
     */
    readonly format: PluginWithState<ContentModelFormatPluginState>;

    /**
     * Selection plugin manages selections
     */
    readonly selection: PluginWithState<ContentModelSelectionPluginState>;

    /**
     * Lifecycle plugin handles editor initialization and disposing
     */
    readonly lifecycle: PluginWithState<ContentModelLifecyclePluginState>;
}
