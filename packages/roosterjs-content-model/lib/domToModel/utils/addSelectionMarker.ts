import { addLink } from '../../modelApi/common/addLink';
import { addSegment } from '../../modelApi/common/addSegment';
import { ContentModelBlockGroup } from '../../publicTypes/block/group/ContentModelBlockGroup';
import { createSelectionMarker } from '../../modelApi/creators/createSelectionMarker';
import { DomToModelContext } from '../../publicTypes/context/DomToModelContext';

/**
 * @internal
 */
export function addSelectionMarker(group: ContentModelBlockGroup, context: DomToModelContext) {
    const marker = createSelectionMarker(context.segmentFormat);

    addLink(marker, context.link);
    addSegment(group, marker, context.blockFormat);
}
