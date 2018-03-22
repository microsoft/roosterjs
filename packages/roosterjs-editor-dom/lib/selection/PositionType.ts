/**
 * Represent the type of a position
 */
const enum PositionType {
    /**
     * Before a node
     */
    Before = 'b',

    /**
     * At the begninning of a node
     */
    Begin = 0,

    /**
     * At the endo of a node
     */
    End = 'e',

    /**
     * After a node
     */
    After = 'a',
}

export default PositionType;
