import { createListLevel, parseValueWithUnit } from 'roosterjs-content-model-dom';
import { findListItemsInSameThread } from '../list/findListItemsInSameThread';
import {
    getOperationalBlocks,
    isBlockGroupOfType,
    updateListMetadata,
} from 'roosterjs-content-model-core';

import type {
    ContentModelBlockFormat,
    ContentModelBlockGroup,
    ContentModelDocument,
    ContentModelListItem,
    ContentModelListLevel,
} from 'roosterjs-content-model-types';

const IndentStepInPixel = 40;

/**
 * @internal
 */
export function setModelIndentation(
    model: ContentModelDocument,
    indentation: 'indent' | 'outdent',
    length: number = IndentStepInPixel
) {
    const paragraphOrListItem = getOperationalBlocks<ContentModelListItem>(
        model,
        ['ListItem'],
        ['TableCell']
    );
    const isIndent = indentation == 'indent';

    paragraphOrListItem.forEach(({ block, parent }, index) => {
        if (isBlockGroupOfType<ContentModelListItem>(block, 'ListItem')) {
            const thread = findListItemsInSameThread(model, block);
            const firstItem = thread[0];

            if (isSelected(firstItem) && firstItem.levels.length == 1) {
                const level = block.levels[0];
                const { format } = level;
                const { marginLeft, marginRight } = format;
                const newValue = calculateMarginValue(format, isIndent, length);
                const isRtl = format.direction == 'rtl';
                const originalValue = parseValueWithUnit(isRtl ? marginRight : marginLeft);

                if (!isIndent && originalValue == 0) {
                    block.levels.pop();
                } else {
                    if (isRtl) {
                        level.format.marginRight = newValue + 'px';
                    } else {
                        level.format.marginLeft = newValue + 'px';
                    }
                }
            } else if (block.levels.length == 1 || !multilevelSelection(model, block, parent)) {
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
            }
        } else if (block) {
            const { format } = block;
            const newValue = calculateMarginValue(format, isIndent, length);
            const isRtl = format.direction == 'rtl';

            if (isRtl) {
                format.marginRight = newValue + 'px';
            } else {
                format.marginLeft = newValue + 'px';
            }
        }
    });

    return paragraphOrListItem.length > 0;
}

function isSelected(listItem: ContentModelListItem) {
    return listItem.blocks.some(block => {
        if (block.blockType == 'Paragraph') {
            return block.segments.some(segment => segment.isSelected);
        }
    });
}

function multilevelSelection(
    model: ContentModelDocument,
    listItem: ContentModelListItem,
    parent: ContentModelBlockGroup
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
}

function calculateMarginValue(
    format: ContentModelBlockFormat,
    isIndent: boolean,
    length: number = IndentStepInPixel
) {
    const { marginLeft, marginRight, direction } = format;
    const isRtl = direction == 'rtl';
    const originalValue = parseValueWithUnit(isRtl ? marginRight : marginLeft);
    let newValue = (isIndent ? Math.ceil : Math.floor)(originalValue / length) * length;

    if (newValue == originalValue) {
        newValue = Math.max(newValue + length * (isIndent ? 1 : -1), 0);
    }
    return newValue;
}
