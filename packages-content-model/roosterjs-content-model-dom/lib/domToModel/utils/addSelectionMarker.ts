import { addDecorators } from '../../modelApi/common/addDecorators';
import { addSegment } from '../../modelApi/common/addSegment';
import { createSelectionMarker } from '../../modelApi/creators/createSelectionMarker';
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
    const pendingFormat =
        context.pendingFormat &&
        context.pendingFormat.posContainer === container &&
        context.pendingFormat.posOffset === offset
            ? context.pendingFormat.format
            : undefined;
    const segmentFormat = {
        ...context.defaultFormat,
        ...context.segmentFormat,
        ...pendingFormat,
    };
    const marker = createSelectionMarker(segmentFormat);

    addDecorators(marker, context);

    addSegment(group, marker, context.blockFormat, segmentFormat);
}
