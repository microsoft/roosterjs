import { createMarkdownBlock } from './createMarkdownBlock';
import type { MarkdownLineBreaks } from '../../constants/markdownLineBreaks';
import type {
    ContentModelBlockGroup,
    ContentModelFormatContainer,
    ContentModelListItem,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export interface ListCounter {
    listItemCount: number;
    subListItemCount: number;
}

/**
 * @internal
 */
export function createMarkdownBlockGroup(
    blockGroup: ContentModelBlockGroup,
    newLinePattern: MarkdownLineBreaks,
    listCounter: ListCounter
): string {
    let markdownString = '';
    switch (blockGroup.blockGroupType) {
        case 'ListItem':
            if (listCounter) {
                markdownString += createMarkdownListItem(blockGroup, newLinePattern, listCounter);
            }
            break;
        case 'FormatContainer':
            markdownString += createMarkdownBlockQuote(blockGroup, newLinePattern, listCounter);
            break;
        default:
            const { blocks } = blockGroup;
            for (const block of blocks) {
                markdownString += createMarkdownBlock(block, newLinePattern, listCounter);
            }
            break;
    }
    return markdownString;
}

function createMarkdownListItem(
    listItem: ContentModelListItem,
    newLinePattern: MarkdownLineBreaks,
    listCounter: ListCounter
): string {
    let markdownString = '';
    const { blocks } = listItem;
    for (const block of blocks) {
        markdownString += createMarkdownBlock(
            block,
            newLinePattern,
            listCounter,
            undefined /* newLines */,
            {
                ignoreLineBreaks: true,
            }
        );
    }
    const lastIndex = listItem.levels.length - 1;
    const isSubList = lastIndex + 1 > 1;
    const dummyFormat = listItem.levels[lastIndex].format.displayForDummyItem;
    if (dummyFormat && dummyFormat !== 'listItem') {
        return (markdownString = ` ${markdownString}`);
    }

    if (isSubList) {
        listCounter.subListItemCount++;
        if (listItem.levels[lastIndex].listType == 'OL') {
            markdownString = `   ${listCounter.subListItemCount}. ${markdownString}`;
        } else {
            markdownString = `  - ${markdownString}`;
        }
    } else {
        listCounter.listItemCount++;
        if (listItem.levels[lastIndex].listType == 'OL') {
            markdownString = `${listCounter.listItemCount}. ${markdownString}`;
        } else {
            markdownString = `- ${markdownString}`;
        }
    }

    return markdownString + newLinePattern.newLine;
}

function createMarkdownBlockQuote(
    blockquote: ContentModelFormatContainer,
    newLinePattern: MarkdownLineBreaks,
    listCounter: ListCounter
): string {
    let markdownString = '';
    if (blockquote.tagName == 'blockquote') {
        const { blocks } = blockquote;
        for (const block of blocks) {
            markdownString +=
                '> ' +
                createMarkdownBlock(block, newLinePattern, listCounter, undefined /* newLines */, {
                    ignoreLineBreaks: true,
                }) +
                newLinePattern.newLine;
        }
    }

    return `${markdownString}\n`;
}
