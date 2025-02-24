import { createListItem, createListLevel } from 'roosterjs-content-model-dom';
import { createParagraphFromMarkdown } from './createParagraphFromMarkdown';
import type { ContentModelListItem } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function createListFromMarkdown(text: string, listType: 'OL' | 'UL'): ContentModelListItem {
    const marker = text.trim().split(' ')[0];
    const itemText = text.trim().substring(marker.length);
    const paragraph = createParagraphFromMarkdown(itemText.trim());
    const levels = createLevels(text, listType);
    const listModel = createListItem(levels);
    listModel.blocks.push(paragraph);
    return listModel;
}

function createLevels(text: string, listType: 'OL' | 'UL') {
    const level = createListLevel(listType);
    const levels = [level];
    if (isSubListItem(text)) {
        levels.push(level);
    }
    return levels;
}

function isSubListItem(item: string): boolean {
    return item.startsWith(' ');
}
