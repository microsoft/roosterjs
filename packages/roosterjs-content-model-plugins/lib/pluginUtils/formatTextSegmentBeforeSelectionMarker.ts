import { getSelectedSegmentsAndParagraphs } from 'roosterjs-content-model-dom';
import type {
    ContentModelParagraph,
    ContentModelSelectionMarker,
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
        previousSegment: ContentModelText,
        paragraph: ContentModelParagraph,
        marker: ContentModelSelectionMarker,
        markerIndex: number,
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
                    return callback(previousSegment, paragraph, marker, markerIndex, context);
                }
            }
        }
        return false;
    });
}
