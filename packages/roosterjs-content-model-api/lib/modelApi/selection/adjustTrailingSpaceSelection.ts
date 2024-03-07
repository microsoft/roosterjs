import { createText, iterateSelections } from 'roosterjs-content-model-dom';
import type {
    ContentModelDocument,
    ContentModelParagraph,
    ContentModelText,
} from 'roosterjs-content-model-types';

/**
 * If a format cannot be applied to be applied to a trailing space, split the trailing space into a separate segment
 * @internal
 */
export function adjustTrailingSpaceSelection(model: ContentModelDocument) {
    iterateSelections(model, (_, __, block, segments) => {
        if (block?.blockType === 'Paragraph' && segments && segments.length > 0) {
            if (
                segments.length === 1 &&
                segments[0].segmentType === 'Text' &&
                shouldSplitTrailingSpace(segments[0])
            ) {
                splitTextSegment(block, segments[0]);
            } else {
                const lastTextSegment =
                    segments[segments.length - 1].segmentType === 'SelectionMarker'
                        ? segments[segments.length - 2]
                        : segments[segments.length - 1];
                if (
                    lastTextSegment &&
                    lastTextSegment.segmentType === 'Text' &&
                    shouldSplitTrailingSpace(lastTextSegment)
                ) {
                    splitTextSegment(block, lastTextSegment);
                }
            }
        }

        return false;
    });
}

function shouldSplitTrailingSpace(segment: ContentModelText) {
    return segment.isSelected && hasTrailingSpace(segment.text) && !isTrailingSpace(segment.text);
}

function hasTrailingSpace(text: string) {
    return text.trimRight() !== text;
}

function isTrailingSpace(text: string) {
    return text.trimRight().length == 0;
}

function splitTextSegment(block: ContentModelParagraph, textSegment: Readonly<ContentModelText>) {
    const text = textSegment.text.trimRight();
    const trailingSpace = textSegment.text.substring(text.length);
    const newText = createText(text, textSegment.format, textSegment.link, textSegment.code);
    newText.isSelected = true;
    const trailingSpaceLink = textSegment.link
        ? {
              ...textSegment.link,
              format: {
                  ...textSegment.link?.format,
                  underline: false, // Remove underline for trailing space link
              },
          }
        : undefined;
    const trailingSpaceSegment = createText(
        trailingSpace,
        undefined,
        trailingSpaceLink,
        textSegment.code
    );
    trailingSpaceSegment.isSelected = true;
    const index = block.segments.indexOf(textSegment);
    block.segments.splice(index, 1, newText, trailingSpaceSegment);
}
