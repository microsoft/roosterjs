import { createListItem, createListLevel } from 'roosterjs-content-model-dom';
import { createParagraphFromMarkdown } from './createParagraphFromMarkdown';
import type { ContentModelListItem } from 'roosterjs-content-model-types';
import type { MarkdownToModelOptions } from '../types/MarkdownToModelOptions';

/**
 * @internal
 */
export function createListFromMarkdown(
    text: string,
    listType: 'OL' | 'UL',
    options: MarkdownToModelOptions,
    list?: ContentModelListItem
): ContentModelListItem {
    const marker = text.trim().split(' ')[0];
    const isDummy = isDummyListItem(marker);
    const startNumber = listType === 'OL' && !list ? parseInt(marker, 10) : undefined;
    const itemText = isDummy ? text : text.trim().substring(marker.length);
    const paragraph = createParagraphFromMarkdown(itemText.trim(), options);
    const levels = createLevels(text, listType, isDummy, options, startNumber);

    const listModel = createListItem(levels);
    if (options.direction) {
        listModel.format.direction = options.direction;
    }

    listModel.blocks.push(paragraph);
    return listModel;
}

function createLevels(
    text: string,
    listType: 'OL' | 'UL',
    isDummy: boolean,
    options: MarkdownToModelOptions,
    startNumberOverride?: number
) {
    const level = createListLevel(
        listType,
        options.direction ? { direction: options.direction } : undefined
    );
    if (startNumberOverride) {
        level.format.startNumberOverride = startNumberOverride;
    }

    if (isDummy) {
        level.format.displayForDummyItem = 'block';
    }
    const levels = [level];
    if (isSubListItem(text)) {
        levels.push(level);
    }
    return levels;
}

function isSubListItem(item: string): boolean {
    return item.startsWith(' ');
}

const isDummyListItem = (item: string) => {
    return item != '-' && item != '+' && item != '*' && !item.endsWith('.');
};
