import { ContentModelSegmentBase } from './ContentModelSegmentBase';

/**
 * Content Model of Selection Marker
 */
export interface ContentModelSelectionMarker extends ContentModelSegmentBase<'SelectionMarker'> {
    /**
     * Whether this segment is selected
     */
    isSelected: true;
}
