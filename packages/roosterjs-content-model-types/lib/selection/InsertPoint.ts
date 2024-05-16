import type { ReadonlyContentModelBlockGroup } from '../contentModel/blockGroup/ContentModelBlockGroup';
import type { ReadonlyContentModelParagraph } from '../contentModel/block/ContentModelParagraph';
import type { ReadonlyContentModelSelectionMarker } from '../contentModel/segment/ContentModelSelectionMarker';
import type { ReadonlyTableSelectionContext } from './TableSelectionContext';

/**
 * Represent all related information of an insert point
 */
export interface InsertPoint {
    /**
     * The selection marker object for this insert point
     */
    marker: ReadonlyContentModelSelectionMarker;

    /**
     * The paragraph that contains this insert point
     */
    paragraph: ReadonlyContentModelParagraph;

    /**
     * Block group path of this insert point, from direct parent group to the root group
     */
    path: ReadonlyContentModelBlockGroup[];

    /**
     * Table context of this insert point
     */
    tableContext?: ReadonlyTableSelectionContext;
}
