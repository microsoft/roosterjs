import { isWhiteSpacePreserved } from 'roosterjs-content-model-dom';
import type { ElementProcessor } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const pasteTextProcessor: ElementProcessor<Text> = (group, text, context) => {
    const whiteSpace = context.blockFormat.whiteSpace;

    if (isWhiteSpacePreserved(whiteSpace)) {
        text.nodeValue = text.nodeValue?.replace(/\u0020\u0020/g, '\u0020\u00A0') ?? '';
    }

    context.defaultElementProcessors['#text'](group, text, context);
};
