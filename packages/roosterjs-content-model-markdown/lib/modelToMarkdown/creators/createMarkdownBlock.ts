import { createMarkdownBlockGroup } from './createMarkdownBlockGroup';
import { createMarkdownParagraph } from './createMarkdownParagraph';
import { createMarkdownTable } from './createMarkdownTable';
import type { ParagraphContext } from './createMarkdownParagraph';
import type { ContentModelBlock } from 'roosterjs-content-model-types';
import type { ListCounter } from './createMarkdownBlockGroup';
import type { MarkdownLineBreaks } from '../../constants/markdownLineBreaks';

/**
 * @internal
 */
export interface MarkdownLineBreaksByBlockType {
    table: string;
    paragraph: string;
    divider: string;
}

const DEFAULT_NEW_LINE: MarkdownLineBreaksByBlockType = {
    table: '',
    paragraph: '',
    divider: '\n\n',
};

/**
 * @internal
 */
export function createMarkdownBlock(
    block: ContentModelBlock,
    newLinePattern: MarkdownLineBreaks,
    listCounter: ListCounter,
    newLines?: Partial<MarkdownLineBreaksByBlockType>,
    paragraphContext?: ParagraphContext
): string {
    let markdownString = '';
    const lines = { ...DEFAULT_NEW_LINE, ...newLines };
    switch (block.blockType) {
        case 'Paragraph':
            markdownString += createMarkdownParagraph(block, paragraphContext) + lines.paragraph;
            break;
        case 'BlockGroup':
            markdownString += createMarkdownBlockGroup(block, newLinePattern, listCounter);
            break;
        case 'Table':
            markdownString += createMarkdownTable(block, newLinePattern, listCounter) + lines.table;
            break;
        case 'Divider':
            if (!paragraphContext?.ignoreLineBreaks) {
                markdownString += '---' + lines.divider;
            }

            break;
        case 'Entity':
            break;
        default:
            break;
    }
    return markdownString;
}
