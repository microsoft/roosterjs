import { createBlockQuoteFromMarkdown } from './createBlockQuoteFromMarkdown';
import { createListFromMarkdown } from './createListFromMarkdown';
import type {
    ContentModelBlockGroupType,
    ContentModelFormatContainer,
    ContentModelListItem,
} from 'roosterjs-content-model-types';

const MarkdownBlockGroupType: Record<string, ContentModelBlockGroupType> = {
    unordered_list: 'ListItem',
    ordered_list: 'ListItem',
    blockquote: 'FormatContainer',
};

/**
 * @internal
 */
export function createBlockGroupFromMarkdown(
    text: string,
    patternName: string,
    group?: ContentModelFormatContainer
): ContentModelFormatContainer | ContentModelListItem {
    if (MarkdownBlockGroupType[patternName] === 'ListItem') {
        return createListFromMarkdown(text, patternName);
    } else {
        return createBlockQuoteFromMarkdown(text, group);
    }
}
