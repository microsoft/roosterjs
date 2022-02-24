import BasePluginEvent from './BasePluginEvent';
import { ColorTransformDirection } from '..';
import { PluginEventType } from './PluginEventType';

/**
 * An event fired when an element had their color changed
 */
export default interface ColorChangedEvent extends BasePluginEvent<PluginEventType.ColorChanged> {
    /**
     * The root HTML elements to transform
     */
    rootNode: Node;

    /**
     * True to transform the root node as well, otherwise false
     */
    includeSelf: boolean;

    /**
     * The callback function to invoke before do color transformation
     */
    callback: () => void;

    /**
     * To specify the transform direction, light to dark, or dark to light
     */
    direction?: ColorTransformDirection;
}
