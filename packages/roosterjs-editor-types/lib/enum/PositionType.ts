/**
 * Represent the type of a position
 */
export const enum PositionType {
    /**
     * At the begninning of a node
     */
    Begin = 0,

    /**
     * At the endo of a node
     */
    End = -1,

    /**
     * Before a node
     */
    Before = -2,

    /**
     * After a node
     */
    After = -3,
}
