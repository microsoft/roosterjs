import ModeIndependentColor from './ModeIndependentColor';

/**
 * Format states that can have pending state.
 *
 * e.g., When using execCommand('bold') target to a collapsed selection, browser will enter bold state,
 * but there isn't a &lt;B&gt; tag until user type something, or the state will be rollback if selection
 * is changed.
 */
export interface PendableFormatState {
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
     * Whether the text has strike through line
     */
    isStrikeThrough?: boolean;

    /**
     * Whether the text is in subscript mode
     */
    isSubscript?: boolean;

    /**
     * Whether the text is in superscript mode
     */
    isSuperscript?: boolean;
}

/**
 * Format state represented by DOM element
 */
export interface ElementBasedFormatState {
    /**
     * Whether the text is in bullet mode
     */
    isBullet?: boolean;

    /**
     * Whether the text is in numbering mode
     */
    isNumbering?: boolean;

    /**
     * Whether the text is in block quote
     */
    isBlockQuote?: boolean;

    /**
     * Whether unlink command can be called to the text
     */
    canUnlink?: boolean;

    /**
     * Whether add image alt text command can be called to the text
     */
    canAddImageAltText?: boolean;

    /**
     * Header level (0-6, 0 means no header)
     */
    headerLevel?: number;
}

/**
 * Format states represented by CSS style
 */
export interface StyleBasedFormatState {
    /**
     * Font name
     */
    fontName?: string;

    /**
     * Font size
     */
    fontSize?: string;

    /**
     * Background color
     */
    backgroundColor?: string;

    /**
     * Mode independent background color for dark mode
     */
    backgroundColors?: ModeIndependentColor;

    /**
     * Text color
     */
    textColor?: string;

    /**
     * Mode independent background color for dark mode
     */
    textColors?: ModeIndependentColor;
}

/**
 * The format state
 */
export default interface FormatState
    extends PendableFormatState,
        ElementBasedFormatState,
        StyleBasedFormatState {
    /**
     * @deprecated Use editor.canUndo() instead
     * Whether the content can be undone
     */
    canUndo?: boolean;

    /**
     * @deprecated Use editor.canRedo() instead
     * Whether the content ca nbe redone
     */
    canRedo?: boolean;
}
