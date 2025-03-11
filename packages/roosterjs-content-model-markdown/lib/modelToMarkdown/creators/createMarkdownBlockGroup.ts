import { createMarkdownBlock } from './createMarkdownBlock';
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
    listCounter: ListCounter
): string {
    let markdownString = '';
    switch (blockGroup.blockGroupType) {
        case 'ListItem':
            if (listCounter) {
                markdownString += createMarkdownListItem(blockGroup, listCounter);
            }
            break;
        case 'FormatContainer':
            markdownString += createMarkdownBlockQuote(blockGroup, listCounter);
            break;
        default:
            const { blocks } = blockGroup;
            for (const block of blocks) {
                markdownString += createMarkdownBlock(block, listCounter);
            }
            break;
    }
    return markdownString;
}

function createMarkdownListItem(listItem: ContentModelListItem, listCounter: ListCounter): string {
    let markdownString = '';
    const { blocks } = listItem;
    for (const block of blocks) {
        markdownString += createMarkdownBlock(block, listCounter);
    }
    const lastIndex = listItem.levels.length - 1;
    const isSubList = lastIndex + 1 > 1;
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

    return markdownString + '\n';
}

function createMarkdownBlockQuote(
    blockquote: ContentModelFormatContainer,
    listCounter: ListCounter
): string {
    let markdownString = '';
    if (blockquote.tagName == 'blockquote') {
        const { blocks } = blockquote;
        for (const block of blocks) {
            markdownString += '> ' + createMarkdownBlock(block, listCounter) + '\n';
        }
    }

    return `${markdownString}\n`;
}
