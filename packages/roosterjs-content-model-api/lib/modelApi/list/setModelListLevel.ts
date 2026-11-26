import { findListItemsInSameThread } from './findListItemsInSameThread';
import { getListAnnounceData } from './getListAnnounceData';
import { setListType, shouldIgnoreBlock } from './setListType';
import { splitSelectedParagraphByBr } from '../block/splitSelectedParagraphByBr';
import {
    createListLevel,
    getOperationalBlocks,
    isBlockGroupOfType,
    mutateBlock,
    normalizeContentModel,
    updateListMetadata,
} from 'roosterjs-content-model-dom';
import type {
    ContentModelListLevel,
    FormatContentModelContext,
    ReadonlyContentModelBlockGroup,
    ReadonlyContentModelDocument,
    ReadonlyContentModelListItem,
} from 'roosterjs-content-model-types';

/**
 * @internal
 * Set selected blocks to be list items of the given list type, and set their list level
 * @param model The content model to operate on
 * @param listType The list type to set, OL or UL
 * @param level The target list level, 1 based. 1 means top level list, 2 means first sub list, and so on.
 * @param context (Optional) The format context, used to set announce data
 * @returns True if any block is changed, otherwise false
 */
export function setModelListLevel(
    model: ReadonlyContentModelDocument,
    listType: 'OL' | 'UL',
    level: number,
    context?: FormatContentModelContext
): boolean {
    splitSelectedParagraphByBr(model);

    const paragraphOrListItems = getOperationalBlocks<ReadonlyContentModelListItem>(
        model,
        ['ListItem'],
        []
    );

    if (paragraphOrListItems.length == 0) {
        return false;
    }

    const hasListItem = paragraphOrListItems.some(({ block }) =>
        isBlockGroupOfType<ReadonlyContentModelListItem>(block, 'ListItem')
    );
    const alreadyInExpectedType = paragraphOrListItems.every(({ block }) =>
        isBlockGroupOfType<ReadonlyContentModelListItem>(block, 'ListItem')
            ? block.levels[block.levels.length - 1]?.listType == listType
            : shouldIgnoreBlock(block)
    );

    // setListType toggles lists off when all selected items are already in the expected type,
    // so only call it when we really need to convert blocks into the expected list type
    if (!hasListItem || !alreadyInExpectedType) {
        setListType(model, listType);
    }

    const listItems: {
        block: ReadonlyContentModelListItem;
        path: ReadonlyContentModelBlockGroup[];
    }[] = [];

    const updatedParagraphOrListItems = getOperationalBlocks<ReadonlyContentModelListItem>(
        model,
        ['ListItem'],
        []
    );

    for (const { block, path } of updatedParagraphOrListItems) {
        if (isBlockGroupOfType<ReadonlyContentModelListItem>(block, 'ListItem')) {
            listItems.push({ block, path });
        }
    }

    for (const { block: listItem } of listItems) {
        const thread = findListItemsInSameThread(model, listItem);
        const threadIndex = thread.indexOf(listItem);
        const previousItem = thread[threadIndex - 1];
        const nextItem = thread[threadIndex + 1];
        const { levels } = mutateBlock(listItem);

        while (levels.length > level) {
            levels.pop();
        }

        while (levels.length < level) {
            const levelLength = levels.length;
            const lastLevel = levels[levelLength - 1];
            const newLevel: ContentModelListLevel = createListLevel(
                listType,
                lastLevel?.format,
                previousItem && previousItem.levels.length > levelLength
                    ? previousItem.levels[levelLength].dataset
                    : nextItem && nextItem.levels.length > levelLength
                    ? nextItem.levels[levelLength].dataset
                    : undefined
            );

            setApplyListStyleFromLevel(newLevel);

            // New level is totally new, no need to keep start number
            delete newLevel.format.startNumberOverride;

            levels.push(newLevel);
        }

        const lastLevel = levels[levels.length - 1];

        if (lastLevel && lastLevel.listType != listType) {
            lastLevel.listType = listType;
            setApplyListStyleFromLevel(lastLevel);
        }
    }

    if (context && listItems.length == 1) {
        const { block, path } = listItems[0];

        context.announceData = getListAnnounceData([block, ...path]);
    }

    normalizeContentModel(model);

    return true;
}

function setApplyListStyleFromLevel(level: ContentModelListLevel) {
    updateListMetadata(level, metadata =>
        Object.assign({}, metadata, {
            applyListStyleFromLevel: true,
        })
    );
}
