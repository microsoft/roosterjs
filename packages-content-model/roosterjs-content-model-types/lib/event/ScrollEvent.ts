import type { BasePluginDomEvent } from './BasePluginDomEvent';

/**
 * This interface represents a PluginEvent wrapping native scroll event
 */
export interface ScrollEvent extends BasePluginDomEvent<'scroll', Event> {
    /**
     * Current scroll container that triggers this scroll event
     */
    scrollContainer: HTMLElement;
}
