import {
    createText,
    getObjectKeys,
    iterateSelections,
    mutateBlock,
    mutateSegment,
    normalizeContentModel,
    setParagraphNotImplicit,
} from 'roosterjs-content-model-dom';
import type {
    ContentModelBlockFormat,
    ContentModelFormatBase,
    ContentModelSegmentFormat,
    IEditor,
} from 'roosterjs-content-model-types';

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
    segmentFormat?: ContentModelSegmentFormat,
    paragraphFormat?: ContentModelBlockFormat
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
                            if (
                                segmentFormat &&
                                !includeSegmentFormat(previousSegment.format, segmentFormat)
                            ) {
                                mutateSegment(block, previousSegment, previousSegment => {
                                    previousSegment.text = text.substring(
                                        0,
                                        text.length - data.length
                                    );
                                });

                                mutateSegment(block, marker, (marker, block) => {
                                    marker.format = { ...segmentFormat };

                                    const newText = createText(
                                        data == ANSI_SPACE ? NON_BREAK_SPACE : data,
                                        {
                                            ...previousSegment.format,
                                            ...segmentFormat,
                                        }
                                    );

                                    block.segments.splice(index, 0, newText);
                                    setParagraphNotImplicit(block);
                                });

                                isChanged = true;
                            }

                            if (
                                paragraphFormat &&
                                !includeSegmentFormat(block.format, paragraphFormat)
                            ) {
                                const mutableParagraph = mutateBlock(block);

                                Object.assign(mutableParagraph.format, paragraphFormat);
                                isChanged = true;
                            }
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

function includeSegmentFormat<T extends ContentModelFormatBase>(containerFormat: T, subFormat: T) {
    const keys = getObjectKeys(subFormat);
    let result = true;

    keys.forEach(key => {
        if (containerFormat[key] !== subFormat[key]) {
            result = false;
        }
    });

    return result;
}
