import { getSelectedSegmentsAndParagraphs } from 'roosterjs-content-model-dom';
import { splitTextSegment } from 'roosterjs-content-model-plugins/lib/pluginUtils/splitTextSegment';

import type { ContentModelSegmentFormat, IEditor } from 'roosterjs-content-model-types';

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
                if (markerIndex > 0 && paragraph.segments[markerIndex - 1]) {
                    const segmentBeforeMarker = paragraph.segments[markerIndex - 1];
                    if (
                        segmentBeforeMarker.segmentType == 'Text' &&
                        segmentBeforeMarker.text[segmentBeforeMarker.text.length - 1] == character
                    ) {
                        const lastCharIndex = segmentBeforeMarker.text.length;
                        const firstCharIndex = segmentBeforeMarker.text
                            .substring(0, lastCharIndex - 1)
                            .lastIndexOf(character);

                        const formattedText = splitTextSegment(
                            segmentBeforeMarker,
                            paragraph,
                            firstCharIndex,
                            lastCharIndex
                        );

                        formattedText.text = formattedText.text.replace(character, '').slice(0, -1);
                        formattedText.format = {
                            ...formattedText.format,
                            ...format,
                        };

                        context.canUndoByBackspace = true;
                        return true;
                    }
                }
            }
        }
        return false;
    });
}
