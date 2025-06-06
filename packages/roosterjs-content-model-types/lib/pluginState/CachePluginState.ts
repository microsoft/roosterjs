import type { TextMutationObserver } from '../context/TextMutationObserver';
import type { ContentModelDocument } from '../contentModel/blockGroup/ContentModelDocument';
import type { DomIndexer } from '../context/DomIndexer';
import type {
    DOMInsertPoint,
    ImageSelection,
    SelectionBase,
    TableSelection,
} from '../selection/DOMSelection';
import type { ParagraphIndexer, ParagraphMap } from '../parameter/ParagraphMap';

/**
 * Represents a range selection used for cache. We store the start and end insert point here instead of range itself
 * to prevent range got automatically modified by browser
 */
export interface RangeSelectionForCache extends SelectionBase<'range'> {
    /**
     * Start insert point
     */
    start: DOMInsertPoint;

    /**
     * End inset point
     */
    end: DOMInsertPoint;

    /**
     * Whether the selection was from left to right (in document order) or
     * right to left (reverse of document order)
     */
    isReverted: boolean;
}

/**
 * Represents a selection used for cache
 */
export type CacheSelection = RangeSelectionForCache | ImageSelection | TableSelection;

/**
 * Plugin state for CacheEditPlugin
 */
export interface CachePluginState {
    /**
     * Cached selection
     */
    cachedSelection?: CacheSelection | undefined;

    /**
     * When reuse Content Model is allowed, we cache the Content Model object here after created
     */
    cachedModel?: ContentModelDocument;

    /**
     * A helper class that manages a mapping from paragraph marker to paragraph object.
     */
    paragraphMap?: ParagraphMap & ParagraphIndexer;

    /**
     * @optional Indexer for CachePlugin, to help build backward relationship from DOM node to Content Model
     */
    domIndexer?: DomIndexer;

    /**
     * @optional A wrapper of MutationObserver to help detect text changes in editor
     */
    textMutationObserver?: TextMutationObserver;
}
