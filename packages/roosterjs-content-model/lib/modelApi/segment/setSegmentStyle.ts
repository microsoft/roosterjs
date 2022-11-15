import { arrayPush } from 'roosterjs-editor-dom';
import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { ContentModelSegment } from '../../publicTypes/segment/ContentModelSegment';
import { getSelections } from '../selection/getSelections';

/**
 * @internal
 */
export function setSegmentStyle(
    model: ContentModelDocument,
    toggleStyleCallback: (segment: ContentModelSegment, isTuringOn: boolean) => void,
    segmentHasStyleCallback?: (segment: ContentModelSegment) => boolean,
    includingFormatHolder?: boolean
): boolean {
    const segments: ContentModelSegment[] = [];
    const selections = getSelections(model, {
        includeFormatHolder: includingFormatHolder,
    });

    selections.forEach(selection => arrayPush(segments, selection.segments));

    const isTuringOff = segmentHasStyleCallback ? segments.every(segmentHasStyleCallback) : false;

    segments.forEach(segment => toggleStyleCallback(segment, !isTuringOff));

    return segments.length > 1 || (segments[0] && segments[0].segmentType != 'SelectionMarker');
}
