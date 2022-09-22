/**
 *  Enum used to control the different types of bullet list
 */
export const enum BulletListType {
    /**
     * Minimum value of the enum
     */
    Min = 1,

    /**
     * Bullet triggered by *
     */
    Disc = 1,

    /**
     * Bullet triggered by -
     */
    Dash = 2,

    /**
     * Bullet triggered by --
     */
    Square = 3,

    /**
     * Bullet triggered by >
     */
    ShortArrow = 4,

    /**
     * Bullet triggered by ->
     */
    LongArrow = 5,

    /**
     * Bullet triggered by =>
     */
    UnfilledArrow = 6,

    /**
     * Bullet triggered by —
     */
    Hyphen = 7,

    /**
     * Bullet triggered by -->
     */
    DoubleLongArrow = 8,

    /**
     * Bullet type circle
     */
    Circle = 9,

    /**
     * Maximum value of the enum
     */
    Max = 9,
}
