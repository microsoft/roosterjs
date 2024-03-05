import getLinkSegment from './getLinkSegment';
import { addLink } from 'roosterjs-content-model-dom';
import { getSelectedSegmentsAndParagraphs } from 'roosterjs-content-model-core';
import type { IEditor } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function createLink(editor: IEditor) {
    editor.formatContentModel(model => {
        const selectedSegmentsAndParagraphs = getSelectedSegmentsAndParagraphs(
            model,
            false /* includingFormatHolder */
        );
        const link = getLinkSegment(model);
        if (
            link &&
            !link.link &&
            selectedSegmentsAndParagraphs[0] &&
            selectedSegmentsAndParagraphs[0][1]
        ) {
            addLink(link, {
                format: {
                    href: link.text,
                    underline: true,
                },
                dataset: {},
            });
            const selectedParagraph = selectedSegmentsAndParagraphs[0][1];
            selectedParagraph.segments.splice(selectedParagraph.segments.length - 2, 1, link);
            return true;
        }

        return false;
    });
}
