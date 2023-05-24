import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { ContentModelParagraph } from '../../publicTypes/block/ContentModelParagraph';
import { ContentModelSegment } from '../../publicTypes/segment/ContentModelSegment';
import { ContentModelText } from '../../publicTypes/segment/ContentModelText';
import { createText } from '../creators/createText';
import { findDelimiter } from '../edit/utils/findDelimiter';
import { iterateSelections } from '../../modelApi/selection/iterateSelections';

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

    if (markerBlock) {
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

        // Marker is at start of word
        if (segments.length <= 1) {
            return segments;
        }

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

        // Marker is at end of word
        if (segments[segments.length - 1] == marker) {
            return [marker];
        }

        return segments;
    } else {
        return [marker];
    }
}

function splitTextSegment(
    segments: ContentModelSegment[],
    textSegment: ContentModelText,
    index: number,
    found: number
) {
    const text = textSegment.text;
    const newSegment = createText(text.substring(0, found), segments[index].format);

    if (textSegment.code) {
        newSegment.code = {
            format: { ...textSegment.code.format },
        };
    }

    if (textSegment.link) {
        newSegment.link = {
            format: { ...textSegment.link.format },
            dataset: { ...textSegment.link.dataset },
        };
    }

    textSegment.text = text.substring(found, text.length);
    segments.splice(index, 0, newSegment);
}
