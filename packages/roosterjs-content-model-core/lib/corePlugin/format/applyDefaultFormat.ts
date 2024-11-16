import { iterateSelections } from 'roosterjs-content-model-dom';
import type { ContentModelSegmentFormat, IEditor } from 'roosterjs-content-model-types';

/**
 * @internal
 * When necessary, set default format as current pending format so it will be applied when Input event is fired
 * @param editor The editor object
 * @param defaultFormat The default segment format to apply
 */
export function applyDefaultFormat(editor: IEditor, defaultFormat: ContentModelSegmentFormat) {
    const selection = editor.getDOMSelection();

    if (!selection) {
        // NO OP, should never happen
    } else if (selection?.type == 'range' && selection.range.collapsed) {
        editor.formatContentModel((model, context) => {
            iterateSelections(model, (path, _, paragraph, segments) => {
                const marker = segments?.[0];
                if (
                    paragraph?.blockType == 'Paragraph' &&
                    marker?.segmentType == 'SelectionMarker'
                ) {
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

                // Stop searching more selection
                return true;
            });

            // We didn't do any change but just apply default format to pending format, so no need to write back
            return false;
        });
    } else {
        editor.takeSnapshot();
    }
}

function getNewPendingFormat(
    editor: IEditor,
    defaultFormat: ContentModelSegmentFormat,
    markerFormat: ContentModelSegmentFormat
): ContentModelSegmentFormat {
    return {
        ...defaultFormat,
        ...editor.getPendingFormat(),
        ...markerFormat,
    };
}
