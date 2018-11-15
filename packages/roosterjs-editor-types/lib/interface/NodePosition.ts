/**
 * Represent a position in DOM tree by the node and its offset index
 */
export default interface NodePosition {
    readonly node: Node;
    readonly element: HTMLElement;
    readonly offset: number;
    readonly isAtEnd: boolean;

    /**
     * Normalize this position to the leaf node, return the normalize result.
     * If current position is already using leaf node, return this position object itself
     */
    normalize(): NodePosition;

    /**
     * Check if this position is equal to the given position
     * @param position The position to check
     */
    equalTo(position: NodePosition): boolean;

    /**
     * Checks if this position is after the given position
     * @param position The position to check
     */
    isAfter(position: NodePosition): boolean;

    /**
     * Move this position with offset, returns a new position with a valid offset in the same node
     * @param offset Offset to move with
     */
    move(offset: number): NodePosition;
}
