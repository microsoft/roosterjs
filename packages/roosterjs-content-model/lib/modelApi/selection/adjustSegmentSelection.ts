import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { ContentModelSegment } from '../../publicTypes/segment/ContentModelSegment';
import { getSelectedParagraphs } from './collectSelections';
import { setSelection } from './setSelection';

/**
 * @internal
 */
export function adjustSegmentSelection(
    model: ContentModelDocument,
    firstMatcher: (target: ContentModelSegment) => boolean,
    siblingMatcher: (target: ContentModelSegment, ref: ContentModelSegment) => boolean
): boolean {
    const paragraphs = getSelectedParagraphs(model);
    let first: ContentModelSegment | undefined;
    let last: ContentModelSegment | undefined;
    let changed = false;

    paragraphs.forEach(p => {
        const index = first ? 0 : p.segments.findIndex(x => firstMatcher(x));
        const segments = p.segments;

        if (!first) {
            first = segments[index];

            for (let i = index; i > 0; i--) {
                if (siblingMatcher(segments[i - 1], first)) {
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
                if (i == index || siblingMatcher(segments[i], last || segments[index])) {
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
