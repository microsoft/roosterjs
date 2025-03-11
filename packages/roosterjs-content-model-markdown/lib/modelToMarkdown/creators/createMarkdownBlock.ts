import { createMarkdownBlockGroup } from './createMarkdownBlockGroup';
import { createMarkdownParagraph } from './createMarkdownParagraph';
import { createMarkdownTable } from './createMarkdownTable';
import type { ContentModelBlock } from 'roosterjs-content-model-types';
import type { ListCounter } from './createMarkdownBlockGroup';

/**
 * @internal
 */
export function createMarkdownBlock(block: ContentModelBlock, listCounter: ListCounter): string {
    let markdownString = '';
    switch (block.blockType) {
        case 'Paragraph':
            markdownString += createMarkdownParagraph(block);
            break;
        case 'BlockGroup':
            markdownString += createMarkdownBlockGroup(block, listCounter);
            break;
        case 'Table':
            markdownString += createMarkdownTable(block, listCounter);
            break;
        case 'Divider':
            markdownString += '---\n\n';
            break;
        case 'Entity':
            break;
        default:
            break;
    }
    return markdownString;
}
