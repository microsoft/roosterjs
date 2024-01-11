import { createListItem, createListLevel } from 'roosterjs-content-model-dom';
import { getListTypeStyle } from './utils/getListTypeStyle';
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
            const listStyleType = getListTypeStyle(
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
                            direction: block.format.direction,
                            textAlign: block.format.textAlign,
                            marginTop: '0',
                            marginBlockEnd: '0px',
                            marginBlockStart: '0px',
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
