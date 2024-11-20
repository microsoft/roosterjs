/**
 * Represents added and removed block elements during content model to dom conversion
 */
export interface RewriteFromModel {
    /**
     * Added block elements
     */
    addedBlockElements: HTMLElement[];

    /**
     * Removed block elements
     */
    removedBlockElements: HTMLElement[];
}

/**
 * Context object used by contentModelToDom to record added and removed block elements
 */
export interface RewriteFromModelContext {
    /**
     * DOM modification object
     */
    rewriteFromModel: RewriteFromModel;
}
