import BasePluginEvent from './BasePluginEvent';
import NodePosition from '../interface/NodePosition';
import { PluginEventType } from './PluginEventType';

/**
 * Provides a chance for plugin to change the content before it is pasted into editor.
 */
export default interface EditorReadyEvent extends BasePluginEvent<PluginEventType.EditorReady> {
    startPosition: NodePosition;
}
