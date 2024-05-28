import { findListItemsInSameThread } from '../list/findListItemsInSameThread';
import { getListAnnounceData } from '../list/getListAnnounceData';
import {
    createListLevel,
    getOperationalBlocks,
    isBlockGroupOfType,
    mutateBlock,
    parseValueWithUnit,
    updateListMetadata,
} from 'roosterjs-content-model-dom';
import type {
    ContentModelBlockFormat,
    ContentModelListItem,
    ContentModelListLevel,
    FormatContentModelContext,
    ReadonlyContentModelBlock,
    ReadonlyContentModelBlockGroup,
    ReadonlyContentModelDocument,
    ReadonlyContentModelListItem,
} from 'roosterjs-content-model-types';

const IndentStepInPixel = 40;

/**
 * @param model The content model to set indentation
 * @param indentation The indentation type, 'indent' to indent, 'outdent' to outdent
 * @param length The length of indentation in pixel, default value is 40
 * Set indentation for selected list items or paragraphs
 */
export function setModelIndentation(
    model: ReadonlyContentModelDocument,
    indentation: 'indent' | 'outdent',
    length: number = IndentStepInPixel,
    context?: FormatContentModelContext
) {
    const paragraphOrListItem = getOperationalBlocks<ContentModelListItem>(
        model,
        ['ListItem'],
        ['TableCell']
    );
    const isIndent = indentation == 'indent';
    const modifiedBlocks: ReadonlyContentModelBlock[] = [];

    paragraphOrListItem.forEach(({ block, parent, path }) => {
        if (isBlockGroupOfType<ContentModelListItem>(block, 'ListItem')) {
            const thread = findListItemsInSameThread(model, block);
            const firstItem = thread[0];
            //if the first item is selected and has only one level, we should add margin to the whole list
            if (isSelected(firstItem) && firstItem.levels.length == 1) {
                const level = block.levels[0];
                const { format } = level;
                const { marginLeft, marginRight } = format;
                const newValue = calculateMarginValue(format, isIndent, length);
                const isRtl = format.direction == 'rtl';
                const originalValue = parseValueWithUnit(isRtl ? marginRight : marginLeft);

                if (!isIndent && originalValue == 0) {
                    block.levels.pop();
                } else if (newValue !== null) {
                    if (isRtl) {
                        level.format.marginRight = newValue + 'px';
                    } else {
                        level.format.marginLeft = newValue + 'px';
                    }
                }
                //if block has only one level, there is not need to check if it is multilevel selection
            } else if (block.levels.length == 1 || !isMultilevelSelection(model, block, parent)) {
                if (isIndent) {
                    const lastLevel = block.levels[block.levels.length - 1];
                    const newLevel: ContentModelListLevel = createListLevel(
                        lastLevel?.listType || 'UL',
                        lastLevel?.format
                    );

                    updateListMetadata(newLevel, metadata => {
                        metadata = metadata || {};
                        metadata.applyListStyleFromLevel = true;
                        return metadata;
                    });

                    // New level is totally new, no need to have these attributes for now
                    delete newLevel.format.startNumberOverride;

                    block.levels.push(newLevel);
                } else {
                    block.levels.pop();
                }

                if (block.levels.length > 0 && context) {
                    context.announceData = getListAnnounceData([block, ...path]);
                }
            }
        } else if (block) {
            let currentBlock: ReadonlyContentModelBlock = block;
            let currentParent: ReadonlyContentModelBlockGroup = parent;

            while (currentParent && modifiedBlocks.indexOf(currentBlock) < 0) {
                const index = path.indexOf(currentParent);
                const { format } = mutateBlock(currentBlock);
                const newValue = calculateMarginValue(format, isIndent, length);

                if (newValue !== null) {
                    const isRtl = format.direction == 'rtl';

                    if (isRtl) {
                        format.marginRight = newValue + 'px';
                    } else {
                        format.marginLeft = newValue + 'px';
                    }

                    modifiedBlocks.push(currentBlock);

                    break;
                } else if (currentParent.blockGroupType == 'FormatContainer' && index >= 0) {
                    mutateBlock(currentParent);

                    currentBlock = currentParent;
                    currentParent = path[index + 1];
                } else {
                    break;
                }
            }
        }
    });

    return paragraphOrListItem.length > 0;
}

function isSelected(listItem: ReadonlyContentModelListItem) {
    return listItem.blocks.some(block => {
        if (block.blockType == 'Paragraph') {
            return block.segments.some(segment => segment.isSelected);
        }
    });
}

/*
 * Check if the selection has list items with different levels and the first item of the list is selected, do not create a sub list.
 * Otherwise, the margin of the first item will be changed, and the sub list will be created, creating a unintentional margin difference between the list items.
 */
function isMultilevelSelection(
    model: ReadonlyContentModelDocument,
    listItem: ReadonlyContentModelListItem,
    parent: ReadonlyContentModelBlockGroup
) {
    const listIndex = parent.blocks.indexOf(listItem);
    for (let i = listIndex - 1; i >= 0; i--) {
        const block = parent.blocks[i];
        if (
            isBlockGroupOfType<ContentModelListItem>(block, 'ListItem') &&
            block.levels.length == 1 &&
            isSelected(block)
        ) {
            const firstItem = findListItemsInSameThread(model, block)[0];
            return isSelected(firstItem);
        }

        if (!isBlockGroupOfType<ContentModelListItem>(block, 'ListItem')) {
            return false;
        }
    }
    return false;
}

function calculateMarginValue(
    format: Readonly<ContentModelBlockFormat>,
    isIndent: boolean,
    length: number = IndentStepInPixel
): number | null {
    const { marginLeft, marginRight, direction } = format;
    const isRtl = direction == 'rtl';
    const originalValue = parseValueWithUnit(isRtl ? marginRight : marginLeft);
    let newValue = (isIndent ? Math.ceil : Math.floor)(originalValue / length) * length;

    if (newValue == originalValue) {
        newValue = Math.max(newValue + length * (isIndent ? 1 : -1), 0);
    }

    if (newValue == originalValue) {
        // Return null to let caller know nothing is changed
        return null;
    } else {
        return newValue;
    }
}
