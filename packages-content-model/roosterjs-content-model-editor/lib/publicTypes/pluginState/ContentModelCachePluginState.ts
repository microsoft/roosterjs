import { ContentModelDocument, ContentModelDomIndexer } from 'roosterjs-content-model-types';
import { SelectionRangeEx } from 'roosterjs-editor-types';

/**
 * Plugin state for ContentModelEditPlugin
 */
export interface ContentModelCachePluginState {
    /**
     * Cached selection range
     */
    cachedRangeEx?: SelectionRangeEx | undefined;

    /**
     * When reuse Content Model is allowed, we cache the Content Model object here after created
     */
    cachedModel?: ContentModelDocument;

    /**
     * @optional Indexer for content model, to help build backward relationship from DOM node to Content Model
     */
    domIndexer?: ContentModelDomIndexer;
}
