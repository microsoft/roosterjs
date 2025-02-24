import { splitSelectedParagraphByBr } from '../block/splitSelectedParagraphByBr';
import {
    createListItem,
    createListLevel,
    getOperationalBlocks,
    isBlockGroupOfType,
    mutateBlock,
    normalizeContentModel,
    setParagraphNotImplicit,
    updateListMetadata,
} from 'roosterjs-content-model-dom';
import type {
    ContentModelListItem,
    ReadonlyContentModelBlock,
    ReadonlyContentModelDocument,
    ReadonlyContentModelListItem,
    ShallowMutableContentModelListItem,
} from 'roosterjs-content-model-types';

/**
 * Set a list type to content model
 * @param model the model document
 * @param listType the list type OL | UL
 * @param removeMargins true to remove margins, false to keep margins @default false
 */
export function setListType(
    model: ReadonlyContentModelDocument,
    listType: 'OL' | 'UL',
    removeMargins: boolean = false
) {
    splitSelectedParagraphByBr(model);

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
    let existingListItems: ReadonlyContentModelListItem[] = [];

    paragraphOrListItems.forEach(({ block, parent }, itemIndex) => {
        if (isBlockGroupOfType<ContentModelListItem>(block, 'ListItem')) {
            const level = block.levels.pop();

            if (!alreadyInExpectedType && level) {
                level.listType = listType;
                block.levels.push(level);
            } else if (block.blocks.length == 1) {
                setParagraphNotImplicit(block.blocks[0]);
            }

            if (alreadyInExpectedType) {
                //if the list item has margins or textAlign, we need to apply them to the block to preserve the indention and alignment
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
                    const newListItem: ShallowMutableContentModelListItem = createListItem(
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
                                marginBottom: removeMargins ? '0px' : undefined,
                                marginTop: removeMargins ? '0px' : undefined,
                            }),
                        ],
                        // For list bullet, we only want to carry over these formats from segments:
                        {
                            fontFamily: segmentFormat.fontFamily,
                            fontSize: segmentFormat.fontSize,
                            textColor: segmentFormat.textColor,
                        }
                    );

                    if (block.blockType == 'Paragraph') {
                        setParagraphNotImplicit(block);
                    }

                    const mutableBlock = mutateBlock(block);

                    newListItem.blocks.push(mutableBlock);

                    if (mutableBlock.format.marginRight) {
                        newListItem.format.marginRight = mutableBlock.format.marginRight;
                        mutableBlock.format.marginRight = undefined;
                    }

                    if (mutableBlock.format.marginLeft) {
                        newListItem.format.marginLeft = mutableBlock.format.marginLeft;
                        mutableBlock.format.marginLeft = undefined;
                    }

                    if (mutableBlock.format.textAlign) {
                        newListItem.format.textAlign = mutableBlock.format.textAlign;
                    }

                    mutateBlock(parent).blocks.splice(index, 1, newListItem);
                    existingListItems.push(newListItem);

                    const levelIndex = newListItem.levels.length - 1;
                    const level = mutateBlock(newListItem).levels[levelIndex];

                    if (level) {
                        updateListMetadata(level, metadata =>
                            Object.assign({}, metadata, {
                                applyListStyleFromLevel: true,
                            })
                        );
                    }
                } else {
                    existingListItems.forEach(
                        x => (mutateBlock(x).levels[0].format.marginBottom = '0px')
                    );
                    existingListItems = [];
                }
            }
        }
    });

    normalizeContentModel(model);

    return paragraphOrListItems.length > 0;
}

function shouldIgnoreBlock(block: ReadonlyContentModelBlock) {
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
