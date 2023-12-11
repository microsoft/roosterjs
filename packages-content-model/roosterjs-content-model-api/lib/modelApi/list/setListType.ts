import { getOperationalBlocks, isBlockGroupOfType } from 'roosterjs-content-model-core';
import {
    createListItem,
    createListLevel,
    normalizeContentModel,
    setParagraphNotImplicit,
} from 'roosterjs-content-model-dom';
import type {
    ContentModelBlock,
    ContentModelDocument,
    ContentModelListItem,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function setListType(model: ContentModelDocument, listType: 'OL' | 'UL') {
    const paragraphOrListItems = getOperationalBlocks<ContentModelListItem>(
        model,
        ['ListItem'],
        [] // Set stop types to be empty so we can find list items even cross the boundary of table, then we can always operation on the list item if any
    );
    const alreadyInExpectedType = paragraphOrListItems.every(({ block }) =>
        isBlockGroupOfType<ContentModelListItem>(block, 'ListItem')
            ? block.levels[block.levels.length - 1]?.listType == listType
            : shouldIgnoreBlock(block)
    );
    let existingListItems: ContentModelListItem[] = [];
    let hasIgnoredParagraphBefore = false;

    paragraphOrListItems.forEach(({ block, parent }, itemIndex) => {
        if (isBlockGroupOfType<ContentModelListItem>(block, 'ListItem')) {
            const level = block.levels.pop();
            console.log('level', level);

            if (!alreadyInExpectedType && level) {
                level.listType = listType;
                block.levels.push(level);
            } else if (block.blocks.length == 1) {
                setParagraphNotImplicit(block.blocks[0]);
                block.blocks.forEach(x => {
                    if (block.format.marginLeft) {
                        x.format.marginLeft = block.format.marginLeft;
                    }

                    if (block.format.marginRight) {
                        x.format.marginRight = block.format.marginRight;
                    }

                    if (block.format.textAlign) {
                        x.format.textAlign = block.format.textAlign;
                    }
                });
            }
        } else {
            const index = parent.blocks.indexOf(block);

            if (index >= 0) {
                if (paragraphOrListItems.length == 1 || !shouldIgnoreBlock(block)) {
                    const prevBlock = parent.blocks[index - 1];
                    const segmentFormat =
                        (block.blockType == 'Paragraph' && block.segments[0]?.format) || {};
                    const newListItem = createListItem(
                        [
                            createListLevel(listType, {
                                startNumberOverride:
                                    itemIndex > 0 ||
                                    (prevBlock?.blockType == 'BlockGroup' &&
                                        prevBlock.blockGroupType == 'ListItem' &&
                                        prevBlock.levels[0]?.listType == 'OL')
                                        ? undefined
                                        : 1,
                                direction: block.format.direction,
                                textAlign: block.format.textAlign,
                                marginTop: hasIgnoredParagraphBefore ? '0' : undefined,
                                marginBlockEnd: '0px',
                                marginBlockStart: '0px',
                            }),
                        ],
                        // For list bullet, we only want to carry over these formats from segments:
                        {
                            fontFamily: segmentFormat.fontFamily,
                            fontSize: segmentFormat.fontSize,
                            textColor: segmentFormat.textColor,
                        }
                    );

                    // Since there is only one paragraph under the list item, no need to keep its paragraph element (DIV).
                    // TODO: Do we need to keep the CSS styles applied to original DIV?
                    if (block.blockType == 'Paragraph') {
                        block.isImplicit = true;
                    }

                    newListItem.blocks.push(block);

                    if (block.format.marginRight) {
                        newListItem.format.marginRight = block.format.marginRight;
                        block.format.marginRight = undefined;
                    }
                    if (block.format.marginLeft) {
                        newListItem.format.marginLeft = block.format.marginLeft;
                        block.format.marginLeft = undefined;
                    }

                    if (block.format.textAlign) {
                        newListItem.format.textAlign = block.format.textAlign;
                    }

                    parent.blocks.splice(index, 1, newListItem);
                    existingListItems.push(newListItem);
                } else {
                    hasIgnoredParagraphBefore = true;

                    existingListItems.forEach(x => (x.levels[0].format.marginBottom = '0'));
                    existingListItems = [];
                }
            }
        }
    });

    normalizeContentModel(model);

    return paragraphOrListItems.length > 0;
}

function shouldIgnoreBlock(block: ContentModelBlock) {
    switch (block.blockType) {
        case 'Table':
            return false;
        case 'Paragraph':
            return block.segments.every(
                x => x.segmentType == 'Br' || x.segmentType == 'SelectionMarker'
            );
        default:
            return true;
    }
}
