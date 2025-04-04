/**
 * Format of undeletable segments
 */
export type UndeletableFormat = {
    /**
     * When set to true, this link is not allowed to be deleted by deleteSelection API.
     * This is used to protect links that are not allowed to be deleted by user action.
     */
    undeletable?: boolean;
};
