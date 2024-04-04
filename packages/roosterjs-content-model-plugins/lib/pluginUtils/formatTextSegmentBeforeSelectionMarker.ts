import { getSelectedSegmentsAndParagraphs } from 'roosterjs-content-model-dom';
import type {
    ContentModelDocument,
    ContentModelParagraph,
    ContentModelText,
    FormatContentModelContext,
    IEditor,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function formatTextSegmentBeforeSelectionMarker(
    editor: IEditor,
    callback: (
        model: ContentModelDocument,
        previousSegment: ContentModelText,
        paragraph: ContentModelParagraph,
        context: FormatContentModelContext
    ) => boolean
) {
    editor.formatContentModel((model, context) => {
        const selectedSegmentsAndParagraphs = getSelectedSegmentsAndParagraphs(
            model,
            false /*includeFormatHolder*/
        );

        if (selectedSegmentsAndParagraphs.length > 0 && selectedSegmentsAndParagraphs[0][1]) {
            const marker = selectedSegmentsAndParagraphs[0][0];
            const paragraph = selectedSegmentsAndParagraphs[0][1];
            const markerIndex = paragraph.segments.indexOf(marker);
            if (marker.segmentType === 'SelectionMarker' && markerIndex > 0) {
                const previousSegment = paragraph.segments[markerIndex - 1];
                if (previousSegment && previousSegment.segmentType === 'Text') {
                    return callback(model, previousSegment, paragraph, context);
                }
            }
        }
        return false;
    });
}
