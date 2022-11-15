import getSelectedSegments from '../selection/getSelectedSegments';
import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { ContentModelSegment } from '../../publicTypes/segment/ContentModelSegment';

/**
 * @internal
 */
export function setSegmentStyle(
    model: ContentModelDocument,
    toggleStyleCallback: (segment: ContentModelSegment, isTuringOn: boolean) => void,
    segmentHasStyleCallback?: (segment: ContentModelSegment) => boolean,
    includingFormatHolder?: boolean
): boolean {
    const segments = getSelectedSegments(model, includingFormatHolder);
    const isTuringOff = segmentHasStyleCallback ? segments.every(segmentHasStyleCallback) : false;

    segments.forEach(segment => toggleStyleCallback(segment, !isTuringOff));

    return segments.length > 1 || (segments[0] && segments[0].segmentType != 'SelectionMarker');
}
