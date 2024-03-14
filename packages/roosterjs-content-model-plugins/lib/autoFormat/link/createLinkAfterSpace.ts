import { createText } from 'roosterjs-content-model-dom';
import { getSelectedSegmentsAndParagraphs } from 'roosterjs-content-model-core';
import { matchLink } from 'roosterjs-content-model-api';
import type { IEditor } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function createLinkAfterSpace(editor: IEditor) {
    editor.formatContentModel(model => {
        const selectedSegmentsAndParagraphs = getSelectedSegmentsAndParagraphs(
            model,
            false /* includingFormatHolder */
        );
        if (selectedSegmentsAndParagraphs[0] && selectedSegmentsAndParagraphs[0][1]) {
            const length = selectedSegmentsAndParagraphs[0][1].segments.length;
            const marker = selectedSegmentsAndParagraphs[0][1].segments[length - 1];
            const textSegment = selectedSegmentsAndParagraphs[0][1].segments[length - 2];
            if (
                marker.segmentType == 'SelectionMarker' &&
                textSegment.segmentType == 'Text' &&
                !textSegment.link
            ) {
                const link = textSegment.text.split(' ').pop();
                if (link && matchLink(link)) {
                    textSegment.text = textSegment.text.replace(link, '');
                    const linkSegment = createText(link, marker.format, {
                        format: {
                            href: link,
                            underline: true,
                        },
                        dataset: {},
                    });
                    selectedSegmentsAndParagraphs[0][1].segments.splice(length - 1, 0, linkSegment);
                    return true;
                }
            }
        }

        return false;
    });
}
