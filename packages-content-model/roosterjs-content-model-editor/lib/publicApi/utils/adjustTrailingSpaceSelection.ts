import { ContentModelParagraph, ContentModelSegment } from 'roosterjs-content-model-types';
import { createText } from 'roosterjs-content-model-dom';

/**
 * Remove trailing space from the selection
 * If the trailing space is in a separate segment, remove the format from that segment.
 * @internal
 */
export function adjustTrailingSpaceSelection(
    segmentAndParagraphs: [ContentModelSegment, ContentModelParagraph | null][]
): [ContentModelSegment, ContentModelParagraph | null][] {
    let result: [ContentModelSegment, ContentModelParagraph | null][] = [];
    const length = segmentAndParagraphs.length;

    for (let j = length - 1; j >= 0; j--) {
        const paragraph = segmentAndParagraphs[j][1];
        const segmentLength = paragraph ? paragraph.segments.length : 0;

        if (paragraph) {
            for (let i = segmentLength - 1; i >= 0; i--) {
                const seg = paragraph.segments[i];
                if (seg.segmentType !== 'Text') {
                    break;
                } else if (seg.isSelected) {
                    const text = seg.text;
                    const newText = text.trimRight();
                    if (text.length > newText.length && newText.length > 0) {
                        seg.text = newText;
                        const newSeg = createText(text.substring(newText.length), seg.format);
                        newSeg.isSelected = true;
                        paragraph.segments.splice(i + 1, 0, newSeg);
                        result.push([newSeg, paragraph]);
                    } else if (
                        newText.length == 0 &&
                        (paragraph.segments[i - 1]?.isSelected ||
                            paragraph.segments[i + 1]?.isSelected)
                    ) {
                        result.push([seg, paragraph]);
                    }
                }
            }
        }
    }

    result.forEach(trailing => {
        const index = segmentAndParagraphs.findIndex(
            segmentAndParagraph => segmentAndParagraph[0] === trailing[0]
        );
        if (index >= 0) {
            segmentAndParagraphs.splice(index, 1);
        }
    });

    return segmentAndParagraphs;
}
