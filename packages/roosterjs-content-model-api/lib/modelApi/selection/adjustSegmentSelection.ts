import { getSelectedParagraphs, setSelection } from 'roosterjs-content-model-dom';
import type {
    ReadonlyContentModelDocument,
    ReadonlyContentModelParagraph,
    ReadonlyContentModelSegment,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function adjustSegmentSelection(
    model: ReadonlyContentModelDocument,
    firstMatcher: (
        target: ReadonlyContentModelSegment,
        paragraph: ReadonlyContentModelParagraph
    ) => boolean,
    siblingMatcher: (
        target: ReadonlyContentModelSegment,
        ref: ReadonlyContentModelSegment,
        paragraph: ReadonlyContentModelParagraph
    ) => boolean
): boolean {
    const paragraphs = getSelectedParagraphs(model);
    let first: ReadonlyContentModelSegment | undefined;
    let last: ReadonlyContentModelSegment | undefined;
    let changed = false;

    paragraphs.forEach(p => {
        const index = first ? 0 : p.segments.findIndex(x => firstMatcher(x, p));
        const segments = p.segments;

        if (!first) {
            first = segments[index];

            for (let i = index; i > 0; i--) {
                if (siblingMatcher(segments[i - 1], first, p)) {
                    first = segments[i - 1];
                    changed = changed || !segments[i - 1].isSelected;
                } else {
                    changed = changed || !!segments[i - 1].isSelected;
                    break;
                }
            }
        }

        if (first) {
            for (let i = index; i < p.segments.length; i++) {
                if (i == index || siblingMatcher(segments[i], last || segments[index], p)) {
                    last = segments[i];
                    changed = changed || !segments[i].isSelected;
                } else {
                    changed = changed || !!segments[i].isSelected;
                    break;
                }
            }
        }
    });

    if (first && last) {
        setSelection(model, first, last);
    }

    return changed;
}
