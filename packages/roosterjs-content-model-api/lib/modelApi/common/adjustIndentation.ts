import { mutateSegment } from 'roosterjs-content-model-dom/lib';
import {
    ContentModelTable,
    InsertPoint,
    ShallowMutableContentModelListItem,
    ShallowMutableContentModelParagraph,
} from 'roosterjs-content-model-types';

const EN_SPACE = '\u2002';
const REGULAR_SPACE = '\u0020';
const NON_BREAK_SPACES = '\u00A0';

export const IndentStepInPixel = 40;

function countTabsSpaces(text: string) {
    const spaces = countSpacesBeforeText(text);
    const tabSpaces = Math.floor(spaces / 4);
    return tabSpaces;
}

function countSpacesBeforeText(str: string) {
    let count = 0;
    for (const char of str) {
        if (char === EN_SPACE || char === NON_BREAK_SPACES || char == REGULAR_SPACE) {
            count++;
        } else {
            break;
        }
    }

    return count;
}

/**
 * @internal
 */
export function adjustListIndentation(listItem: ShallowMutableContentModelListItem) {
    const block = listItem.blocks[0];
    if (
        block.blockType == 'Paragraph' &&
        block.segments.length > 0 &&
        block.segments[0].segmentType == 'Text'
    ) {
        const tabSpaces = countTabsSpaces(block.segments[0].text);
        if (tabSpaces > 0) {
            mutateSegment(block, block.segments[0], textSegment => {
                textSegment.text = textSegment.text.substring(tabSpaces * 4);
            });
            if (tabSpaces) {
                listItem.levels[0].format.marginLeft = tabSpaces * IndentStepInPixel + 'px';
            }
        }
    }
}

/**
 * @internal
 */
export function adjustTableIndentation(insertPoint: InsertPoint, table: ContentModelTable) {
    const { paragraph, marker } = insertPoint;
    const indentationMargin = getTableIndentation(paragraph);
    if (indentationMargin) {
        insertPoint.paragraph.segments = [marker];
    }
    if (insertPoint.paragraph.format.direction == 'rtl') {
        table.format.marginRight = indentationMargin * IndentStepInPixel + 'px';
    } else {
        table.format.marginLeft = indentationMargin * IndentStepInPixel + 'px';
    }
}

const getTableIndentation = (paragraph: ShallowMutableContentModelParagraph) => {
    let margin = 0;
    const segments = paragraph.segments;

    if (segments.length < 2) {
        return 0;
    }

    const lastSegment = segments[segments.length - 1];
    const secondLastSegment = segments[segments.length - 2];

    if (lastSegment.segmentType !== 'SelectionMarker' && lastSegment.segmentType !== 'Br') {
        return 0;
    }

    const endIndex =
        secondLastSegment.segmentType === 'SelectionMarker'
            ? segments.length - 2
            : segments.length - 1;

    for (let i = 0; i < endIndex; i++) {
        const seg = segments[i];

        if (seg.segmentType === 'Text') {
            if (seg.text.trim().length === 0) {
                margin += countTabsSpaces(seg.text);
            } else {
                return 0;
            }
        } else if (seg.segmentType !== 'Br') {
            return 0;
        }
    }

    return margin;
};
