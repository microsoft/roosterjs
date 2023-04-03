import { ContentModelBlock } from '../../publicTypes/block/ContentModelBlock';
import { ContentModelSegment } from '../../publicTypes/segment/ContentModelSegment';
import { EntityOperation } from 'roosterjs-editor-types';
import { OnDeleteEntity } from './DeleteSelectionStep';

/**
 * @internal
 */
export function deleteSegment(
    segments: ContentModelSegment[],
    segmentToDelete: ContentModelSegment,
    isForward: boolean,
    onDeleteEntity: OnDeleteEntity
): boolean {
    const index = segments.indexOf(segmentToDelete);

    switch (segmentToDelete.segmentType) {
        case 'Br':
        case 'Image':
        case 'SelectionMarker':
            segments.splice(index, 1);
            return true;

        case 'Entity':
            if (
                !onDeleteEntity?.(
                    segmentToDelete,
                    segmentToDelete.isSelected
                        ? EntityOperation.Overwrite
                        : isForward
                        ? EntityOperation.RemoveFromStart
                        : EntityOperation.RemoveFromEnd
                )
            ) {
                segments.splice(index, 1);
            }

            return true;

        case 'Text':
            let text = segmentToDelete.text;

            if (text.length == 0 || segmentToDelete.isSelected) {
                segments.splice(index, 1);
            } else {
                segmentToDelete.text = isForward
                    ? text.substring(1)
                    : text.substring(0, text.length - 1);
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

/**
 * @internal
 */
export function deleteBlock(
    blocks: ContentModelBlock[],
    blockToDelete: ContentModelBlock,
    isForward: boolean,
    onDeleteEntity: OnDeleteEntity,
    replacement?: ContentModelBlock
): boolean {
    const index = blocks.indexOf(blockToDelete);

    switch (blockToDelete.blockType) {
        case 'Table':
        case 'Divider':
            replacement ? blocks.splice(index, 1, replacement) : blocks.splice(index, 1);
            return true;

        case 'Entity':
            if (
                !onDeleteEntity(
                    blockToDelete,
                    blockToDelete.isSelected
                        ? EntityOperation.Overwrite
                        : isForward
                        ? EntityOperation.RemoveFromStart
                        : EntityOperation.RemoveFromEnd
                )
            ) {
                replacement ? blocks.splice(index, 1, replacement) : blocks.splice(index, 1);
            }

            return true;

        case 'BlockGroup':
            switch (blockToDelete.blockGroupType) {
                case 'General':
                    if (replacement) {
                        blocks.splice(index, 1, replacement);
                        return true;
                    } else {
                        // no op, let browser handle it
                        return false;
                    }

                case 'ListItem':
                case 'FormatContainer':
                    blocks.splice(index, 1);
                    return true;
            }
    }

    return false;
}
