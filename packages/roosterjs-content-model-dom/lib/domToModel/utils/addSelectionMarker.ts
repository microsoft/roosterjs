import { addDecorators } from '../../modelApi/common/addDecorators';
import { addSegment } from '../../modelApi/common/addSegment';
import { createSelectionMarker } from '../../modelApi/creators/createSelectionMarker';
import type {
    ContentModelBlockGroup,
    ContentModelSegmentFormat,
    DomToModelContext,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function addSelectionMarker(
    group: ContentModelBlockGroup,
    context: DomToModelContext,
    container?: Node,
    offset?: number,
    isShadowMarker?: boolean
) {
    const lastPara = group.blocks[group.blocks.length - 1];
    const formatFromParagraph: ContentModelSegmentFormat =
        !lastPara || lastPara.blockType != 'Paragraph'
            ? {}
            : lastPara.decorator
            ? {
                  fontFamily: lastPara.decorator.format.fontFamily,
                  fontSize: lastPara.decorator.format.fontSize,
              }
            : lastPara.segmentFormat
            ? {
                  fontFamily: lastPara.segmentFormat.fontFamily,
                  fontSize: lastPara.segmentFormat.fontSize,
              }
            : {};

    const pendingFormat =
        context.pendingFormat &&
        context.pendingFormat.posContainer === container &&
        context.pendingFormat.posOffset === offset
            ? context.pendingFormat.format
            : undefined;
    const segmentFormat = {
        ...context.defaultFormat,
        ...formatFromParagraph,
        ...context.segmentFormat,
        ...pendingFormat,
    };
    const marker = createSelectionMarker(segmentFormat, isShadowMarker);

    addDecorators(marker, context);

    const para = addSegment(group, marker, context.blockFormat, segmentFormat);

    if (isShadowMarker && context.shadowInsertPoint) {
        const { path, tableContext } = context.shadowInsertPoint;

        context.shadowInsertPoint.result = {
            path: [...path],
            tableContext,
            paragraph: para,
            marker,
        };
    }
}
