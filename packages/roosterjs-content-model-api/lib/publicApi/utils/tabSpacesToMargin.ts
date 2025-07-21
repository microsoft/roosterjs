import type { ContentModelText } from 'roosterjs-content-model-types';

const SPACE = '\u2002';
/**
 * @see handleTabKey uses the default space length defined in @see setModelIndentation
 */
const IndentStepInPixel = 40;

export function tabSpacesToMargin(textSegment: ContentModelText) {
    const spaces = countSpacesBeforeText(textSegment.text);
    const tabSpaces = Math.floor(spaces / 4);
    return tabSpaces * IndentStepInPixel;
}

function countSpacesBeforeText(str: string) {
    let count = 0;

    for (const char of str) {
        if (char === SPACE) {
            count++;
        } else {
            break;
        }
    }

    return count;
}
