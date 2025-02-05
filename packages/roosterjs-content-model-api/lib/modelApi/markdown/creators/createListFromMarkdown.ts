import { createListItem, createListLevel } from 'roosterjs-content-model-dom';
import { createParagraphFromMarkdown } from './createParagraphFromMarkdown';
import type { ContentModelListItem } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function createListFromMarkdown(
    text: string,
    patternName: string,
    list?: ContentModelListItem
): ContentModelListItem {
    const paragraph = createParagraphFromMarkdown(text);
    const level = createListLevel(patternName === 'ordered_list' ? 'OL' : 'UL');
    const listModel = list || createListItem([]);
    listModel.blocks.push(paragraph);
    listModel.levels.push(level);
    return listModel;
}
