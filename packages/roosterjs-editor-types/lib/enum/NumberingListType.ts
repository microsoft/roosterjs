/**
 *  Enum used to control the different types of numbering list
 */
export const enum NumberingListType {
    /**
     * Numbering triggered by 1.
     */
    Decimal,

    /**
     * Numbering triggered by 1-
     */
    DecimalDash,

    /**
     * Numbering triggered by 1)
     */
    DecimalParenthesis,

    /**
     * Numbering triggered by (1)
     */
    DecimalDoubleParenthesis,

    /**
     * Numbering triggered by a.
     */
    LowerAlpha,

    /**
     * Numbering triggered by a)
     */
    LowerAlphaParenthesis,

    /**
     * Numbering triggered by (a)
     */
    LowerAlphaDoubleParenthesis,

    /**
     * Numbering triggered by a-
     */
    LowerAlphaDash,

    /**
     * Numbering triggered by A.
     */
    UpperAlpha,

    /**
     * Numbering triggered by A)
     */
    UpperAlphaParenthesis,

    /**
     * Numbering triggered by (A)
     */
    UpperAlphaDoubleParenthesis,

    /**
     * Numbering triggered by A-
     */
    UpperAlphaDash,

    /**
     * Numbering triggered by i.
     */
    LowerRoman,

    /**
     * Numbering triggered by i)
     */
    LowerRomanParenthesis,

    /**
     * Numbering triggered by (i)
     */
    LowerRomanDoubleParenthesis,

    /**
     * Numbering triggered by i-
     */
    LowerRomanDash,

    /**
     * Numbering triggered by I.
     */
    UpperRoman,

    /**
     * Numbering triggered by I)
     */
    UpperRomanParenthesis,

    /**
     * Numbering triggered by (I)
     */
    UpperRomanDoubleParenthesis,

    /**
     * Numbering triggered by I-
     */
    UpperRomanDash,

    /**
     * Minimum value of the enum
     */
    Min = 0,

    /**
     * Maximum value of the enum
     */
    Max = 19,
}
