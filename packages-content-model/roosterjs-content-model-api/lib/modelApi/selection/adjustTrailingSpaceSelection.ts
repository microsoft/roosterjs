import { createText } from 'roosterjs-content-model-dom';
import { iterateSelections } from 'roosterjs-content-model-core';
import type {
    ContentModelDocument,
    ContentModelSegment,
    ContentModelText,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function adjustTrailingSpaceSelection(model: ContentModelDocument) {
    iterateSelections(model, (_, __, block) => {
        if (block?.blockType == 'Paragraph' && block.segments.length == 1) {
            const segment = block.segments[0];
            if (
                segment.isSelected &&
                segment.segmentType == 'Text' &&
                hasTrailingSpace(segment.text) &&
                !isTrailingSpace(segment.text)
            ) {
                splitTextSegment(block.segments, segment);
            }
        }

        return false;
    });
}

function hasTrailingSpace(text: string) {
    return text.length > 0 && text.trimRight().length < text.length;
}

function isTrailingSpace(text: string) {
    return text.trimRight().length == 0;
}

function splitTextSegment(
    segments: ContentModelSegment[],
    textSegment: Readonly<ContentModelText>
) {
    const text = textSegment.text.trimRight();
    const trailingSpace = textSegment.text.substring(text.length);
    const newText = createText(text, textSegment.format, textSegment.link, textSegment.code);
    newText.isSelected = true;
    const trailingSpaceLink = textSegment.link
        ? {
              ...textSegment.link,
              format: {
                  ...textSegment.link?.format,
                  underline: false,
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
    segments.splice(0, 1, newText, trailingSpaceSegment);
}
