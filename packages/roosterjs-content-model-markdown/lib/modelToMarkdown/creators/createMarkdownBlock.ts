import type { ModelToMarkdownOptions } from '../ModelToMarkdownOptions';
import { createMarkdownCodeBlock } from './createMarkdownCodeBlock';
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
    paragraphContext?: ParagraphContext,
    options?: ModelToMarkdownOptions
): string {
    const custom = options?.onBlock?.(block);
    if (custom !== undefined) {
        return custom + (paragraphContext?.ignoreLineBreaks ? '' : newLinePattern.lineBreak);
    }
    if (
        block.blockType == 'BlockGroup' &&
        block.blockGroupType == 'FormatContainer' &&
        block.tagName == 'pre'
    ) {
        return (
            createMarkdownCodeBlock(block) +
            (paragraphContext?.ignoreLineBreaks ? '' : newLinePattern.lineBreak)
        );
    }
    let markdownString = '';
    const lines = { ...DEFAULT_NEW_LINE, ...newLines };
    switch (block.blockType) {
        case 'Paragraph':
            markdownString += createMarkdownParagraph(block, paragraphContext) + lines.paragraph;
            break;
        case 'BlockGroup':
            markdownString += createMarkdownBlockGroup(block, newLinePattern, listCounter, options);
            break;
        case 'Table':
            markdownString +=
                createMarkdownTable(block, newLinePattern, listCounter, options) + lines.table;
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
