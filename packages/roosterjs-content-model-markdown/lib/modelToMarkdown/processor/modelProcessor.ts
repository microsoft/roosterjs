import { createMarkdownBlock } from '../creators/createMarkdownBlock';
import type { MarkdownLineBreaks } from '../../constants/markdownLineBreaks';
import type { ListCounter } from '../creators/createMarkdownBlockGroup';
import type { ContentModelDocument } from 'roosterjs-content-model-types';

const DEFAULT_NEW_LINE: MarkdownLineBreaks = {
    lineBreak: '\n\n',
    newLine: '\n',
};

/**
 * @internal
 */
export function modelProcessor(
    model: ContentModelDocument,
    newLine: MarkdownLineBreaks = DEFAULT_NEW_LINE
): string {
    let markdown = '';
    const listCounter: ListCounter = {
        listItemCount: 0,
        subListItemCount: 0,
    };
    for (const block of model.blocks) {
        const isListItem = block.blockType === 'BlockGroup' && block.blockGroupType === 'ListItem';
        if (!isListItem && (listCounter.listItemCount > 0 || listCounter.subListItemCount > 0)) {
            listCounter.listItemCount = 0;
            listCounter.subListItemCount = 0;
            markdown += newLine.newLine;
        }

        markdown += createMarkdownBlock(block, newLine, listCounter, {
            table: newLine.newLine,
            paragraph: newLine.lineBreak,
            divider: newLine.lineBreak,
        });
    }

    return markdown;
}
