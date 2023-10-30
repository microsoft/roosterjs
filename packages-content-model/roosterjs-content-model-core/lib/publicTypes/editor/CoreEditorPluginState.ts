import type { CoreEditorPluginWithState } from './CoreEditorPluginWithState';
import type { CoreEditorCorePlugins } from './CoreEditorCorePlugins';

/**
 * @internal
 * Names of core plugins
 */
export type PluginKey = keyof CoreEditorCorePlugins;

/**
 * @internal
 * Names of the core plugins that have plugin state
 */
export type KeyOfStatePlugin<
    Key extends PluginKey
> = CoreEditorCorePlugins[Key] extends CoreEditorPluginWithState<infer U> ? Key : never;

/**
 * @internal
 * Get type of a plugin with state
 */
export type TypeOfStatePlugin<
    Key extends PluginKey
> = CoreEditorCorePlugins[Key] extends CoreEditorPluginWithState<infer U> ? U : never;

/**
 * @internal
 * All names of plugins with plugin state
 */
export type StatePluginKeys<Key extends PluginKey> = { [P in Key]: KeyOfStatePlugin<P> }[Key];

/**
 * @internal
 * A type map from name of plugin with state to its plugin type
 */
export type GenericPluginState<Key extends PluginKey> = {
    [P in StatePluginKeys<Key>]: TypeOfStatePlugin<P>;
};

/**
 * @internal
 * Auto-calculated State object type for plugin with states
 */
export type CoreEditorPluginState = GenericPluginState<PluginKey>;
