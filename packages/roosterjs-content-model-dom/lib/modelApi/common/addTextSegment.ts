import { addDecorators } from './addDecorators';
import { addSegment } from './addSegment';
import { createText } from '../creators/createText';
import { ensureParagraph } from './ensureParagraph';
import { hasSpacesOnly } from './hasSpacesOnly';
import { isWhiteSpacePreserved } from '../../domUtils/isWhiteSpacePreserved';
import type {
    ContentModelBlockGroup,
    ContentModelText,
    DomToModelContext,
} from 'roosterjs-content-model-types';

/**
 * Add a new text segment to current paragraph
 * @param group Current BlockGroup that the paragraph belong to
 * @param text Text content of the text segment
 * @param context Current DOM to Model context
 * @returns A new Text segment, or undefined if the input text is empty
 */
export function addTextSegment(
    group: ContentModelBlockGroup,
    text: string,
    context: DomToModelContext
): ContentModelText | undefined {
    let textModel: ContentModelText | undefined;

    if (text) {
        const paragraph = ensureParagraph(group, context.blockFormat);

        if (
            !hasSpacesOnly(text) ||
            (paragraph?.segments.length ?? 0) > 0 ||
            isWhiteSpacePreserved(paragraph?.format.whiteSpace)
        ) {
            textModel = createText(text, context.segmentFormat);

            if (context.isInSelection) {
                textModel.isSelected = true;
            }

            addDecorators(textModel, context);

            addSegment(group, textModel, context.blockFormat);
        }
    }

    return textModel;
}
