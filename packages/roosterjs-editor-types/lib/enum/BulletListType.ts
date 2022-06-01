/**
 *  Enum used to control the different types of bullet list
 */

export const enum BulletListType {
    /**
     * Minimum value of the enum
     */
    Min = 0,
    /**
     * Bullet triggered by *
     */
    Disc = 0,

    /**
     * Bullet triggered by -
     */
    Dash = 1,

    /**
     * Bullet triggered by --
     */
    Square = 2,

    /**
     * Bullet triggered by >
     */
    ShortArrow = 3,

    /**
     * Bullet triggered by -> or -->
     */
    LongArrow = 4,

    /**
     * Bullet triggered by =>
     */
    UnfilledArrow = 5,

    /**
     * Maximum value of the enum
     */
    Max = 5,
}
