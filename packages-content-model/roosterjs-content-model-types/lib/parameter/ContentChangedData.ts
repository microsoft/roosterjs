import { AnnounceData } from './AnnounceData';
import { EntityState } from './EntityState';

/**
 * Property that is going to store additional data related to the Content Changed Event
 */
export interface ContentChangedData {
    /**
     * Optional property to store the format api name when using ChangeSource.Format
     */
    formatApiName?: string;

    /**
     * @optional Get entity states related to the snapshot. If it returns entity states, each state will cause
     * an EntityOperation event with operation = EntityOperation.UpdateEntityState when undo/redo to this snapshot
     * @returns Related entity state array
     */
    getEntityState?: () => EntityState[];

    /**
     * @optional
     * Get Announce data from this content changed event.
     * @returns
     */
    getAnnounceData?: () => AnnounceData | undefined;

    /**
     * @optional related data
     */
    additionalData?: any;
}
