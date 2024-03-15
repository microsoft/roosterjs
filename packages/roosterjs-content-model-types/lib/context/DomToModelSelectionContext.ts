import type { DOMSelection } from '../selection/DOMSelection';

/**
 * Represents the selection information of content used by DOM to Content Model conversion
 */
export interface DomToModelSelectionContext {
    /**
     * Is current context under a selection
     */
    isInSelection?: boolean;

    /**
     * Current selection range
     */
    selection?: DOMSelection;
}
