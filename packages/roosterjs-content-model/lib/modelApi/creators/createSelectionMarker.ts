import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';
import { ContentModelSelectionMarker } from '../../publicTypes/segment/ContentModelSelectionMarker';
import { LinkFormat } from '../../publicTypes/format/formatParts/LinkFormat';

/**
 * @internal
 */
export function createSelectionMarker(
    format?: ContentModelSegmentFormat,
    link?: LinkFormat
): ContentModelSelectionMarker {
    const result: ContentModelSelectionMarker = {
        segmentType: 'SelectionMarker',
        isSelected: true,
        format: format ? { ...format } : {},
    };

    if (link?.href) {
        result.link = { ...link };
    }

    return result;
}
