import { ContentModelSegmentBase } from './ContentModelSegmentBase';
import { ContentModelSegmentType } from '../enum/SegmentType';
import type { CompatibleContentModelSegmentType } from '../compatibleEnum/SegmentType';

/**
 * Content Model of Selection Marker
 */
export interface ContentModelSelectionMarker
    extends ContentModelSegmentBase<
        ContentModelSegmentType.SelectionMarker | CompatibleContentModelSegmentType.SelectionMarker
    > {
    /**
     * Whether this segment is selected
     */
    isSelected: true;
}
