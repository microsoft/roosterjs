import { addSegment } from '../../modelApi/common/addSegment';
import { ContentModelBlockGroup } from '../../publicTypes/block/group/ContentModelBlockGroup';
import { createSelectionMarker } from '../../modelApi/creators/createSelectionMarker';
import { DomToModelContext } from '../../publicTypes/context/DomToModelContext';

/**
 * @internal
 */
export function addSelectionMarker(group: ContentModelBlockGroup, context: DomToModelContext) {
    addSegment(
        group,
        createSelectionMarker(context.segmentFormat, context.hyperLinkFormat),
        context.blockFormat
    );
}
