import { ContentModelParagraph } from '../../../publicTypes/block/ContentModelParagraph';
import { ContentModelSegment } from '../../../publicTypes/segment/ContentModelSegment';
import { createNormalizeSegmentContext, normalizeSegment } from '../../common/normalizeSegment';
import { deleteSingleChar } from './deleteSingleChar';
import { EditEntry } from './EditStep';
import { EntityOperation } from 'roosterjs-editor-types';
import { isWhiteSpacePreserved } from '../../common/isWhiteSpacePreserved';

/**
 * @internal
 */
export function deleteSegment(
    paragraph: ContentModelParagraph,
    segmentToDelete: ContentModelSegment,
    onDeleteEntity: EditEntry,
    direction?: 'forward' | 'backward'
): boolean {
    const segments = paragraph.segments;
    const index = segments.indexOf(segmentToDelete);
    const preserveWhiteSpace = isWhiteSpacePreserved(paragraph);

    if (!preserveWhiteSpace) {
        normalizePreviousSegment(segments, index);
    }

    switch (segmentToDelete.segmentType) {
        case 'Br':
        case 'Image':
        case 'SelectionMarker':
            segments.splice(index, 1);
            return true;

        case 'Entity':
            const operation = segmentToDelete.isSelected
                ? EntityOperation.Overwrite
                : direction == 'forward'
                ? EntityOperation.RemoveFromStart
                : direction == 'backward'
                ? EntityOperation.RemoveFromEnd
                : undefined;
            if (operation !== undefined && !onDeleteEntity?.(segmentToDelete, operation)) {
                segments.splice(index, 1);
            }

            return true;

        case 'Text':
            let text = segmentToDelete.text;

            if (text.length == 0 || segmentToDelete.isSelected) {
                segments.splice(index, 1);
            } else if (direction) {
                text = deleteSingleChar(text, direction == 'forward'); //  isForward ? text.substring(1) : text.substring(0, text.length - 1);

                if (!preserveWhiteSpace) {
                    text = text.replace(direction == 'forward' ? /^\u0020+/ : /\u0020+$/, '\u00A0');
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
                // No op if a general segment is not selected, let browser handle general segment
                // TODO: Need to revisit this
                return false;
            }
    }
}

function normalizePreviousSegment(segments: ContentModelSegment[], currentIndex: number) {
    let index = currentIndex - 1;

    while (segments[index]?.segmentType == 'SelectionMarker') {
        index--;
    }

    const segment = segments[index];

    if (segment) {
        const context = createNormalizeSegmentContext();

        context.ignoreTrailingSpaces = false;
        normalizeSegment(segment, context);
    }
}
