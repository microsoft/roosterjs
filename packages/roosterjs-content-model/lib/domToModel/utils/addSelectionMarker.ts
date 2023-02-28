import { addDecorators } from '../../modelApi/common/addDecorators';
import { addSegment } from '../../modelApi/common/addSegment';
import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';
import { createSelectionMarker } from '../../modelApi/creators/createSelectionMarker';
import { DomToModelContext } from '../../publicTypes/context/DomToModelContext';

/**
 * @internal
 */
export function addSelectionMarker(group: ContentModelBlockGroup, context: DomToModelContext) {
    const marker = createSelectionMarker(context.segmentFormat);

    addDecorators(marker, context);

    addSegment(group, marker, context.blockFormat);
}
