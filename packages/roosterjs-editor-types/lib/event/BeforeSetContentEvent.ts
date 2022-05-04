import BasePluginEvent from './BasePluginEvent';
import { PluginEventType } from '../enum/PluginEventType';

/**
 * The event to be triggered before SetContent API is called.
 * Handle this event to cache anything you need from editor before it is gone.
 */
export default interface BeforeSetContentEvent
    extends BasePluginEvent<PluginEventType.BeforeSetContent> {
    /**
     * New content HTML that is about to set to editor
     */
    newContent: string;
}
