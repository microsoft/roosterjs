import EditorPlugin from './EditorPlugin';
import { Wrapper } from 'roosterjs-editor-types';

export default interface PluginWithState<T> extends EditorPlugin {
    readonly state: Wrapper<T>;
}
