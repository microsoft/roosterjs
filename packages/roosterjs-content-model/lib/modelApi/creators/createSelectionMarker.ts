import { ContentModelSelectionMarker } from '../../publicTypes/segment/ContentModelSelectionMarker';

/**
 * @internal
 */
export function createSelectionMarker(): ContentModelSelectionMarker {
    return {
        segmentType: 'SelectionMarker',
        isSelected: true,
    };
}
