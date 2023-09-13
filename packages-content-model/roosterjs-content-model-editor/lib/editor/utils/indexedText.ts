import { ContentModelParagraph, ContentModelText } from 'roosterjs-content-model-types';

interface TextSegmentIndexItem {
    paragraph: ContentModelParagraph;
    segments: ContentModelText[];
}

interface IndexedText extends Text {
    segmentIndex: TextSegmentIndexItem;
}

/**
 * @internal
 */
export function setTextSegmentIndex(
    textNode: Text,
    paragraph: ContentModelParagraph,
    segments: ContentModelText[]
) {
    const indexedText = textNode as IndexedText;
    indexedText.segmentIndex = {
        paragraph,
        segments,
    };
}

export function updateTextSegmentIndex(
    textNode: Text,
    callback: (
        paragraph: ContentModelParagraph,
        first: ContentModelText,
        last: ContentModelText
    ) => ContentModelText[]
): boolean {
    if (isIndexedText(textNode)) {
        const { paragraph, segments } = textNode.segmentIndex;
        const first = segments[0];
        const last = segments[segments.length - 1];

        if (first && last) {
            const newTexts = callback(paragraph, first, last);

            textNode.segmentIndex = {
                paragraph,
                segments: newTexts,
            };

            return true;
        }
    }

    return false;
}

function isIndexedText(textNode: Text): textNode is IndexedText {
    const { paragraph, segments } = (textNode as IndexedText).segmentIndex ?? {};

    return (
        paragraph &&
        paragraph.blockType == 'Paragraph' &&
        Array.isArray(paragraph.segments) &&
        Array.isArray(segments)
    );
}
