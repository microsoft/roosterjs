import type {
    ContentModelBlockGroup,
    ContentModelListItem,
    ReadonlyContentModelBlockGroup,
    ReadonlyContentModelListItem,
} from 'roosterjs-content-model-types';

/**
 * Search for all list items in the same thread as the current list item
 * @param model The content model
 * @param currentItem The current list item
 */
export function findListItemsInSameThread(
    group: ContentModelBlockGroup,
    currentItem: ContentModelListItem
): ContentModelListItem[];

/**
 * Search for all list items in the same thread as the current list item (Readonly)
 * @param model The content model
 * @param currentItem The current list item
 */
export function findListItemsInSameThread(
    group: ReadonlyContentModelBlockGroup,
    currentItem: ReadonlyContentModelListItem
): ReadonlyContentModelListItem[];

export function findListItemsInSameThread(
    group: ReadonlyContentModelBlockGroup,
    currentItem: ReadonlyContentModelListItem
): ReadonlyContentModelListItem[] {
    const items: (ContentModelListItem | null)[] = [];

    findListItems(group, items);

    return filterListItems(items, currentItem);
}

function findListItems(
    group: ReadonlyContentModelBlockGroup,
    result: (ReadonlyContentModelListItem | null)[]
) {
    group.blocks.forEach(block => {
        switch (block.blockType) {
            case 'BlockGroup':
                if (block.blockGroupType == 'ListItem') {
                    result.push(block);
                } else {
                    pushNullIfNecessary(result);
                    findListItems(block, result);
                    pushNullIfNecessary(result);
                }
                break;

            case 'Paragraph':
                pushNullIfNecessary(result);

                block.segments.forEach(segment => {
                    if (segment.segmentType == 'General') {
                        findListItems(segment, result);
                    }
                });

                pushNullIfNecessary(result);
                break;

            case 'Table':
                pushNullIfNecessary(result);

                block.rows.forEach(row =>
                    row.cells.forEach(cell => {
                        findListItems(cell, result);
                    })
                );
                pushNullIfNecessary(result);

                break;
        }
    });
}

function pushNullIfNecessary(result: (ReadonlyContentModelListItem | null)[]) {
    const last = result[result.length - 1];

    if (!last || last !== null) {
        result.push(null);
    }
}

function filterListItems(
    items: (ReadonlyContentModelListItem | null)[],
    currentItem: ReadonlyContentModelListItem
) {
    const result: ReadonlyContentModelListItem[] = [];
    const currentIndex = items.indexOf(currentItem);
    const levelLength = currentItem.levels.length;
    const isOrderedList = currentItem.levels[levelLength - 1]?.listType == 'OL';

    if (currentIndex >= 0) {
        for (let i = currentIndex; i >= 0; i--) {
            const item = items[i];

            if (!item) {
                if (isOrderedList) {
                    continue;
                } else {
                    break;
                }
            }

            const startNumberOverride = hasStartNumberOverride(item, levelLength);

            if (areListTypesCompatible(items, currentIndex, i)) {
                result.unshift(item);

                if (isOrderedList && startNumberOverride) {
                    break;
                }
            } else if (
                !isOrderedList ||
                startNumberOverride ||
                item.levels.length < currentItem.levels.length
            ) {
                break;
            }
        }

        for (let i = currentIndex + 1; i < items.length; i++) {
            const item = items[i];

            if (!item) {
                if (isOrderedList) {
                    continue;
                } else {
                    break;
                }
            }

            const startNumberOverride = hasStartNumberOverride(item, levelLength);

            if (areListTypesCompatible(items, currentIndex, i) && !startNumberOverride) {
                result.push(item);
            } else if (
                !isOrderedList ||
                startNumberOverride ||
                item.levels.length < currentItem.levels.length
            ) {
                break;
            }
        }
    }

    return result;
}

function areListTypesCompatible(
    listItems: (ReadonlyContentModelListItem | null)[],
    currentIndex: number,
    compareToIndex: number
): boolean {
    const currentLevels = listItems[currentIndex]!.levels;
    const compareToLevels = listItems[compareToIndex]!.levels;

    return (
        currentLevels.length <= compareToLevels.length &&
        currentLevels.every(
            (currentLevel, i) => currentLevel.listType == compareToLevels[i].listType
        )
    );
}

function hasStartNumberOverride(item: ReadonlyContentModelListItem, levelLength: number): boolean {
    return item.levels
        .slice(0, levelLength)
        .some(level => level.format.startNumberOverride !== undefined);
}
