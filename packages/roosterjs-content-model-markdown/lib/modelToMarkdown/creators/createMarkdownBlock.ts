import { createMarkdownBlockGroup } from './createMarkdownBlockGroup';
import { createMarkdownParagraph } from './createMarkdownParagraph';
import { createMarkdownTable } from './createMarkdownTable';
import type { ContentModelBlock } from 'roosterjs-content-model-types';
import type { ListCounter } from './createMarkdownBlockGroup';

export interface MarkdownLineBreaks {
    newLine: string;
    lineBreak: string;
}

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
    ignoreLineBreaks?: boolean
): string {
    let markdownString = '';
    const lines = { ...DEFAULT_NEW_LINE, ...newLines };
    switch (block.blockType) {
        case 'Paragraph':
            markdownString += createMarkdownParagraph(block, ignoreLineBreaks) + lines.paragraph;
            break;
        case 'BlockGroup':
            markdownString += createMarkdownBlockGroup(block, newLinePattern, listCounter);
            break;
        case 'Table':
            markdownString += createMarkdownTable(block, newLinePattern, listCounter) + lines.table;
            break;
        case 'Divider':
            if (!ignoreLineBreaks) {
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
