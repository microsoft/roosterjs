/**
 * The is essentially an enum representing result from browser compareDocumentPosition API
 * https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition
 */
export const enum DocumentPosition {
    /**
     * Same node
     */
    Same = 0,

    /**
     * Node is disconnected from document
     */
    Disconnected = 1,

    /**
     * Node is preceding the comparing node
     */
    Preceding = 2,

    /**
     * Node is following the comparing node
     */
    Following = 4,

    /**
     * Node contains the comparing node
     */
    Contains = 8,

    /**
     * Node is contained by the comparing node
     */
    ContainedBy = 16,
}
