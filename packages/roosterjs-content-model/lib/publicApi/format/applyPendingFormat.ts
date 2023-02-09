import { createText } from '../../modelApi/creators/createText';
import { formatWithContentModel } from '../utils/formatWithContentModel';
import { getPendingFormat } from '../../modelApi/format/pendingFormat';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import { iterateSelections } from '../../modelApi/selection/iterateSelections';

/**
 * Apply pending format to the text user just input
 * @param editor The editor to get format from
 * @param data The text user just input
 */
export default function applyPendingFormat(editor: IContentModelEditor, data: string) {
    const format = getPendingFormat(editor);

    if (format) {
        let isChanged = false;

        formatWithContentModel(editor, 'applyPendingFormat', model => {
            iterateSelections([model], (_, __, block, segments) => {
                if (
                    block?.blockType == 'Paragraph' &&
                    segments?.length == 1 &&
                    segments[0].segmentType == 'SelectionMarker'
                ) {
                    const index = block.segments.indexOf(segments[0]);
                    const previousSegment = block.segments[index - 1];

                    if (previousSegment?.segmentType == 'Text') {
                        const text = previousSegment.text;

                        if (text.substr(-data.length, data.length) == data) {
                            previousSegment.text = text.substring(0, text.length - data.length);

                            const newText = createText(data, {
                                ...previousSegment.format,
                                ...format,
                            });

                            block.segments.splice(index, 0, newText);
                            isChanged = true;
                        }
                    }
                }
                return true;
            });

            return isChanged;
        });
    }
}
