import type { TableMetadataFormat } from '../contentModel/format/metadata/TableMetadataFormat';
import type { ImageFormatState } from './ImageFormatState';

/**
 * The format object state in Content Model
 */
export interface ContentModelFormatState {
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
     * Heading level (0-6, 0 means no heading)
     */
    headingLevel?: number;

    /**
     * Whether the cursor is in table
     */
    isInTable?: boolean;

    /**
     * Format of table, if there is table at cursor position
     */
    tableFormat?: TableMetadataFormat;

    /**
     * If there is a table, whether the table has header row
     */
    tableHasHeader?: boolean;

    /**
     * Whether we can execute table cell merge operation
     */
    canMergeTableCell?: boolean;

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
     * Text color
     */
    textColor?: string;

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

    /**
     * Font weight
     */
    fontWeight?: string;

    /**
     * Format of image, if there is table at cursor position
     */
    imageFormat?: ImageFormatState;

    /**
     * Letter spacing
     */
    letterSpacing?: string;

    /**
     * Whether the content can be undone
     */
    canUndo?: boolean;

    /**
     * Whether the content ca nbe redone
     */
    canRedo?: boolean;

    /**
     * Whether editor is in dark mode
     */
    isDarkMode?: boolean;
}
