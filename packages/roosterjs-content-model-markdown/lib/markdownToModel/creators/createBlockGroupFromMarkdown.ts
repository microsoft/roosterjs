import { createBlockQuoteFromMarkdown } from './createBlockQuoteFromMarkdown';
import { createListFromMarkdown } from './createListFromMarkdown';
import type {
    ContentModelBlockGroupType,
    ContentModelFormatContainer,
    ContentModelListItem,
} from 'roosterjs-content-model-types';
import type { MarkdownToModelOptions } from '../types/MarkdownToModelOptions';

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
    options: MarkdownToModelOptions,
    group?: ContentModelFormatContainer
): ContentModelFormatContainer | ContentModelListItem {
    if (MarkdownBlockGroupType[patternName] === 'ListItem') {
        return createListFromMarkdown(text, patternName === 'ordered_list' ? 'OL' : 'UL', options);
    } else {
        return createBlockQuoteFromMarkdown(text, options, group);
    }
}
