import { ContentModelBlock } from '../../publicTypes/block/ContentModelBlock';
import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { ContentModelListItem } from '../../publicTypes/group/ContentModelListItem';
import { createListItem } from '../creators/createListItem';
import { getOperationalBlocks, OperationalBlocks } from '../selection/collectSelections';
import { isBlockGroupOfType } from '../common/isBlockGroupOfType';
import { normalizeContentModel } from '../common/normalizeContentModel';
import { setParagraphNotImplicit } from '../block/setParagraphNotImplicit';

/**
 * @internal
 */
export function setListType(model: ContentModelDocument, listType: 'OL' | 'UL') {
    const paragraphOrListItems = getOperationalBlocks<ContentModelListItem>(
        model,
        ['ListItem'],
        [] // Set stop types to be empty so we can find list items even cross the boundary of table, then we can always operation on the list item if any
    );
    const alreadyInExpectedType = paragraphOrListItems.every(
        ({ block }) =>
            (isBlockGroupOfType<ContentModelListItem>(block, 'ListItem') &&
                block.levels[block.levels.length - 1]?.listType == listType) ||
            !shouldTurnOnList(paragraphOrListItems, block)
    );
    let existingListItems: ContentModelListItem[] = [];
    let hasIgnoredParagraphBefore = false;

    paragraphOrListItems.forEach(({ block, parent }, itemIndex) => {
        if (isBlockGroupOfType<ContentModelListItem>(block, 'ListItem')) {
            const level = block.levels.pop();

            if (!alreadyInExpectedType && level) {
                level.listType = listType;
                block.levels.push(level);
            } else if (block.blocks.length == 1) {
                setParagraphNotImplicit(block.blocks[0]);
            }
        } else {
            const index = parent.blocks.indexOf(block);

            if (index >= 0) {
                if (shouldTurnOnList(paragraphOrListItems, block)) {
                    const prevBlock = parent.blocks[index - 1];
                    const segmentFormat =
                        (block.blockType == 'Paragraph' && block.segments[0]?.format) || {};
                    const newListItem = createListItem(
                        [
                            {
                                listType,
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
                            },
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

                    parent.blocks.splice(index, 1, newListItem);
                    existingListItems.push(newListItem);
                } else {
                    hasIgnoredParagraphBefore = true;

                    existingListItems.forEach(x => (x.levels[0].marginBottom = '0'));
                    existingListItems = [];
                }
            }
        }
    });

    normalizeContentModel(model);

    return paragraphOrListItems.length > 0;
}

function shouldTurnOnList(
    blocks: OperationalBlocks<ContentModelListItem>[],
    block: ContentModelBlock
): boolean {
    return (
        blocks.length == 1 ||
        (block.blockType == 'Paragraph' &&
            block.segments.length > 0 &&
            block.segments.some(x => x.segmentType != 'Br' && x.segmentType != 'SelectionMarker'))
    );
}
