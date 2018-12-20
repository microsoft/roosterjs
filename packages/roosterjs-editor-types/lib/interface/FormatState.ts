/**
 * The format state
 */
interface FormatState {
    /**
     * Font name
     */
    fontName?: string;

    /**
     * Font size
     */
    fontSize?: string;

    /**
     * Whether the text is bolded
     */
    isBold?: boolean;

    /**
     * Whether the text is italic
     */
    isItalic?: boolean;

    /**
     * Whether the text has underline
     */
    isUnderline?: boolean;

    /**
     * Background color
     */
    backgroundColor?: string;

    /**
     * Text color
     */
    textColor?: string;

    /**
     * Whether the text is in bullet mode
     */
    isBullet?: boolean;

    /**
     * Whether the text is in numbering mode
     */
    isNumbering?: boolean;

    /**
     * Whether the text has strike through line
     */
    isStrikeThrough?: boolean;

    /**
     * Whether the text is in block quote
     */
    isBlockQuote?: boolean;

    /**
     * Whether the text is in subscript mode
     */
    isSubscript?: boolean;

    /**
     * Whether the text is in superscript mode
     */
    isSuperscript?: boolean;

    /**
     * Whether unlink command can be called to the text
     */
    canUnlink?: boolean;

    /**
     * Whether add image alt text command can be called to the text
     */
    canAddImageAltText?: boolean;

    /**
     * Whether the content can be undone
     */
    canUndo?: boolean;

    /**
     * Whether the content ca nbe redone
     */
    canRedo?: boolean;

    /**
     * Header level (0-6, 0 means no header)
     */
    headerLevel?: number;
}

export default FormatState;
