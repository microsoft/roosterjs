import { iterateSelections } from '../../publicApi/selection/iterateSelections';
import type { ContentModelSegmentFormat, IEditor } from 'roosterjs-content-model-types';
import {
    createText,
    normalizeContentModel,
    setParagraphNotImplicit,
} from 'roosterjs-content-model-dom';

const ANSI_SPACE = '\u0020';
const NON_BREAK_SPACE = '\u00A0';

/**
 * @internal
 * Apply pending format to the text user just input
 * @param editor The editor to get format from
 * @param data The text user just input
 */
export function applyPendingFormat(
    editor: IEditor,
    data: string,
    format: ContentModelSegmentFormat
) {
    let isChanged = false;

    editor.formatContentModel(
        (model, context) => {
            iterateSelections(model, (_, __, block, segments) => {
                if (
                    block?.blockType == 'Paragraph' &&
                    segments?.length == 1 &&
                    segments[0].segmentType == 'SelectionMarker'
                ) {
                    const marker = segments[0];
                    const index = block.segments.indexOf(marker);
                    const previousSegment = block.segments[index - 1];

                    if (previousSegment?.segmentType == 'Text') {
                        const text = previousSegment.text;
                        const subStr = text.substr(-data.length, data.length);

                        // For space, there can be &#32 (space) or &#160 (&nbsp;), we treat them as the same
                        if (subStr == data || (data == ANSI_SPACE && subStr == NON_BREAK_SPACE)) {
                            marker.format = { ...format };
                            previousSegment.text = text.substring(0, text.length - data.length);

                            const newText = createText(
                                data == ANSI_SPACE ? NON_BREAK_SPACE : data,
                                {
                                    ...previousSegment.format,
                                    ...format,
                                }
                            );

                            block.segments.splice(index, 0, newText);
                            setParagraphNotImplicit(block);
                            isChanged = true;
                        }
                    }
                }
                return true;
            });

            if (isChanged) {
                normalizeContentModel(model);
                context.skipUndoSnapshot = true;
            }

            return isChanged;
        },
        {
            apiName: 'applyPendingFormat',
        }
    );
}
