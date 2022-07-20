import BasePluginEvent from './BasePluginEvent';
import { PluginEventType } from '../enum/PluginEventType';
import type { CompatiblePluginEventType } from '../compatibleEnum/PluginEventType';

/**
 * Data of BeforeSetContentEvent
 */
export interface BeforeSetContentEventData {
    /**
     * New content HTML that is about to set to editor
     */
    newContent: string;
}

/**
 * The event to be triggered before SetContent API is called.
 * Handle this event to cache anything you need from editor before it is gone.
 */
export default interface BeforeSetContentEvent
    extends BeforeSetContentEventData,
        BasePluginEvent<PluginEventType.BeforeSetContent> {}

/**
 * The event to be triggered before SetContent API is called.
 * Handle this event to cache anything you need from editor before it is gone.
 */
export interface CompatibleBeforeSetContentEvent
    extends BeforeSetContentEventData,
        BasePluginEvent<CompatiblePluginEventType.BeforeSetContent> {}
