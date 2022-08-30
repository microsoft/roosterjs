import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';
import { ContentModelSelectionMarker } from '../../publicTypes/segment/ContentModelSelectionMarker';

/**
 * @internal
 */
export function createSelectionMarker(
    format?: ContentModelSegmentFormat
): ContentModelSelectionMarker {
    return {
        segmentType: 'SelectionMarker',
        isSelected: true,
        format: format ? { ...format } : {},
    };
}
