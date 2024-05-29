import type {
    ContentModelSegmentBase,
    ReadonlyContentModelSegmentBase,
} from './ContentModelSegmentBase';

/**
 * Content Model of Selection Marker
 */
export interface ContentModelSelectionMarker extends ContentModelSegmentBase<'SelectionMarker'> {}

/**
 * Content Model of Selection Marker (Readonly)
 */
export interface ReadonlyContentModelSelectionMarker
    extends ReadonlyContentModelSegmentBase<'SelectionMarker'> {}
