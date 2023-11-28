import type { ContentModelDocument } from '../group/ContentModelDocument';
import type { ContentModelDomIndexer } from '../context/ContentModelDomIndexer';
import type { DOMSelection } from '../selection/DOMSelection';

/**
 * Plugin state for ContentModelEditPlugin
 */
export interface ContentModelCachePluginState {
    /**
     * Cached selection
     */
    previousSelection: DOMSelection | null;

    /**
     * When reuse Content Model is allowed, we cache the Content Model object here after created
     */
    cachedModel: ContentModelDocument | null;

    /**
     * @optional Indexer for content model, to help build backward relationship from DOM node to Content Model
     */
    domIndexer?: ContentModelDomIndexer;
}
