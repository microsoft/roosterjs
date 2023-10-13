import type {
    ContentModelSegmentFormat,
    ContentModelSelectionMarker,
} from 'roosterjs-content-model-types';

/**
 * Create a ContentModelSelectionMarker model
 * @param format @optional The format of this model
 */
export function createSelectionMarker(
    format?: ContentModelSegmentFormat
): ContentModelSelectionMarker {
    return {
        segmentType: 'SelectionMarker',
        isSelected: true,
        format: format ? { ...format } : {},
    };
}
