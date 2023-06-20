import {
    ContentModelSegmentFormat,
    ContentModelSelectionMarker,
} from 'roosterjs-content-model-types';

/**
 * @internal
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
