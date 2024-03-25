import { announceNewListItemNumber } from './announceNewListItem';
import { announceWarningOnLastCell } from './announceWarningOnLastTableCell';
import type { AnnounceFeature } from '../AnnounceFeature';

/**
 * Announce feature keys
 */
export type AnnounceFeatureKey = 'announceNewListItem' | 'announceWarningOnLastTableCell';
/**
 * @internal
 */
export const AnnounceFeatures: Record<AnnounceFeatureKey, AnnounceFeature> = {
    announceNewListItem: announceNewListItemNumber,
    announceWarningOnLastTableCell: announceWarningOnLastCell,
};
