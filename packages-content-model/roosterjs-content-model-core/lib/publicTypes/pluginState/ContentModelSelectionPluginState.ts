import type { DOMSelection } from 'roosterjs-content-model-types';

/**
 * Plugin state for ContentModelFormatPlugin
 */
export interface ContentModelSelectionPluginState {
    /**
     * Last DOM selection
     */
    lastSelection: DOMSelection | null;
}
