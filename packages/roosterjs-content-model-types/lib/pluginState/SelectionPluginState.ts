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
     * When set to true, onFocus event will not trigger reselect cached range
     */
    skipReselectOnFocus?: boolean;

    /**
     * Color of the border of a selectedImage. Default color: '#DB626C'
     */
    imageSelectionBorderColor?: string;
}
