import {
    createBr,
    createFormatContainer,
    createParagraph,
    createText,
} from 'roosterjs-content-model-dom';
import type { ContentModelFormatContainer } from 'roosterjs-content-model-types';
import type { FencedCodeBlock } from '../types/FencedCodeBlock';

/** Create a literal PRE container without parsing Markdown inside its body. */
export function createFencedCodeBlock(block: FencedCodeBlock): ContentModelFormatContainer {
    const container = createFormatContainer('pre', { whiteSpace: 'pre' });
    const paragraph = createParagraph(true);
    paragraph.segments.push(block.source ? createText(block.source) : createBr());
    container.blocks.push(paragraph);
    container.codeBlock = { info: block.info, fence: block.fence };
    return container;
}
