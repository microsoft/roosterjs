import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';
import { formatWithContentModel } from '../utils/formatWithContentModel';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import { iterateSelections } from '../../modelApi/selection/iterateSelections';
import { setPendingFormat } from '../../modelApi/format/pendingFormat';

/**
 * @internal
 * This is a temporary solution to handle format change when backspace/delete. This is not completed yet.
 */
export default function handleDelete(editor: IContentModelEditor, key: 'delete' | 'backspace') {
    let pos = editor.getFocusedPosition();
    let format: ContentModelSegmentFormat | undefined;

    formatWithContentModel(editor, 'backspace', model => {
        iterateSelections([model], (_1, _2, block, segments) => {
            if (block?.blockType == 'Paragraph') {
                if (
                    key == 'backspace' &&
                    segments?.length == 1 &&
                    segments[0].segmentType == 'SelectionMarker'
                ) {
                    // Backspace with a collapsed selection, set pending format to the format of previous segment
                    const index = block.segments.indexOf(segments[0]);

                    format = index > 0 ? block.segments[index - 1].format : undefined;
                } else if (
                    segments &&
                    segments.length > 0 &&
                    block.segments.every(x => x.isSelected)
                ) {
                    // Delete everything of a paragraph, set pending format to the format of the first segment
                    format = segments[0].format;
                }
            }

            return true;
        });

        return false;
    });

    if (format && pos) {
        setPendingFormat(editor, format, pos);
    }
}
