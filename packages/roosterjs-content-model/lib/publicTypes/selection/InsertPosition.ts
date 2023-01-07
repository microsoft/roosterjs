import { ContentModelBlockGroup } from '../group/ContentModelBlockGroup';
import { ContentModelParagraph } from '../block/ContentModelParagraph';
import { ContentModelSelectionMarker } from '../segment/ContentModelSelectionMarker';
import { TableSelectionContext } from './TableSelectionContext';

/**
 * Represents a insert position in Content Model, with its selection marker and other related context info
 */
export interface InsertPosition {
    /**
     * The selection marker model of insert position
     */
    marker: ContentModelSelectionMarker;

    /**
     * The paragraph that contains the selection marker
     */
    paragraph: ContentModelParagraph;

    /**
     * The selection path (an array with its ancestor block groups, near to far)
     */
    path: ContentModelBlockGroup[];

    /**
     * Context of the closest table cell the selection marker.
     * If there is no table around the selection marker, this value will be undefined.
     */
    tableContext?: TableSelectionContext;
}
