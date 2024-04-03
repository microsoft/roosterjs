import { getSelectedSegmentsAndParagraphs } from 'roosterjs-content-model-dom';
import { splitTextSegment } from '../../pluginUtils/splitTextSegment';
import type { IEditor } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function transformHyphen(editor: IEditor) {
    editor.formatContentModel((model, context) => {
        const selectedAndParagraphs = getSelectedSegmentsAndParagraphs(
            model,
            false /*includingFormatHolder*/
        );
        if (selectedAndParagraphs.length > 0 && selectedAndParagraphs[0][1]) {
            const marker = selectedAndParagraphs[0][0];
            if (marker.segmentType == 'SelectionMarker') {
                const paragraph = selectedAndParagraphs[0][1];
                const markerIndex = paragraph.segments.indexOf(marker);
                if (markerIndex > 0) {
                    const previousSegment = paragraph.segments[markerIndex - 1];
                    if (
                        previousSegment.segmentType === 'Text' &&
                        previousSegment.text.indexOf('--') > -1
                    ) {
                        const segments = previousSegment.text.split(' ');
                        const dashes = segments[segments.length - 2];
                        if (dashes === '--') {
                            const textIndex = previousSegment.text.lastIndexOf('--');
                            const textSegment = splitTextSegment(
                                previousSegment,
                                paragraph,
                                textIndex,
                                textIndex + 2
                            );

                            textSegment.text = textSegment.text.replace('--', '—');
                            context.canUndoByBackspace = true;
                            return true;
                        } else {
                            const text = segments.pop();
                            const hasDashes = text && text?.indexOf('--') > -1;
                            if (hasDashes && text.trim() !== '--') {
                                const textIndex = previousSegment.text.indexOf(text);
                                const textSegment = splitTextSegment(
                                    previousSegment,
                                    paragraph,
                                    textIndex,
                                    textIndex + text.length - 1
                                );

                                const textLength = textSegment.text.length;
                                if (
                                    textSegment.text[0] !== '-' &&
                                    textSegment.text[textLength - 1] !== '-'
                                ) {
                                    textSegment.text = textSegment.text.replace('--', '—');
                                    context.canUndoByBackspace = true;
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
        }

        return false;
    });
}
