import { ContentModelSegment, ContentModelText } from 'roosterjs-content-model-types';
import { createSelectionMarker, createText } from 'roosterjs-content-model-dom';
import { updateTextSegmentIndex } from '../../editor/utils/indexedText';

/**
 * @internal
 */
export function reconcileTextSelection(textNode: Text, offset?: number) {
    return updateTextSegmentIndex(textNode, (paragraph, first, last) => {
        const newSegments: ContentModelSegment[] = [];
        const txt = textNode.nodeValue || '';
        const textSegments: ContentModelText[] = [];

        if (offset === undefined) {
            first.text = txt;
            newSegments.push(first);
            textSegments.push(first);
        } else {
            if (offset > 0) {
                first.text = txt.substring(0, offset);
                newSegments.push(first);
                textSegments.push(first);
            }

            newSegments.push(createSelectionMarker(first.format));

            if (offset < txt.length) {
                const second = createText(
                    txt.substring(offset),
                    first.format,
                    first.link,
                    first.code
                );
                newSegments.push(second);
                textSegments.push(second);
            }
        }

        let firstIndex = paragraph.segments.indexOf(first);
        let lastIndex = paragraph.segments.indexOf(last);

        if (firstIndex >= 0 && lastIndex >= 0) {
            while (
                firstIndex > 0 &&
                paragraph.segments[firstIndex - 1].segmentType == 'SelectionMarker'
            ) {
                firstIndex--;
            }

            while (
                lastIndex < paragraph.segments.length - 1 &&
                paragraph.segments[lastIndex + 1].segmentType == 'SelectionMarker'
            ) {
                lastIndex++;
            }

            paragraph.segments.splice(firstIndex, lastIndex - firstIndex + 1, ...newSegments);
        }

        return textSegments;
    });
}
