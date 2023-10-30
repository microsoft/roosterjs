import type { DOMSelection } from 'roosterjs-content-model-types';

/**
 * @internal
 * The state object for ContentModelSelectionPlugin
 */
export interface ContentModelSelectionPluginState {
    /**
     * Current cached selection
     */
    currentSelection: DOMSelection | null;
}
