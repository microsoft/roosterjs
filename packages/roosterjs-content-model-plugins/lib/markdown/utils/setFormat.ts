import { createText, getSelectedSegmentsAndParagraphs } from 'roosterjs-content-model-dom';
import type {
    ContentModelSegmentFormat,
    ContentModelText,
    IEditor,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function setFormat(editor: IEditor, character: string, format: ContentModelSegmentFormat) {
    editor.formatContentModel((model, context) => {
        const selectedSegmentsAndParagraphs = getSelectedSegmentsAndParagraphs(
            model,
            false /*includeFormatHolder*/
        );

        if (selectedSegmentsAndParagraphs.length > 0 && selectedSegmentsAndParagraphs[0][1]) {
            const marker = selectedSegmentsAndParagraphs[0][0];
            context.newPendingFormat = {
                ...marker.format,
                strikethrough: !!marker.format.strikethrough,
                italic: !!marker.format.italic,
                fontWeight: marker.format?.fontWeight ? 'bold' : undefined,
            };

            const paragraph = selectedSegmentsAndParagraphs[0][1];
            if (marker.segmentType == 'SelectionMarker') {
                const markerIndex = paragraph.segments.indexOf(marker);
                let previousCharacterSegment: ContentModelText | undefined = undefined;
                let index = markerIndex;
                if (markerIndex > 0 && paragraph.segments[markerIndex - 1]) {
                    const segmentBeforeMarker = paragraph.segments[markerIndex - 1];
                    if (
                        segmentBeforeMarker.segmentType == 'Text' &&
                        segmentBeforeMarker.text[segmentBeforeMarker.text.length - 1] == character
                    ) {
                        for (let i = markerIndex - 1; i >= 0; i--) {
                            const previousSegment = paragraph.segments[i];
                            if (
                                previousSegment &&
                                previousSegment.segmentType == 'Text' &&
                                previousSegment.text.indexOf(character) > -1 &&
                                !(
                                    i == markerIndex - 1 &&
                                    previousSegment.text.indexOf(character) ==
                                        previousSegment.text.length - 1
                                )
                            ) {
                                previousCharacterSegment = previousSegment;
                                index = i;
                                break;
                            }
                        }
                        if (previousCharacterSegment && index < markerIndex) {
                            const splittedSegments = previousCharacterSegment.text.split(character);

                            const formattedText = splittedSegments[splittedSegments.length - 2];
                            if (!formattedText) {
                                return false;
                            }

                            previousCharacterSegment.text = previousCharacterSegment.text.substring(
                                0,
                                previousCharacterSegment.text.length - formattedText.length - 2
                            );

                            const formattedSegment = createText(formattedText, marker.format);
                            paragraph.segments.splice(index + 1, 0, formattedSegment);

                            for (let i = index + 1; i <= markerIndex; i++) {
                                const segment = paragraph.segments[i];
                                if (segment.segmentType == 'Text') {
                                    segment.format = {
                                        ...paragraph.segments[i].format,
                                        ...format,
                                    };
                                }
                            }

                            context.canUndoByBackspace = true;
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    });
}
