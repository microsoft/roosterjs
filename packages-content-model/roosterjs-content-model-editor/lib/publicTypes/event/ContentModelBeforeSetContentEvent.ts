import BasePluginEvent from './BasePluginEvent';

/**
 * The event to be triggered before SetContent API is called.
 * Handle this event to cache anything you need from editor before it is gone.
 */
export interface ContentModelBeforeSetContentEvent extends BasePluginEvent<'beforeSetContent'> {
    /**
     * New content HTML that is about to set to editor
     */
    newContent: string;
}
