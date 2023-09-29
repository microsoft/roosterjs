import announceNewListItemNumber from './announceNewListItem';
import announceWarningOnLastCell from './announceWarningOnLastTableCell';
import { AnnounceFeature } from '../AnnounceFeature';

export function getAllAnnounceFeatures(): AnnounceFeature[] {
    return [announceNewListItemNumber, announceWarningOnLastCell];
}
