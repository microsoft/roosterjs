/**
 *  Enum used to control the different types of numbering list
 */
export const enum NumberingListType {
    /**
     * Minimum value of the enum
     */
    Min = 0,

    /**
     * Numbering triggered by 1.
     */
    Decimal = 0,

    /**
     * Numbering triggered by 1-
     */
    DecimalDash = 1,

    /**
     * Numbering triggered by 1)
     */
    DecimalParenthesis = 2,

    /**
     * Numbering triggered by (1)
     */
    DecimalDoubleParenthesis = 3,

    /**
     * Numbering triggered by a.
     */
    LowerAlpha = 4,

    /**
     * Numbering triggered by a)
     */
    LowerAlphaParenthesis = 5,

    /**
     * Numbering triggered by (a)
     */
    LowerAlphaDoubleParenthesis = 6,

    /**
     * Numbering triggered by a-
     */
    LowerAlphaDash = 7,

    /**
     * Numbering triggered by A.
     */
    UpperAlpha = 8,

    /**
     * Numbering triggered by A)
     */
    UpperAlphaParenthesis = 9,

    /**
     * Numbering triggered by (A)
     */
    UpperAlphaDoubleParenthesis = 10,

    /**
     * Numbering triggered by A-
     */
    UpperAlphaDash = 11,

    /**
     * Numbering triggered by i.
     */
    LowerRoman = 12,

    /**
     * Numbering triggered by i)
     */
    LowerRomanParenthesis = 13,

    /**
     * Numbering triggered by (i)
     */
    LowerRomanDoubleParenthesis = 14,

    /**
     * Numbering triggered by i-
     */
    LowerRomanDash = 15,

    /**
     * Numbering triggered by I.
     */
    UpperRoman = 16,

    /**
     * Numbering triggered by I)
     */
    UpperRomanParenthesis = 17,

    /**
     * Numbering triggered by (I)
     */
    UpperRomanDoubleParenthesis = 18,

    /**
     * Numbering triggered by I-
     */
    UpperRomanDash = 19,

    /**
     * Maximum value of the enum
     */
    Max = 19,
}
