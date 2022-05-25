/**
 *  Enum used to control the different types of bullet list
 */

export const enum BulletListType {
    /**
     * Bullet triggered by *
     */
    Disc,

    /**
     * Bullet triggered by -
     */
    Dash,

    /**
     * Bullet triggered by --
     */
    Square,

    /**
     * Bullet triggered by >
     */
    ShortArrow,

    /**
     * Bullet triggered by -> or -->
     */
    LongArrow,

    /**
     * Bullet triggered by =>
     */
    UnfilledArrow,
}
