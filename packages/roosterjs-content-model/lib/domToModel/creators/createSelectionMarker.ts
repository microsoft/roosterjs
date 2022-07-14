import { ContentModelSegmentType } from '../../publicTypes/enum/SegmentType';
import { ContentModelSelectionMarker } from '../../publicTypes/segment/ContentModelSelectionMarker';
import { FormatContext } from '../types/FormatContext';

/**
 * @internal
 */
export function createSelectionMarker(context: FormatContext): ContentModelSelectionMarker {
    return {
        segmentType: ContentModelSegmentType.SelectionMarker,
        isSelected: true,
    };
}
