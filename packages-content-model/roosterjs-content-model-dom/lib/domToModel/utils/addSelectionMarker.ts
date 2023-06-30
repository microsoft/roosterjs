import { addDecorators } from '../../modelApi/common/addDecorators';
import { addSegment } from '../../modelApi/common/addSegment';
import { ContentModelBlockGroup, DomToModelContext } from 'roosterjs-content-model-types';
import { createSelectionMarker } from '../../modelApi/creators/createSelectionMarker';

/**
 * @internal
 */
export function addSelectionMarker(group: ContentModelBlockGroup, context: DomToModelContext) {
    const marker = createSelectionMarker(context.segmentFormat);

    addDecorators(marker, context);

    addSegment(group, marker, context.blockFormat);
}
