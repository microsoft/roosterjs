import { deleteSelection } from '../../publicApi/selection/deleteSelection';
import { normalizeContentModel } from 'roosterjs-content-model-dom';
import type { ContentModelSegmentFormat, IStandaloneEditor } from 'roosterjs-content-model-types';

/**
 * @internal
 * When necessary, set default format as current pending format so it will be applied when Input event is fired
 * @param editor The Content Model Editor
 * @param defaultFormat The default segment format to apply
 */
export function applyDefaultFormat(
    editor: IStandaloneEditor,
    defaultFormat: ContentModelSegmentFormat
) {
    editor.formatContentModel((model, context) => {
        const result = deleteSelection(model, [], context);

        if (result.deleteResult == 'range') {
            normalizeContentModel(model);

            editor.takeSnapshot();

            return true;
        } else if (result.deleteResult == 'notDeleted' && result.insertPoint) {
            const { paragraph, path, marker } = result.insertPoint;
            const blocks = path[0].blocks;
            const blockCount = blocks.length;
            const blockIndex = blocks.indexOf(paragraph);

            if (
                paragraph.isImplicit &&
                paragraph.segments.length == 1 &&
                paragraph.segments[0] == marker &&
                blockCount > 0 &&
                blockIndex == blockCount - 1
            ) {
                // Focus is in the last paragraph which is implicit and there is not other segments.
                // This can happen when focus is moved after all other content under current block group.
                // We need to check if browser will merge focus into previous paragraph by checking if
                // previous block is block. If previous block is paragraph, browser will most likely merge
                // the input into previous paragraph, then nothing need to do here. Otherwise we need to
                // apply pending format since this input event will start a new real paragraph.
                const previousBlock = blocks[blockIndex - 1];

                if (previousBlock?.blockType != 'Paragraph') {
                    context.newPendingFormat = getNewPendingFormat(
                        editor,
                        defaultFormat,
                        marker.format
                    );
                }
            } else if (paragraph.segments.every(x => x.segmentType != 'Text')) {
                context.newPendingFormat = getNewPendingFormat(
                    editor,
                    defaultFormat,
                    marker.format
                );
            }
        }

        // We didn't do any change but just apply default format to pending format, so no need to write back
        return false;
    });
}

function getNewPendingFormat(
    editor: IStandaloneEditor,
    defaultFormat: ContentModelSegmentFormat,
    markerFormat: ContentModelSegmentFormat
): ContentModelSegmentFormat {
    return {
        ...defaultFormat,
        ...editor.getPendingFormat(),
        ...markerFormat,
    };
}
