import { addDecorators } from '../../modelApi/common/addDecorators';
import { createSelectionMarker } from '../../modelApi/creators/createSelectionMarker';
import type {
    ContentModelBlockGroup,
    ContentModelSegmentFormat,
    ContentModelSelectionMarker,
    DomToModelContext,
    ContentModelSegmentFormatCommon,
} from 'roosterjs-content-model-types';

/**
 * Build a new selection marker with correct format according to its parent paragraph
 * @param group The BlockGroup that paragraph belongs to
 * @param context Current DOM to Model context
 * @param container @optional Container Node, used for retrieving pending format
 * @param offset @optional Container offset, used for retrieving pending format
 * @returns A new selection marker
 */
export function buildSelectionMarker(
    group: ContentModelBlockGroup,
    context: DomToModelContext,
    container?: Node,
    offset?: number
): ContentModelSelectionMarker {
    const lastPara = group.blocks[group.blocks.length - 1];
    const formatFromParagraph: ContentModelSegmentFormatCommon =
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
        context.pendingFormat.insertPoint.node === container &&
        context.pendingFormat.insertPoint.offset === offset
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
