/**
 * An inline character border, separate from image, link and block borders.
 */
export type TextBorderFormat = {
    /** Identifies a single source box across differently formatted text runs. */
    textBorderId?: string;
    textBorderTop?: string;
    textBorderRight?: string;
    textBorderBottom?: string;
    textBorderLeft?: string;
    textBorderPaddingTop?: string;
    textBorderPaddingRight?: string;
    textBorderPaddingBottom?: string;
    textBorderPaddingLeft?: string;
    /** Background behind the box's padding, independent of individual run backgrounds. */
    textBorderBackgroundColor?: string;
};
