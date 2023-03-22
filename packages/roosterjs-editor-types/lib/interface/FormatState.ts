import ModeIndependentColor from './ModeIndependentColor';
import TableFormat from './TableFormat';

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
     * Whether the text is in Code element
     */
    isCodeInline?: boolean;

    /**
     * Whether the text is in Code block
     */
    isCodeBlock?: boolean;

    /**
     * Whether unlink command can be called to the text
     */
    canUnlink?: boolean;

    /**
     * Whether the selected text is multiline
     */
    isMultilineSelection?: boolean;

    /**
     * Whether add image alt text command can be called to the text
     */
    canAddImageAltText?: boolean;

    /**
     * Header level (0-6, 0 means no header)
     */
    headerLevel?: number;

    /**
     * Whether the cursor is in table
     */
    isInTable?: boolean;

    /**
     * Format of table, if there is table at cursor position
     */
    tableFormat?: TableFormat;

    /**
     * If there is a table, whether the table has header row
     */
    tableHasHeader?: boolean;

    /**
     * Whether we can execute table cell merge operation
     */
    canMergeTableCell?: boolean;
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

    /**
     * Line height
     */
    lineHeight?: string;

    /**
     * Margin Top
     */
    marginTop?: string;

    /**
     * Margin Bottom
     */
    marginBottom?: string;

    /**
     * Text Align
     */
    textAlign?: string;

    /**
     * Direction of the element ('ltr' or 'rtl')
     */
    direction?: string;
}

/**
 * Specify if editor can undo/redo an editing operation
 */
export interface EditorUndoState {
    /**
     * Whether the content can be undone
     */
    canUndo?: boolean;

    /**
     * Whether the content ca nbe redone
     */
    canRedo?: boolean;
}

/**
 * The format state
 */
export default interface FormatState
    extends PendableFormatState,
        ElementBasedFormatState,
        StyleBasedFormatState,
        EditorUndoState {
    /**
     * Whether editor is in dark mode
     */
    isDarkMode?: boolean;

    /**
     * Current zoom scale of editor
     */
    zoomScale?: number;
}
