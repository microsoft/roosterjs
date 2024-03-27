import { addDecorators } from '../../modelApi/common/addDecorators';
import { createSelectionMarker } from '../../modelApi/creators/createSelectionMarker';
import type {
    ContentModelBlockGroup,
    ContentModelSegmentFormat,
    ContentModelSelectionMarker,
    DomToModelContext,
} from 'roosterjs-content-model-types';

export function buildSelectionMarker(
    group: ContentModelBlockGroup,
    context: DomToModelContext,
    container?: Node,
    offset?: number
): ContentModelSelectionMarker {
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

    const format: ContentModelSegmentFormat = Object.assign(
        {},
        context.defaultFormat,
        formatFromParagraph,
        context.segmentFormat,
        pendingFormat
    );

    const marker = createSelectionMarker(format);

    addDecorators(marker, context);

    return marker;
}
