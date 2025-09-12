import type { IEditor, ShallowMutableContentModelSegment } from 'roosterjs-content-model-types';
import { getSelectedSegmentsAndParagraphs } from 'roosterjs-content-model-dom';
import { adjustWordSelection } from 'roosterjs-content-model-api';

const MAX_TOUCH_MOVE_DISTANCE = 6; // the max number of offsets for the touch selection to move

/**
 * @internal
 * Touch selection, if tap within 6 characters of the beginning/end. Find the nearest edge of the word and move cursor there.
 */
export function repositionTouchSelection(editor: IEditor) {
    editor.formatContentModel(
        (model, _context) => {
            let segmentAndParagraphs = getSelectedSegmentsAndParagraphs(
                model,
                false /*includingFormatHolder*/,
                true /*includingEntity*/,
                true /*mutate*/
            );

            const isCollapsedSelection =
                segmentAndParagraphs.length >= 1 &&
                segmentAndParagraphs.every(x => x[0].segmentType == 'SelectionMarker');

            // 1. adjust selection to a word if selection is collapsed
            if (isCollapsedSelection) {
                const para = segmentAndParagraphs[0][1];
                const path = segmentAndParagraphs[0][2];

                segmentAndParagraphs = adjustWordSelection(
                    model,
                    segmentAndParagraphs[0][0]
                ).map(x => [x, para, path]);

                // 2. Collect all text segments in selection
                const segments: ShallowMutableContentModelSegment[] | null = [];
                segmentAndParagraphs.forEach(item => {
                    if (item[0].segmentType == 'Text') {
                        segments.push(item[0]);
                    }
                });

                // If there are 3 text segment in the Word, selection is in middle of the word
                // before selection marker + after selection marker
                if (segments.length === 2) {
                    // 3. Calculate the offset to move cursor to the nearest edge of the word if within 6 characters
                    const leftCursorWordLength =
                        segments[0].segmentType === 'Text' ? segments[0].text.length : 0;
                    const rightCursorWordLength =
                        segments[1].segmentType === 'Text' ? segments[1].text.length : 0;
                    let movingOffset: number =
                        leftCursorWordLength > rightCursorWordLength
                            ? rightCursorWordLength
                            : -leftCursorWordLength;
                    movingOffset =
                        Math.abs(movingOffset) > MAX_TOUCH_MOVE_DISTANCE ? 0 : movingOffset;

                    // 4. Move cursor to the calculated offset
                    const selection = editor.getDOMSelection();
                    if (selection?.type == 'range' && movingOffset !== 0) {
                        const selectedRange = selection.range;
                        const newRange = editor.getDocument().createRange();
                        newRange.setStart(
                            selectedRange.startContainer,
                            selectedRange.startOffset + movingOffset
                        );
                        newRange.setEnd(
                            selectedRange.endContainer,
                            selectedRange.endOffset + movingOffset
                        );
                        editor.setDOMSelection({
                            type: 'range',
                            range: newRange,
                            isReverted: false,
                        });
                    }
                }
            }
            return false;
        },
        {
            apiName: 'TouchSelection',
        }
    );
}
