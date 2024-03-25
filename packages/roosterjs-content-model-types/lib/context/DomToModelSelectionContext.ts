import type { ContentModelBlockGroup } from '../group/ContentModelBlockGroup';
import type { InsertPoint } from '../selection/InsertPoint';
import type { TableSelectionContext } from '../selection/TableSelectionContext';
import type { DOMInsertPoint, DOMSelection } from '../selection/DOMSelection';

export interface ShadowInsertPoint {
    input: DOMInsertPoint;
    result?: InsertPoint;
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

    /**
     * Block group path of this insert point, from direct parent group to the root group
     */
    path: ContentModelBlockGroup[];

    /**
     * Table context of this insert point
     */
    tableContext?: TableSelectionContext;

    shadowInsertPoint?: ShadowInsertPoint;
}
