import { internalConvertToMutableType } from './internalConvertToMutableType';
import type {
    ContentModelSelectionMarker,
    ReadonlyContentModelSegmentFormat,
    ReadonlyContentModelSelectionMarker,
} from 'roosterjs-content-model-types';

/**
 * Create a ContentModelSelectionMarker model
 * @param format @optional The format of this model
 * @param isShadowMarker @optional By default a selection marker should be selected.
 * But it is also supported to have a "shadow" marker which as isSelected=false, this can be use for
 * marking a place inside a content model without changing selection.
 * This is used by API formatInsertPointWithContentModel
 */
export function createSelectionMarker(
    format?: ReadonlyContentModelSegmentFormat,
    isShadowMarker?: boolean
): ContentModelSelectionMarker {
    const result: ReadonlyContentModelSelectionMarker = {
        segmentType: 'SelectionMarker',
        isSelected: !isShadowMarker,
        format: { ...format },
    };

    return internalConvertToMutableType(result);
}
