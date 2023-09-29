import announceNewListItemNumber from './announceNewListItem';
import announceWarningOnLastCell from './announceWarningOnLastTableCell';
import type { AnnounceFeature } from '../AnnounceFeature';

export function getAllAnnounceFeatures(): AnnounceFeature[] {
    return [announceNewListItemNumber, announceWarningOnLastCell];
}
