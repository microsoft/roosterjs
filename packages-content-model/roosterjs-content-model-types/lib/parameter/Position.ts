/**
 * Represent a position in DOM tree by the container and its offset index
 */
export interface Position {
    /**
     * Represents the container of the Position withing the DOM tree
     */
    container: Node;
    /**
     * Represents the offset of the selection within the container
     */
    offset: number;
}
