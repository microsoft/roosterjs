import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';
import { ContentModelSegment } from '../../publicTypes/segment/ContentModelSegment';
import { ContentModelText } from '../../publicTypes/segment/ContentModelText';
import { createText } from '../../modelApi/creators/createText';

export function selectWord(
    path: ContentModelBlockGroup[],
    marker: ContentModelSegment
): ContentModelSegment[] {
    const parent = path[0];
    const block = parent.blocks[0];

    if (block.blockType == 'Paragraph') {
        const segments: ContentModelSegment[] = [];
        let markerSelectionIndex = block.segments.indexOf(marker);
        for (let i = markerSelectionIndex - 1; i >= 0; i--) {
            const currentSegment = block.segments[i];
            if (currentSegment.segmentType == 'Text') {
                const found = findDelimiter(currentSegment, false);
                if (found != null) {
                    if (found == currentSegment.text.length) {
                        break;
                    }
                    splitTextSegment(block.segments as ContentModelText[], i, found);
                    //block.segments[i + 1].isSelected = true;
                    segments.push(block.segments[i + 1]);
                    break;
                } else {
                    segments.push(block.segments[i]);
                }
            } else {
                break;
            }
        }
        markerSelectionIndex = block.segments.indexOf(marker);
        for (let i = markerSelectionIndex + 1; i < block.segments.length; i++) {
            const currentSegment = block.segments[i];
            if (currentSegment.segmentType == 'Text') {
                const found = findDelimiter(currentSegment, true);
                if (found != null) {
                    if (found == 0) {
                        break;
                    }
                    splitTextSegment(block.segments as ContentModelText[], i, found);
                    //block.segments[i].isSelected = true;
                    segments.push(block.segments[i]);
                    break;
                } else {
                    segments.push(block.segments[i]);
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

const PUNCTUATION_REGEX = /[.,:!?()\[\]\\/]/gu;
const SPACES_REGEX = /[\u00A0\u1680​\u180e\u2000\u2009\u200a​\u200b​\u202f\u205f​\u3000\s\t\r\n]/gm;

function findDelimiter(segment: ContentModelText, moveRightward: boolean): number | null {
    const word = segment.text;
    let offset = null;
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

function splitTextSegment(segments: ContentModelText[], index: number, found: number) {
    const text = segments[index].text;
    const newSegment = createText(text.substring(0, found), segments[index].format);
    segments[index].text = text.substring(found, text.length);
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
