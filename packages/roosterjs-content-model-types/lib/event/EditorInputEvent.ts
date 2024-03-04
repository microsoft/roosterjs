import type { BasePluginEvent } from './BasePluginEvent';

/**
 * This interface represents a PluginEvent wrapping native input / textinput event
 */
export interface EditorInputEvent extends BasePluginEvent<'input'> {
    /**
     * Raw Input Event
     */
    rawEvent: InputEvent;
}
