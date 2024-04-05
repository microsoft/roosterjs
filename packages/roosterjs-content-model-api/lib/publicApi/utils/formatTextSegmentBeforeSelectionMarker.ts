import { getSelectedSegmentsAndParagraphs } from 'roosterjs-content-model-dom';
import type {
    ContentModelDocument,
    ContentModelParagraph,
    ContentModelSegmentFormat,
    ContentModelText,
    FormatContentModelContext,
    FormatContentModelOptions,
    IEditor,
} from 'roosterjs-content-model-types';

/**
 * Invoke a callback to format the text segment before the selection marker using Content Model
 * @param editor The editor object
 * @param callback The callback to format the text segment.
 */
export function formatTextSegmentBeforeSelectionMarker(
    editor: IEditor,
    callback: (
        model: ContentModelDocument,
        previousSegment: ContentModelText,
        paragraph: ContentModelParagraph,
        markerFormat: ContentModelSegmentFormat,
        context: FormatContentModelContext
    ) => boolean,
    options?: FormatContentModelOptions
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
                    return callback(model, previousSegment, paragraph, marker.format, context);
                }
            }
        }
        return false;
    }, options);
}
