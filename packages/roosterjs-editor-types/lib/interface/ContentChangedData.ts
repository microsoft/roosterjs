import { EntityState } from './Snapshot';

/**
 * Property that is going to store additional data related to the Content Changed Event
 */
export default interface ContentChangedData {
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
}
