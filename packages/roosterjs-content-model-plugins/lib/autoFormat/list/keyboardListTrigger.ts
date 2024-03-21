import { findListItemsInSameThread, setListType } from 'roosterjs-content-model-api';
import { getListTypeStyle } from './getListTypeStyle';

import {
    getFirstSelectedListItem,
    getSelectedSegmentsAndParagraphs,
    updateListMetadata,
} from 'roosterjs-content-model-core';
import type { ContentModelDocument, IEditor } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function keyboardListTrigger(
    editor: IEditor,
    shouldSearchForBullet: boolean = true,
    shouldSearchForNumbering: boolean = true
) {
    if (shouldSearchForBullet || shouldSearchForNumbering) {
        editor.takeSnapshot();
        editor.formatContentModel(
            (model, context) => {
                const listStyleType = getListTypeStyle(
                    model,
                    shouldSearchForBullet,
                    shouldSearchForNumbering
                );
                if (listStyleType) {
                    const segmentsAndParagraphs = getSelectedSegmentsAndParagraphs(model, false);
                    if (segmentsAndParagraphs[0] && segmentsAndParagraphs[0][1]) {
                        segmentsAndParagraphs[0][1].segments.splice(0, 1);
                    }
                    const { listType, styleType, index } = listStyleType;
                    triggerList(model, listType, styleType, index);
                    context.canUndoByBackspace = true;
                    return true;
                }

                return false;
            },
            {
                apiName: 'autoToggleList',
            }
        );
    }
}

const triggerList = (
    model: ContentModelDocument,
    listType: 'OL' | 'UL',
    styleType: number,
    index?: number
) => {
    setListType(model, listType);
    const isOrderedList = listType == 'OL';
    const listItem = getFirstSelectedListItem(model);
    if (listItem) {
        const listItems = findListItemsInSameThread(model, listItem);
        const levelIndex = listItem.levels.length - 1;
        // If the index < 1, it is a new list, so it will be starting by 1, then no need to set startNumber
        if (index && index > 1 && isOrderedList) {
            const level = listItem?.levels[levelIndex];
            if (level) {
                level.format.startNumberOverride = index;
            }
        }

        listItems.forEach(listItem => {
            const level = listItem.levels[levelIndex];
            if (level) {
                updateListMetadata(level, metadata =>
                    Object.assign(
                        {},
                        metadata,
                        isOrderedList
                            ? {
                                  orderedStyleType: styleType,
                              }
                            : {
                                  unorderedStyleType: styleType,
                              }
                    )
                );
            }
        });
    }
};
