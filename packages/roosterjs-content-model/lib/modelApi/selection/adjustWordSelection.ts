import { ContentModelBlock } from 'roosterjs-content-model/lib/publicTypes/block/ContentModelBlock';
import { ContentModelDocument } from 'roosterjs-content-model/lib/publicTypes/group/ContentModelDocument';
import { ContentModelSegment } from '../../publicTypes/segment/ContentModelSegment';
import { ContentModelText } from '../../publicTypes/segment/ContentModelText';
import { createText } from '../creators/createText';
import { iterateSelections } from 'roosterjs-content-model/lib/modelApi/selection/iterateSelections';

export function adjustWordSelection(
    model: ContentModelDocument,
    marker: ContentModelSegment
): ContentModelSegment[] {
    const path = [model];
    let markerBlock: ContentModelBlock = path[0].blocks[0];

    iterateSelections([model], (path, tableContext, block, segments) => {
        //Find the block with the selection marker
        if (block?.blockType == 'Paragraph' && segments?.length == 1 && segments[0] == marker) {
            markerBlock = block;
        }
        return true;
    });

    if (markerBlock.blockType == 'Paragraph') {
        const segments: ContentModelSegment[] = [];
        let markerSelectionIndex = markerBlock.segments.indexOf(marker);
        for (let i = markerSelectionIndex - 1; i >= 0; i--) {
            const currentSegment = markerBlock.segments[i];
            if (currentSegment.segmentType == 'Text') {
                const found = findDelimiter(currentSegment, false /*moveRightward*/);
                if (found > -1) {
                    if (found == currentSegment.text.length) {
                        break;
                    }
                    splitTextSegment(markerBlock.segments, currentSegment, i, found);
                    segments.push(markerBlock.segments[i + 1]);
                    break;
                } else {
                    segments.push(markerBlock.segments[i]);
                }
            } else {
                break;
            }
        }
        markerSelectionIndex = markerBlock.segments.indexOf(marker);
        segments.push(marker);
        for (let i = markerSelectionIndex + 1; i < markerBlock.segments.length; i++) {
            const currentSegment = markerBlock.segments[i];
            if (currentSegment.segmentType == 'Text') {
                const found = findDelimiter(currentSegment, true /*moveRightward*/);
                if (found > -1) {
                    if (found == 0) {
                        break;
                    }
                    splitTextSegment(markerBlock.segments, currentSegment, i, found);
                    segments.push(markerBlock.segments[i]);
                    break;
                } else {
                    segments.push(markerBlock.segments[i]);
                }
            } else {
                break;
            }
        }
        return segments;
    } else {
        return [];
    }
}

const PUNCTUATION_REGEX = /[.,:?!"()\[\]\\/]/gu;
const SPACES_REGEX = /[\u00A0\u1680​\u180e\u2000\u2009\u200a​\u200b​\u202f\u205f​\u3000\s\t\r\n]/gm;

export function findDelimiter(segment: ContentModelText, moveRightward: boolean): number {
    const word = segment.text;
    let offset = -1;
    if (moveRightward) {
        for (let i = 0; i < word.length; i++) {
            if (isWordDelimiter(word[i])) {
                offset = i;
                break;
            }
        }
    } else {
        for (let i = word.length - 1; i >= 0; i--) {
            if (isWordDelimiter(word[i])) {
                offset = i + 1;
                break;
            }
        }
    }
    return offset;
}

function splitTextSegment(
    segments: ContentModelSegment[],
    textSegment: ContentModelText,
    index: number,
    found: number
) {
    const text = textSegment.text;
    const newSegment = createText(text.substring(0, found), segments[index].format);
    textSegment.text = text.substring(found, text.length);
    segments.splice(index, 0, newSegment);
}

function isWordDelimiter(char: string) {
    return PUNCTUATION_REGEX.test(char) || isSpace(char);
}

function isSpace(char: string) {
    return (
        char &&
        (char.toString() == String.fromCharCode(160) /* &nbsp */ ||
        char.toString() == String.fromCharCode(32) /* RegularSpace */ ||
            SPACES_REGEX.test(char))
    );
}
