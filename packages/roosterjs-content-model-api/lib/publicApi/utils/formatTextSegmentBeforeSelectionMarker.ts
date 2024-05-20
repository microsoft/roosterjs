import { getSelectedSegmentsAndParagraphs, mutateSegment } from 'roosterjs-content-model-dom';
import type {
    ContentModelSegmentFormat,
    ContentModelText,
    FormatContentModelContext,
    FormatContentModelOptions,
    IEditor,
    ReadonlyContentModelDocument,
    ShallowMutableContentModelParagraph,
} from 'roosterjs-content-model-types';

/**
 * Invoke a callback to format the text segment before the selection marker using Content Model
 * @param editor The editor object
 * @param callback The callback to format the text segment.
 * @returns True if the segment before cursor is found and callback is called, otherwise false
 */
export function formatTextSegmentBeforeSelectionMarker(
    editor: IEditor,
    callback: (
        model: ReadonlyContentModelDocument,
        previousSegment: ContentModelText,
        paragraph: ShallowMutableContentModelParagraph,
        markerFormat: ContentModelSegmentFormat,
        context: FormatContentModelContext
    ) => boolean,
    options?: FormatContentModelOptions
): boolean {
    let result = false;

    editor.formatContentModel((model, context) => {
        const selectedSegmentsAndParagraphs = getSelectedSegmentsAndParagraphs(
            model,
            false /*includeFormatHolder*/
        );
        let rewrite = false;

        if (
            selectedSegmentsAndParagraphs.length > 0 &&
            selectedSegmentsAndParagraphs[0][0].segmentType == 'SelectionMarker' &&
            selectedSegmentsAndParagraphs[0][1]
        ) {
            mutateSegment(
                selectedSegmentsAndParagraphs[0][1],
                selectedSegmentsAndParagraphs[0][0],
                (marker, paragraph, markerIndex) => {
                    const previousSegment = paragraph.segments[markerIndex - 1];

                    if (previousSegment && previousSegment.segmentType === 'Text') {
                        result = true;
                        rewrite = callback(
                            model,
                            previousSegment,
                            paragraph,
                            marker.format,
                            context
                        );
                    }
                }
            );
        }

        return rewrite;
    }, options);

    return result;
}
