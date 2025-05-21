import {
    createText,
    getSelectedSegmentsAndParagraphs,
    mutateSegment,
} from 'roosterjs-content-model-dom';
import type { IEditor } from 'roosterjs-content-model-types';

/**
 * Clear hint text if any in current selection
 * @param editor The editor to clear hint text from
 * @param apply True to apply the hint text into editor, to be a normal text, otherwise just remove the hint text
 */
export function clearHintText(editor: IEditor, apply?: boolean) {
    editor.formatContentModel(model => {
        let isChanged = false;

        const selections = getSelectedSegmentsAndParagraphs(
            model,
            false /*includingFormatHolder*/,
            false /*includingEntity*/
        );

        selections.forEach(([segment, paragraph]) => {
            if (paragraph && segment.segmentType == 'SelectionMarker' && segment.hintText) {
                const text = createText(
                    segment.hintText,
                    segment.format,
                    segment.link,
                    segment.code
                );

                mutateSegment(paragraph, segment, (mutableSegment, mutablePara, index) => {
                    delete mutableSegment.hintText;
                    isChanged = true;

                    if (apply) {
                        mutablePara.segments.splice(index, 0, text);
                    }
                });
            }
        });

        return isChanged;
    });
}
