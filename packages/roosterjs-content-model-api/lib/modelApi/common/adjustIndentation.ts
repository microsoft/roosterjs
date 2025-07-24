import { mutateSegment } from 'roosterjs-content-model-dom';
import type {
    ContentModelTable,
    InsertPoint,
    ShallowMutableContentModelListItem,
    ShallowMutableContentModelParagraph,
} from 'roosterjs-content-model-types';

const EN_SPACE = '\u2002';
const REGULAR_SPACE = '\u0020';
const NON_BREAK_SPACES = '\u00A0';

/**
 * @internal
 */
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
            listItem.levels[0].format.marginLeft = tabSpaces * IndentStepInPixel + 'px';
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
        if (insertPoint.paragraph.format.direction == 'rtl') {
            table.format.marginRight = indentationMargin * IndentStepInPixel + 'px';
        } else {
            table.format.marginLeft = indentationMargin * IndentStepInPixel + 'px';
        }
    }
}

const getTableIndentation = (paragraph: ShallowMutableContentModelParagraph) => {
    let tabsNumber = 0;
    const segments = paragraph.segments;

    const isEmptyLine = paragraph.segments.every(
        s =>
            (s.segmentType == 'Text' && s.text.trim().length == 0) ||
            s.segmentType == 'SelectionMarker' ||
            s.segmentType == 'Br'
    );

    if (!isEmptyLine) {
        return;
    }

    let numberOfSegments = 0;
    for (const seg of segments) {
        if (seg.segmentType === 'Text') {
            tabsNumber = tabsNumber + countTabsSpaces(seg.text);
            numberOfSegments++;
        } else {
            break;
        }
    }

    // Text segments must be >= (total segments - 2) to apply margin.
    // If not, the selection marker is likely between  texts segment, so skip margin adjustment.
    if (segments.length - 2 <= numberOfSegments) {
        return tabsNumber;
    }

    return;
};
