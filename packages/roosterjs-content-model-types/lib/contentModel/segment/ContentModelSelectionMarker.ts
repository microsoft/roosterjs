import type {
    ContentModelSegmentBase,
    ReadonlyContentModelSegmentBase,
} from './ContentModelSegmentBase';

export interface SelectionMarkerCommon {
    /**
     * The owner of this selection marker. It can be a block or segment
     */
    owner?: string;
}

/**
 * Content Model of Selection Marker
 */
export interface ContentModelSelectionMarker
    extends SelectionMarkerCommon,
        ContentModelSegmentBase<'SelectionMarker'> {}

/**
 * Content Model of Selection Marker (Readonly)
 */
export interface ReadonlyContentModelSelectionMarker
    extends ReadonlyContentModelSegmentBase<'SelectionMarker'>,
        Readonly<SelectionMarkerCommon> {}
