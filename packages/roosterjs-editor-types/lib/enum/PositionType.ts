/**
 * Represent the type of a position
 */
// eslint-disable-next-line etc/no-const-enum
export const enum PositionType {
    /**
     * At the beginning of a node
     */
    Begin = 0,

    /**
     * At the end of a node
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
