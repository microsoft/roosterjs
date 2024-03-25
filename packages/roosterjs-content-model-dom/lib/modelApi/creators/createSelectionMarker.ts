import type {
    ContentModelSegmentFormat,
    ContentModelSelectionMarker,
} from 'roosterjs-content-model-types';

/**
 * Create a ContentModelSelectionMarker model
 * @param format @optional The format of this model
 * @param isShadowMarker @optional Whether mark this selection marker as a shadow marker.
 * A shadow selection marker can be used for marking a position inside content model for further operation.
 */
export function createSelectionMarker(
    format?: ContentModelSegmentFormat,
    isShadowMarker?: boolean
): ContentModelSelectionMarker {
    const result: ContentModelSelectionMarker = {
        segmentType: 'SelectionMarker',
        isSelected: true,
        format: format ? { ...format } : {},
    };

    if (isShadowMarker) {
        result.isShadowMarker = true;
    }

    return result;
}
