import { ContentModelParagraph, ContentModelSegment } from 'roosterjs-content-model-types';
import { deleteSingleChar } from './deleteSingleChar';
import { EntityOperation } from 'roosterjs-editor-types';
import { FormatWithContentModelContext } from '../../../publicTypes/parameter/FormatWithContentModelContext';
import { isWhiteSpacePreserved, normalizeSingleSegment } from 'roosterjs-content-model-dom';
import { normalizeText } from '../../../domUtils/stringUtil';

/**
 * @internal
 */
export function deleteSegment(
    paragraph: ContentModelParagraph,
    segmentToDelete: ContentModelSegment,
    context?: FormatWithContentModelContext,
    direction?: 'forward' | 'backward'
): boolean {
    const segments = paragraph.segments;
    const index = segments.indexOf(segmentToDelete);
    const preserveWhiteSpace = isWhiteSpacePreserved(paragraph);
    const isForward = direction == 'forward';
    const isBackward = direction == 'backward';

    if (!preserveWhiteSpace) {
        normalizePreviousSegment(segments, index);
    }

    switch (segmentToDelete.segmentType) {
        case 'Br':
        case 'SelectionMarker':
            segments.splice(index, 1);
            return true;
        case 'Image':
            if (segmentToDelete.link) {
                segments.splice(index, 2);
            } else {
                segments.splice(index, 1);
            }
            return true;
        case 'Entity':
            const operation = segmentToDelete.isSelected
                ? EntityOperation.Overwrite
                : isForward
                ? EntityOperation.RemoveFromStart
                : isBackward
                ? EntityOperation.RemoveFromEnd
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
        normalizeSingleSegment(segment);
    }
}
