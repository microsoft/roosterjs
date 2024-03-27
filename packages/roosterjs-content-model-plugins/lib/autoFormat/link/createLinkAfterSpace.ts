import { getSelectedSegmentsAndParagraphs } from 'roosterjs-content-model-dom';
import { matchLink } from 'roosterjs-content-model-api';
import { splitTextSegment } from '../../pluginUtils/splitTextSegment';
import type { IEditor } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function createLinkAfterSpace(editor: IEditor) {
    editor.formatContentModel((model, context) => {
        const selectedSegmentsAndParagraphs = getSelectedSegmentsAndParagraphs(
            model,
            false /* includingFormatHolder */
        );
        if (selectedSegmentsAndParagraphs.length > 0 && selectedSegmentsAndParagraphs[0][1]) {
            const markerIndex = selectedSegmentsAndParagraphs[0][1].segments.findIndex(
                segment => segment.segmentType == 'SelectionMarker'
            );
            const paragraph = selectedSegmentsAndParagraphs[0][1];
            if (markerIndex > 0) {
                const textSegment = paragraph.segments[markerIndex - 1];
                const marker = paragraph.segments[markerIndex];
                if (
                    marker.segmentType == 'SelectionMarker' &&
                    textSegment &&
                    textSegment.segmentType == 'Text' &&
                    !textSegment.link
                ) {
                    const link = textSegment.text.split(' ').pop();
                    const url = link?.trim();

                    if (url && link && matchLink(url)) {
                        const linkSegment = splitTextSegment(
                            textSegment,
                            paragraph,
                            textSegment.text.length - link.trimLeft().length,
                            textSegment.text.trimRight().length
                        );
                        linkSegment.link = {
                            format: {
                                href: url,
                                underline: true,
                            },
                            dataset: {},
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
