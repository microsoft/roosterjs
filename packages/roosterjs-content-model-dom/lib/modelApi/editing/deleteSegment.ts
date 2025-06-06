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
    ShallowMutableContentModelSegment,
} from 'roosterjs-content-model-types';

/**
 * Delete a content model segment from current selection
 * @param readonlyParagraph Parent paragraph of the segment to delete
 * @param readonlySegmentToDelete The segment to delete
 * @param context @optional Context object provided by formatContentModel API
 * @param direction @optional Whether this is deleting forward or backward. This is only used for deleting entity.
 * @param undeletableSegments @optional When passed, if this segment is undeletable, it will be added to this array instead of being deleted.
 * If not specified, only selected entity will be deleted
 */
export function deleteSegment(
    readonlyParagraph: ReadonlyContentModelParagraph,
    readonlySegmentToDelete: ReadonlyContentModelSegment,
    context?: FormatContentModelContext,
    direction?: 'forward' | 'backward',
    undeletableSegments?: ShallowMutableContentModelSegment[]
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
            removeSegment(segments, index, direction, undeletableSegments);
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
                removeSegment(segments, index, direction, undeletableSegments);
                context?.deletedEntities.push({
                    entity: segmentToDelete,
                    operation,
                });
            }

            return true;

        case 'Text':
            if (segmentToDelete.text.length == 0 || segmentToDelete.isSelected) {
                segmentToDelete.text = '';
                removeSegment(segments, index, direction, undeletableSegments);
            } else if (direction) {
                let text = segmentToDelete.text;

                text = deleteSingleChar(text, isForward); //  isForward ? text.substring(1) : text.substring(0, text.length - 1);

                if (!preserveWhiteSpace) {
                    text = normalizeText(text, isForward);
                }

                segmentToDelete.text = text;

                if (text == '') {
                    removeSegment(segments, index, direction, undeletableSegments);
                }
            }

            return true;

        case 'General':
            if (segmentToDelete.isSelected) {
                removeSegment(segments, index, direction, undeletableSegments);
                return true;
            } else {
                return false;
            }

        default:
            return false;
    }
}

function removeSegment(
    segments: ShallowMutableContentModelSegment[],
    index: number,
    direction?: 'forward' | 'backward',
    undeletableSegments?: ShallowMutableContentModelSegment[]
) {
    const segment = segments.splice(index, 1)[0];

    if (segment.link?.format.undeletable) {
        // Segment is not deletable, but at least we should unselect it
        delete segment.isSelected;

        if (undeletableSegments) {
            // For undeletable segments, if an undeletableSegments array is passed in,
            // put it into this array after we delete it, so caller knows that we have deleted some undeletable segments
            // and do proper handling
            undeletableSegments.push(segment);
        } else {
            // Otherwise, we need to reinsert it back to the segments array to keep the model consistent.
            // We need to find the right place to insert it back based on the direction of deletion
            let insertIndex: number;

            switch (direction) {
                case 'forward':
                    insertIndex =
                        index > 0 && segments[index - 1].segmentType == 'SelectionMarker'
                            ? index - 1
                            : index;
                    break;

                case 'backward':
                    insertIndex =
                        index < segments.length && segments[index].segmentType == 'SelectionMarker'
                            ? index + 1
                            : index;
                    break;

                default:
                    insertIndex = index;
            }

            segments.splice(insertIndex, 0, segment);
        }
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
