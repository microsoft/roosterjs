import { addSegment } from '../../modelApi/common/addSegment';
import { buildSelectionMarker } from './buildSelectionMarker';
import type { ContentModelBlockGroup, DomToModelContext } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function addSelectionMarker(
    group: ContentModelBlockGroup,
    context: DomToModelContext,
    container?: Node,
    offset?: number
) {
    const marker = buildSelectionMarker(group, context, container, offset);

    addSegment(group, marker, context.blockFormat, marker.format);
}
