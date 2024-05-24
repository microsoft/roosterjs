import { deleteSingleChar } from './deleteSingleChar';
import { isWhiteSpacePreserved } from '../../domUtils/isWhiteSpacePreserved';
import { mutateSegment } from '../common/mutate';
import { normalizeSingleSegment } from '../common/normalizeSegment';
import { normalizeText } from '../../domUtils/stringUtil';
import type {
    EntityRemovalOperation,
    FormatContentModelContext,
    ReadonlyContentModelParagraph,
    ReadonlyContentModelSegment,
} from 'roosterjs-content-model-types';

/**
 * Delete a content model segment from current selection
 * @param readonlyParagraph Parent paragraph of the segment to delete
 * @param readonlySegmentToDelete The segment to delete
 * @param context @optional Context object provided by formatContentModel API
 * @param direction @optional Whether this is deleting forward or backward. This is only used for deleting entity.
 * If not specified, only selected entity will be deleted
 */
export function deleteSegment(
    readonlyParagraph: ReadonlyContentModelParagraph,
    readonlySegmentToDelete: ReadonlyContentModelSegment,
    context?: FormatContentModelContext,
    direction?: 'forward' | 'backward'
): boolean {
    const [paragraph, segmentToDelete, index] = mutateSegment(
        readonlyParagraph,
        readonlySegmentToDelete
    );
    const segments = paragraph.segments;
    const preserveWhiteSpace = isWhiteSpacePreserved(paragraph.format.whiteSpace);
    const isForward = direction == 'forward';
    const isBackward = direction == 'backward';

    if (!preserveWhiteSpace) {
        normalizePreviousSegment(paragraph, segments, index);
    }

    switch (segmentToDelete?.segmentType) {
        case 'Br':
        case 'Image':
        case 'SelectionMarker':
            segments.splice(index, 1);
            return true;

        case 'Entity':
            const operation: EntityRemovalOperation | undefined = segmentToDelete.isSelected
                ? 'overwrite'
                : isForward
                ? 'removeFromStart'
                : isBackward
                ? 'removeFromEnd'
                : undefined;
            if (operation !== undefined) {
                segments.splice(index, 1);
                context?.deletedEntities.push({
                    entity: segmentToDelete,
                    operation,
                });
            }

            return true;

        case 'Text':
            let text = segmentToDelete.text;

            if (text.length == 0 || segmentToDelete.isSelected) {
                segments.splice(index, 1);
            } else if (direction) {
                text = deleteSingleChar(text, isForward); //  isForward ? text.substring(1) : text.substring(0, text.length - 1);

                if (!preserveWhiteSpace) {
                    text = normalizeText(text, isForward);
                }

                if (text == '') {
                    segments.splice(index, 1);
                } else {
                    segmentToDelete.text = text;
                }
            }

            return true;

        case 'General':
            if (segmentToDelete.isSelected) {
                segments.splice(index, 1);
                return true;
            } else {
                return false;
            }

        default:
            return false;
    }
}

function normalizePreviousSegment(
    paragraph: ReadonlyContentModelParagraph,
    segments: ReadonlyArray<ReadonlyContentModelSegment>,
    currentIndex: number
) {
    let index = currentIndex - 1;

    while (segments[index]?.segmentType == 'SelectionMarker') {
        index--;
    }

    const segment = segments[index];

    if (segment) {
        normalizeSingleSegment(paragraph, segment);
    }
}
