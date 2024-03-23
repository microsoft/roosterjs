import type {
    ContentModelSegmentFormat,
    ContentModelSelectionMarker,
} from 'roosterjs-content-model-types';

/**
 * Create a ContentModelSelectionMarker model
 * @param format @optional The format of this model
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
