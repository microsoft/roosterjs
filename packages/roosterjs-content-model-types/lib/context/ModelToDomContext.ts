import type { RewriteFromModelContext } from './RewriteFromModel';
import type { EditorContext } from './EditorContext';
import type { ModelToDomFormatContext } from './ModelToDomFormatContext';
import type { ModelToDomSelectionContext } from './ModelToDomSelectionContext';
import type { ModelToDomSettings } from './ModelToDomSettings';

/**
 * Context of Model to DOM conversion, used for generate HTML DOM tree according to current context
 */
export interface ModelToDomContext
    extends EditorContext,
        ModelToDomSelectionContext,
        ModelToDomFormatContext,
        ModelToDomSettings,
        RewriteFromModelContext {}

/**
 * Extended context used by segment and text handlers to carry per-paragraph segment state
 */
export interface ModelToDomSegmentContext extends ModelToDomContext {
    /**
     * Whether the current segment is the last segment in the paragraph,
     * or there are no more Text segments after it (excluding SelectionMarkers).
     * When true, trailing spaces should be converted to &amp;nbsp;.
     */
    noFollowingTextSegmentOrLast?: boolean;
}
