import { ContentModelBlockGroup } from '../group/ContentModelBlockGroup';
import { ContentModelParagraph } from '../block/ContentModelParagraph';
import { ContentModelSelectionMarker } from '../segment/ContentModelSelectionMarker';
import { TableSelectionContext } from './TableSelectionContext';

/**
 * Represent all related information of an insert point
 */
export interface InsertPoint {
    /**
     * The selection marker object for this insert point
     */
    marker: ContentModelSelectionMarker;

    /**
     * The paragraph that contains this insert point
     */
    paragraph: ContentModelParagraph;

    /**
     * Block group path of this insert point, from direct parent group to the root group
     */
    path: ContentModelBlockGroup[];

    /**
     * Table context of this insert point
     */
    tableContext?: TableSelectionContext;
}
