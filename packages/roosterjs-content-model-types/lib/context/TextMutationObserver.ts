import type { ContentModelDocument } from '../contentModel/blockGroup/ContentModelDocument';
import type { DOMSelection } from '../selection/DOMSelection';

/**
 * A wrapper of MutationObserver to observe text change from editor
 */
export interface TextMutationObserver {
    /**
     * Start observing mutations from editor
     */
    startObserving(): void;

    /**
     * Stop observing mutations from editor
     */
    stopObserving(): void;

    /**
     * Flush all pending mutations that have not be handled in order to ignore them
     */
    flushMutations(): void;

    /**
     * Flush all pending mutations that have not be handled in order to ignore them
     */
    flushMutations(newModel: ContentModelDocument, selection: DOMSelection | null): void;
}
