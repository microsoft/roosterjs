import type { ReadonlyContentModel } from '../common/Mutable';
import type { ContentModelSegmentBase } from './ContentModelSegmentBase';

/**
 * Content Model of Selection Marker
 */
export interface ContentModelSelectionMarker extends ContentModelSegmentBase<'SelectionMarker'> {}

/**
 * Content Model of Selection Marker (Readonly)
 */
export type ReadonlyContentModelSelectionMarker = ReadonlyContentModel<ContentModelSelectionMarker>;
