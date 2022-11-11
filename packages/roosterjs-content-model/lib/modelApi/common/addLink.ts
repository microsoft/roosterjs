import { ContentModelLink } from '../../publicTypes/decorator/ContentModelLink';
import { ContentModelSegment } from '../../publicTypes/segment/ContentModelSegment';

/**
 * @internal
 */
export function addLink(segment: ContentModelSegment, link: ContentModelLink) {
    if (link.format.href) {
        segment.link = {
            format: { ...link.format },
            dataset: { ...link.dataset },
        };
    }
}
