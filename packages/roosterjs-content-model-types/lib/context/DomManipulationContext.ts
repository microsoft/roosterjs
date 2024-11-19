/**
 * Context object used by contentModelToDom to record added and removed block elements
 */
export interface DomManipulationContext {
    /**
     * Added block elements
     */
    addedBlockElements: HTMLElement[];

    /**
     * Removed block elements
     */
    removedBlockElements: HTMLElement[];
}
