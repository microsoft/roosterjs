import getLinkSegment from './getLinkSegment';
import { getSelectedSegmentsAndParagraphs } from 'roosterjs-content-model-core';
import type { IEditor } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function unlink(editor: IEditor, rawEvent: KeyboardEvent) {
    editor.formatContentModel(model => {
        const selectedSegmentsAndParagraphs = getSelectedSegmentsAndParagraphs(
            model,
            false /* includingFormatHolder */
        );
        const link = getLinkSegment(model);
        if (link?.link && selectedSegmentsAndParagraphs[0] && selectedSegmentsAndParagraphs[0][1]) {
            link.link = undefined;
            const selectedParagraph = selectedSegmentsAndParagraphs[0][1];
            selectedParagraph.segments.splice(selectedParagraph.segments.length - 2, 1, link);
            rawEvent.preventDefault();
            return true;
        }

        return false;
    });
}
