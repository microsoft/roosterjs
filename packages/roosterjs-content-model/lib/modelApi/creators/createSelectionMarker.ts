import { ContentModelSegmentType } from '../../publicTypes/enum/SegmentType';
import { ContentModelSelectionMarker } from '../../publicTypes/segment/ContentModelSelectionMarker';

/**
 * @internal
 */
export function createSelectionMarker(): ContentModelSelectionMarker {
    return {
        segmentType: ContentModelSegmentType.SelectionMarker,
        isSelected: true,
    };
}
