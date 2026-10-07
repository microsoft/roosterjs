import type { ModelToMarkdownOptions } from '../ModelToMarkdownOptions';
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
    listCounter: ListCounter,
    options?: ModelToMarkdownOptions
): string {
    let markdownString = '';
    switch (blockGroup.blockGroupType) {
        case 'ListItem':
            if (listCounter) {
                markdownString += createMarkdownListItem(
                    blockGroup,
                    newLinePattern,
                    listCounter,
                    options
                );
            }
            break;
        case 'FormatContainer':
            markdownString += createMarkdownBlockQuote(
                blockGroup,
                newLinePattern,
                listCounter,
                options
            );
            break;
        default:
            const { blocks } = blockGroup;
            for (const block of blocks) {
                markdownString += createMarkdownBlock(
                    block,
                    newLinePattern,
                    listCounter,
                    undefined,
                    undefined,
                    options
                );
            }
            break;
    }
    return markdownString;
}

function createMarkdownListItem(
    listItem: ContentModelListItem,
    newLinePattern: MarkdownLineBreaks,
    listCounter: ListCounter,
    options?: ModelToMarkdownOptions
): string {
    let markdownString = '';
    const { blocks } = listItem;
    let previousMultiline = false;
    for (const block of blocks) {
        const part = createMarkdownBlock(
            block,
            newLinePattern,
            listCounter,
            undefined /* newLines */,
            {
                ignoreLineBreaks: true,
            },
            options
        );
        const multiline = part.indexOf('\n') >= 0;
        markdownString += (markdownString && (multiline || previousMultiline) ? '\n' : '') + part;
        previousMultiline = multiline;
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

    const prefix = /^( *[-*+] | *\d+\. )/.exec(markdownString)?.[0] ?? '';
    markdownString = markdownString.replace(/\n/g, '\n' + ' '.repeat(prefix.length));
    return markdownString + newLinePattern.newLine;
}

function createMarkdownBlockQuote(
    blockquote: ContentModelFormatContainer,
    newLinePattern: MarkdownLineBreaks,
    listCounter: ListCounter,
    options?: ModelToMarkdownOptions
): string {
    let markdownString = '';
    if (blockquote.tagName == 'blockquote') {
        const { blocks } = blockquote;
        for (const block of blocks) {
            markdownString +=
                '> ' +
                createMarkdownBlock(
                    block,
                    newLinePattern,
                    listCounter,
                    undefined /* newLines */,
                    {
                        ignoreLineBreaks: true,
                    },
                    options
                ).replace(/\n/g, '\n> ') +
                newLinePattern.newLine;
        }
    }

    return `${markdownString}\n`;
}
