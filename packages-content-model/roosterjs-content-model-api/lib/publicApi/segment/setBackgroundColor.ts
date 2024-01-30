import { createSelectionMarker } from 'roosterjs-content-model-dom';
import { formatSegment } from '../utils/formatSegment';
import { setSelection } from 'roosterjs-content-model-core';
import type { ContentModelParagraph, IStandaloneEditor } from 'roosterjs-content-model-types';

/**
 * Set background color
 * @param editor The editor to operate on
 * @param backgroundColor The color to set. Pass null to remove existing color.
 */
export default function setBackgroundColor(
    editor: IStandaloneEditor,
    backgroundColor: string | null
) {
    editor.focus();

    let lastParagraph: ContentModelParagraph | null = null;
    let lastSegmentIndex: number = -1;

    formatSegment(
        editor,
        'setBackgroundColor',
        (format, _, segment, paragraph) => {
            if (backgroundColor === null) {
                delete format.backgroundColor;
            } else {
                format.backgroundColor = backgroundColor;
            }

            if (segment && paragraph && segment.segmentType != 'SelectionMarker') {
                lastParagraph = paragraph;
                lastSegmentIndex = lastParagraph.segments.indexOf(segment);
            }
        },
        undefined /*segmentHasStyleCallback*/,
        undefined /*includingFormatHolder*/,
        model => {
            if (lastParagraph && lastSegmentIndex >= 0) {
                const marker = createSelectionMarker(
                    lastParagraph.segments[lastSegmentIndex]?.format
                );

                lastParagraph.segments.splice(lastSegmentIndex + 1, 0, marker);
                setSelection(model, marker, marker);
            }
        }
    );
}
