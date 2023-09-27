import { createText } from 'roosterjs-content-model-dom';
import { isPunctuation, isSpace } from '../../domUtils/stringUtil';
import { iterateSelections } from '../../modelApi/selection/iterateSelections';
import type {
    ContentModelDocument,
    ContentModelParagraph,
    ContentModelSegment,
    ContentModelText,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function adjustWordSelection(
    model: ContentModelDocument,
    marker: ContentModelSegment
): ContentModelSegment[] {
    let markerBlock: ContentModelParagraph | undefined;

    iterateSelections([model], (path, tableContext, block, segments) => {
        //Find the block with the selection marker
        if (block?.blockType == 'Paragraph' && segments?.length == 1 && segments[0] == marker) {
            markerBlock = block;
        }
        return true;
    });

    const tempSegments = markerBlock ? [...markerBlock.segments] : undefined;

    if (tempSegments && markerBlock) {
        const segments: ContentModelSegment[] = [];
        let markerSelectionIndex = tempSegments.indexOf(marker);
        for (let i = markerSelectionIndex - 1; i >= 0; i--) {
            const currentSegment = tempSegments[i];
            if (currentSegment.segmentType == 'Text') {
                const found = findDelimiter(currentSegment, false /*moveRightward*/);
                if (found > -1) {
                    if (found == currentSegment.text.length) {
                        break;
                    }

                    splitTextSegment(tempSegments, currentSegment, i, found);

                    segments.push(tempSegments[i + 1]);

                    break;
                } else {
                    segments.push(tempSegments[i]);
                }
            } else {
                break;
            }
        }

        markerSelectionIndex = tempSegments.indexOf(marker);
        segments.push(marker);

        // Marker is at start of word
        if (segments.length <= 1) {
            return segments;
        }

        for (let i = markerSelectionIndex + 1; i < tempSegments.length; i++) {
            const currentSegment = tempSegments[i];
            if (currentSegment.segmentType == 'Text') {
                const found = findDelimiter(currentSegment, true /*moveRightward*/);
                if (found > -1) {
                    if (found == 0) {
                        break;
                    }
                    splitTextSegment(tempSegments, currentSegment, i, found);
                    segments.push(tempSegments[i]);
                    break;
                } else {
                    segments.push(tempSegments[i]);
                }
            } else {
                break;
            }
        }

        // Marker is at end of word
        if (segments[segments.length - 1] == marker) {
            return [marker];
        }

        markerBlock.segments = tempSegments;
        return segments;
    } else {
        return [marker];
    }
}

/*
// These are unicode characters mostly from the Category Space Separator (Zs)
https://unicode.org/Public/UNIDATA/Scripts.txt

\u2000 = EN QUAD
\u2009 = THIN SPACE
\u200a = HAIR SPACE
​\u200b = ZERO WIDTH SPACE
​\u202f = NARROW NO-BREAK SPACE
\u205f​ = MEDIUM MATHEMATICAL SPACE
\u3000 = IDEOGRAPHIC SPACE
*/
function findDelimiter(segment: ContentModelText, moveRightward: boolean): number {
    const word = segment.text;
    let offset = -1;
    if (moveRightward) {
        for (let i = 0; i < word.length; i++) {
            const char = word[i];

            if (isPunctuation(char) || isSpace(char)) {
                offset = i;
                break;
            }
        }
    } else {
        for (let i = word.length - 1; i >= 0; i--) {
            const char = word[i];

            if (isPunctuation(char) || isSpace(char)) {
                offset = i + 1;
                break;
            }
        }
    }
    return offset;
}

function splitTextSegment(
    segments: ContentModelSegment[],
    textSegment: Readonly<ContentModelText>,
    index: number,
    found: number
) {
    const text = textSegment.text;
    const newSegmentLeft = createText(
        text.substring(0, found),
        textSegment.format,
        textSegment.link,
        textSegment.code
    );
    const newSegmentRight = createText(
        text.substring(found, text.length),
        textSegment.format,
        textSegment.link,
        textSegment.code
    );
    segments.splice(index, 1, newSegmentLeft, newSegmentRight);
}
