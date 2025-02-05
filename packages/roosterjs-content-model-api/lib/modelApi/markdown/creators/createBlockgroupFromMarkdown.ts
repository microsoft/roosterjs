import { createBlockQuoteFromMarkdown } from './createBlockQuoteFromMarkdown';
import { createListFromMarkdown } from './createListFromMarkdown';
import type {
    ContentModelBlockGroup,
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
    group?: ContentModelBlockGroup
): ContentModelFormatContainer | ContentModelListItem {
    if (MarkdownBlockGroupType[patternName] === 'ListItem') {
        return createListFromMarkdown(
            text,
            patternName,
            group?.blockGroupType === 'ListItem' ? group : undefined
        );
    } else {
        return createBlockQuoteFromMarkdown(
            text,
            group?.blockGroupType === 'FormatContainer' ? group : undefined
        );
    }
}
