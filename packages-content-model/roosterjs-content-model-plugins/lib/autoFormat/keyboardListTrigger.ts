import { createListItem, createListLevel } from 'roosterjs-content-model-dom';
import { getListType } from './listFeaturesUtils/getListType';
import {
    getOperationalBlocks,
    isBlockGroupOfType,
    updateListMetadata,
} from 'roosterjs-content-model-core';
import type { IStandaloneEditor } from 'roosterjs-content-model-types';

export const keyboardListTrigger = (
    editor: IStandaloneEditor,
    rawEvent: KeyboardEvent,
    shouldSearchForBullet: boolean = true,
    shouldSearchForNumbering: boolean = true
) => {
    if (rawEvent.key === ' ') {
        editor.formatContentModel((model, context) => {
            const listStyleType = getListType(
                editor,
                shouldSearchForBullet,
                shouldSearchForNumbering
            );
            if (listStyleType) {
                const { listType, styleType, index } = listStyleType;

                const paragraphOrListItems = getOperationalBlocks(model, ['ListItem'], []);
                paragraphOrListItems.forEach(({ block, parent }, itemIndex) => {
                    if (!isBlockGroupOfType(block, 'General')) {
                        const blockIndex = parent.blocks.indexOf(block);
                        const listLevel = createListLevel(listType, {
                            startNumberOverride: index,
                        });
                        updateListMetadata(
                            listLevel,
                            metadata =>
                                (metadata =
                                    listType == 'UL'
                                        ? {
                                              unorderedStyleType: styleType,
                                          }
                                        : {
                                              orderedStyleType: styleType,
                                          })
                        );
                        const listItem = createListItem([listLevel]);
                        parent.blocks.splice(blockIndex, 1, listItem);
                    }
                });
                return true;
            }
            return false;
        });
    }
};
