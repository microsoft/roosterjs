import type {
    ContentModelSegmentBase,
    ReadonlyContentModelSegmentBase,
} from './ContentModelSegmentBase';

/**
 * Common part of Content Model of IMG
 */
export interface ContentModelSelectionMarkerCommon {
    /**
     * Hint text shown next to the selection marker
     */
    hintText?: string;
}

/**
 * Content Model of Selection Marker
 */
export interface ContentModelSelectionMarker
    extends ContentModelSelectionMarkerCommon,
        ContentModelSegmentBase<'SelectionMarker'> {}

/**
 * Content Model of Selection Marker (Readonly)
 */
export interface ReadonlyContentModelSelectionMarker
    extends Readonly<ContentModelSelectionMarkerCommon>,
        ReadonlyContentModelSegmentBase<'SelectionMarker'> {}
