import IEditor from './IEditor';
import { CompatiblePluginKeyboardEvent, PluginKeyboardEvent } from '../event/PluginDomEvent';
import { PluginEvent } from '../event/PluginEvent';

/**
 * Generic ContentEditFeature interface
 */
export interface GenericContentEditFeature<TEvent extends PluginEvent> {
    /**
     * Keys of this edit feature to handle
     */
    keys: number[];

    /**
     * Check if the event should be handled by this edit feature
     * @param event The plugin event to check
     * @param editor The editor object
     * @param ctrlOrMeta If Ctrl key (for Windows) or Meta key (for Mac) is pressed
     */
    shouldHandleEvent: (event: TEvent, editor: IEditor, ctrlOrMeta: boolean) => any;

    /**
     * Handle this event
     * @param event The event to handle
     * @param editor The editor object
     */
    handleEvent: (event: TEvent, editor: IEditor) => any;

    /**
     * Whether function keys (Ctrl/Meta or Alt) is allowed for this edit feature, default value is false.
     * When set to false, this edit feature won't be triggered if user has pressed Ctrl/Meta/Alt key
     */
    allowFunctionKeys?: boolean;
}

/**
 * ContentEditFeature interface that handles keyboard event
 */
export type ContentEditFeature = GenericContentEditFeature<
    PluginKeyboardEvent | CompatiblePluginKeyboardEvent
>;

/**
 * RoosterJs build in content edit feature
 */
export interface BuildInEditFeature<TEvent extends PluginEvent>
    extends GenericContentEditFeature<TEvent> {
    /**
     * Whether this edit feature is disabled by default
     */
    defaultDisabled?: boolean;
}
