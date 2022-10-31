import { ContentModelLinkFormat } from '../../publicTypes/format/ContentModelLinkFormat';
import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';
import { ContentModelSelectionMarker } from '../../publicTypes/segment/ContentModelSelectionMarker';

/**
 * @internal
 */
export function createSelectionMarker(
    format?: ContentModelSegmentFormat,
    link?: ContentModelLinkFormat
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
