/**
 * Represents added and removed block elements during content model to dom conversion
 */
export interface DomModification {
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
export interface DomModificationContext {
    /**
     * DOM modification object
     */
    domModification: DomModification;
}
