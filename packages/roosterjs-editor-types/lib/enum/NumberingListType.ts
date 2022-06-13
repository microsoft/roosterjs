/**
 *  Enum used to control the different types of numbering list
 */
export const enum NumberingListType {
    /**
     * Minimum value of the enum
     */
    Min = 1,

    /**
     * Numbering triggered by 1.
     */
    Decimal = 1,

    /**
     * Numbering triggered by 1-
     */
    DecimalDash = 2,

    /**
     * Numbering triggered by 1)
     */
    DecimalParenthesis = 3,

    /**
     * Numbering triggered by (1)
     */
    DecimalDoubleParenthesis = 4,

    /**
     * Numbering triggered by a.
     */
    LowerAlpha = 5,

    /**
     * Numbering triggered by a)
     */
    LowerAlphaParenthesis = 6,

    /**
     * Numbering triggered by (a)
     */
    LowerAlphaDoubleParenthesis = 7,

    /**
     * Numbering triggered by a-
     */
    LowerAlphaDash = 8,

    /**
     * Numbering triggered by A.
     */
    UpperAlpha = 9,

    /**
     * Numbering triggered by A)
     */
    UpperAlphaParenthesis = 10,

    /**
     * Numbering triggered by (A)
     */
    UpperAlphaDoubleParenthesis = 11,

    /**
     * Numbering triggered by A-
     */
    UpperAlphaDash = 12,

    /**
     * Numbering triggered by i.
     */
    LowerRoman = 13,

    /**
     * Numbering triggered by i)
     */
    LowerRomanParenthesis = 14,

    /**
     * Numbering triggered by (i)
     */
    LowerRomanDoubleParenthesis = 15,

    /**
     * Numbering triggered by i-
     */
    LowerRomanDash = 16,

    /**
     * Numbering triggered by I.
     */
    UpperRoman = 17,

    /**
     * Numbering triggered by I)
     */
    UpperRomanParenthesis = 18,

    /**
     * Numbering triggered by (I)
     */
    UpperRomanDoubleParenthesis = 19,

    /**
     * Numbering triggered by I-
     */
    UpperRomanDash = 20,

    /**
     * Maximum value of the enum
     */
    Max = 20,
}
