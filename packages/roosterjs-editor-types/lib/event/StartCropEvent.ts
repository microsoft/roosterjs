import BasePluginEvent from './BasePluginEvent';
import { PluginEventType } from './PluginEventType';

/**
 * Provides a chance for plugin to change the content before it is pasted into editor.
 */
export default interface StartCropEvent extends BasePluginEvent<PluginEventType.StartCrop> {
    test: string; // DELETE?
}
