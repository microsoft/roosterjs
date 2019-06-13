import { Browser } from 'roosterjs-editor-dom';
import { EditorCore } from '..';
import { PluginEventType } from 'roosterjs-editor-types';

const EVENT_MAPPING: { [domEvent: string]: PluginEventType } = {
    keypress: PluginEventType.KeyPress,
    keydown: PluginEventType.KeyDown,
    keyup: PluginEventType.KeyUp,
    mousedown: PluginEventType.MouseDown,
    [Browser.isIE ? 'textinput' : 'input']: PluginEventType.Input,
};

/**
 * Map DOM events to editor plugin events
 * @param core The EditorCore object
 */
export default function mapPluginEvents(core: EditorCore): (() => void)[] {
    return Object.keys(EVENT_MAPPING).map(pluginEvent =>
        core.api.attachDomEvent(core, pluginEvent, EVENT_MAPPING[pluginEvent])
    );
}
