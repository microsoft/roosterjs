import { getSelectedSegmentsAndParagraphs, mutateSegment } from 'roosterjs-content-model-dom';
import type { IEditor } from 'roosterjs-content-model-types';

/**
 * Add hint text to current selection
 * @param editor The editor to add hint text to
 * @param text The hint text to add
 */
export function addHintText(editor: IEditor, text: string) {
    editor.formatContentModel(model => {
        let isChanged = false;

        const selections = getSelectedSegmentsAndParagraphs(
            model,
            false /*includingFormatHolder*/,
            false /*includingEntity*/
        );

        selections.forEach(([segment, paragraph]) => {
            if (paragraph && segment.segmentType == 'SelectionMarker') {
                mutateSegment(paragraph, segment, mutableSegment => {
                    mutableSegment.hintText = text;
                    isChanged = true;
                });
            }
        });

        return isChanged;
    });
}
