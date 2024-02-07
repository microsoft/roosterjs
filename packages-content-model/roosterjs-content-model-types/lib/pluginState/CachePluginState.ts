import type { TextMutationObserver } from '../context/TextMutationObserver';
import type { ContentModelDocument } from '../group/ContentModelDocument';
import type { DomIndexer } from '../context/DomIndexer';
import type { DOMSelection } from '../selection/DOMSelection';

/**
 * Plugin state for CacheEditPlugin
 */
export interface CachePluginState {
    /**
     * Cached selection
     */
    cachedSelection?: DOMSelection | undefined;

    /**
     * When reuse Content Model is allowed, we cache the Content Model object here after created
     */
    cachedModel?: ContentModelDocument;

    /**
     * @optional Indexer for CachePlugin, to help build backward relationship from DOM node to Content Model
     */
    domIndexer?: DomIndexer;

    /**
     * @optional A wrapper of MutationObserver to help detect text changes in editor
     */
    textMutationObserver?: TextMutationObserver;
}
