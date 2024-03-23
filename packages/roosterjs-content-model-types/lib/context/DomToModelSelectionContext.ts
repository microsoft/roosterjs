import type { ContentModelBlockGroup } from '../group/ContentModelBlockGroup';
import type { ContentModelParagraph } from '../block/ContentModelParagraph';
import type { ContentModelSelectionMarker } from '../segment/ContentModelSelectionMarker';
import type { InsertPoint } from '../selection/InsertPoint';
import type { TableSelectionContext } from '../selection/TableSelectionContext';
import type { DOMInsertPoint, DOMSelection } from '../selection/DOMSelection';

export interface ShadowInsertPoint {
    input: DOMInsertPoint;
    result?: InsertPoint;
}

export interface ShadowInsertPointInternal extends ShadowInsertPoint {
    /**
     * Block group path of this insert point, from direct parent group to the root group
     */
    path: ContentModelBlockGroup[];

    /**
     * The selection marker object for this insert point
     */
    marker?: ContentModelSelectionMarker;

    /**
     * The paragraph that contains this insert point
     */
    paragraph?: ContentModelParagraph;

    /**
     * Table context of this insert point
     */
    tableContext?: TableSelectionContext;
}

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

    shadowInsertPoint?: ShadowInsertPointInternal;
}
