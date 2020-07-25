import CorePlugins, { PluginKey } from './CorePlugins';
import PluginWithState from './PluginWithState';
import { Wrapper } from 'roosterjs-editor-types';

export type KeyOfStatePlugin<Key extends PluginKey> = CorePlugins[Key] extends PluginWithState<
    infer U
>
    ? Key
    : never;

export type TypeOfStatePlugin<Key extends PluginKey> = CorePlugins[Key] extends PluginWithState<
    infer U
>
    ? Wrapper<U>
    : never;

export type StatePluginKeys<Key extends PluginKey> = { [P in Key]: KeyOfStatePlugin<P> }[Key];

export type PluginState<Key extends PluginKey> = {
    [P in StatePluginKeys<Key>]: TypeOfStatePlugin<P>;
};

export default interface CorePluginState extends PluginState<PluginKey> {}
