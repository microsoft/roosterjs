import type { DOMSelection } from '../selection/DOMSelection';

/**
 * The state object for SelectionPlugin
 */
export interface SelectionPluginState {
    /**
     * Cached selection range
     */
    selection: DOMSelection | null;

    /**
     * A style node in current document to help implement image and table selection
     */
    selectionStyleNode: HTMLStyleElement | null;

    /**
     * When set to true, onFocus event will not trigger reselect cached range
     */
    skipReselectOnFocus?: boolean;
}
