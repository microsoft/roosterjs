/**
 * Command strings for Document.execCommand() API
 * https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand
 */
export const enum DocumentCommand {
    /**
     * Changes the browser auto-link behavior (Internet Explorer only)
     */
    AutoUrlDetect = 'AutoUrlDetect',

    /**
     * Changes the document background color. In styleWithCss mode, it affects the background color of the containing block instead.
     * This requires a &lt;color&gt; value string to be passed in as a value argument. Note that Internet Explorer uses this to set the
     * text background color.
     */
    BackColor = 'backColor',

    /**
     * Toggles bold on/off for the selection or at the insertion point. Internet Explorer uses the &lt;strong&gt; tag instead of &lt;b&gt;.
     */
    Bold = 'bold',

    /**
     * Clears all authentication credentials from the cache.
     */
    ClearAuthenticationCache = 'ClearAuthenticationCache',

    /**
     * Makes the content document either read-only or editable. This requires a boolean true/false as the value argument.
     * (Not supported by Internet Explorer.)
     */
    ContentReadOnly = 'contentReadOnly',

    /**
     * Copies the current selection to the clipboard. Conditions of having this behavior enabled vary from one browser to another,
     * and have evolved over time. Check the compatibility table to determine if you can use it in your case.
     */
    Copy = 'copy',

    /**
     * Creates an hyperlink from the selection, but only if there is a selection. Requires a URI string as a value argument for the
     * hyperlink's href. The URI must contain at least a single character, which may be whitespace.
     * (Internet Explorer will create a link with a null value.)
     */
    CreateLink = 'createLink',

    /**
     * Removes the current selection and copies it to the clipboard. When this behavior is enabled varies between browsers,
     * and its conditions have evolved over time. Check the compatibility table for usage details.
     */
    Cut = 'cut',

    /**
     * Adds a &lt;small&gt; tag around the selection or at the insertion point. (Not supported by Internet Explorer.)
     */
    DecreaseFontSize = 'decreaseFontSize',

    /**
     * Changes the paragraph separator used when new paragraphs are created in editable text regions. See Differences in markup
     * generation for more details.
     */
    DefaultParagraphSeparator = 'defaultParagraphSeparator',

    /**
     * Deletes the current selection.
     */
    Delete = 'delete',

    /**
     * Enables or disables the table row/column insertion and deletion controls. (Not supported by Internet Explorer.)
     */
    EnableInlineTableEditing = 'enableInlineTableEditing',

    /**
     * Enables or disables the resize handles on images and other resizable objects. (Not supported by Internet Explorer.)
     */
    EnableObjectResizing = 'enableObjectResizing',

    /**
     * Changes the font name for the selection or at the insertion point. This requires a font name string (like "Arial")
     * as a value argument.
     */
    FontName = 'fontName',

    /**
     * Changes the font size for the selection or at the insertion point. This requires an integer from 1-7 as a value argument.
     */
    FontSize = 'fontSize',

    /**
     * Changes a font color for the selection or at the insertion point. This requires a hexadecimal color value string
     * as a value argument.
     */
    ForeColor = 'foreColor',

    /**
     * Adds an HTML block-level element around the line containing the current selection, replacing the block element containing
     * the line if one exists (in Firefox, &lt;blockquote&gt; is the exception — it will wrap any containing block element).
     * Requires a tag-name string as a value argument. Virtually all block-level elements can be used.
     * (Internet Explorer supports only heading tags H1–H6, ADDRESS, and PRE, which must be wrapped in angle brackets, such as "&lt;H1&gt;".)
     */
    FormatBlock = 'formatBlock',

    /**
     * Deletes the character ahead of the cursor's position, identical to hitting the Delete key on a Windows keyboard.
     */
    ForwardDelete = 'forwardDelete',

    /**
     * Adds a heading element around a selection or insertion point line. Requires the tag-name strings a value argument (i.e. "H1", "H6").
     * (Not supported by Internet Explorer and Safari.)
     */
    Heading = 'heading',

    /**
     * Changes the background color for the selection or at the insertion point. Requires a color value string as a value argument.
     * useCSS must be true for this to function. (Not supported by Internet Explorer.)
     */
    HiliteColor = 'hiliteColor',

    /**
     * Adds a &lt;big&gt; tag around the selection or at the insertion point. (Not supported by Internet Explorer.)
     */
    IncreaseFontSize = 'increaseFontSize',

    /**
     * Indents the line containing the selection or insertion point. In Firefox, if the selection spans multiple lines at different
     * levels of indentation, only the least indented lines in the selection will be indented.
     */
    Indent = 'indent',

    /**
     * Controls whether the Enter key inserts a &lt;br&gt; element, or splits the current block element into two.
     * (Not supported by Internet Explorer.)
     */
    InsertBrOnReturn = 'insertBrOnReturn',

    /**
     * Inserts a &lt;hr&gt; element at the insertion point, or replaces the selection with it.
     */
    InsertHorizontalRule = 'insertHorizontalRule',

    /**
     * Inserts an HTML string at the insertion point (deletes selection). Requires a valid HTML string as a value argument.
     * (Not supported by Internet Explorer.)
     */
    InsertHTML = 'insertHTML',

    /**
     * Inserts an image at the insertion point (deletes selection). Requires a URL string for the image's src as a value argument.
     * The requirements for this string are the same as createLink.
     */
    InsertImage = 'insertImage',

    /**
     * Creates a numbered ordered list for the selection or at the insertion point.
     */
    InsertOrderedList = 'insertOrderedList',

    /**
     * Creates a bulleted unordered list for the selection or at the insertion point.
     */
    InsertUnorderedList = 'insertUnorderedList',

    /**
     * Inserts a paragraph around the selection or the current line.
     * (Internet Explorer inserts a paragraph at the insertion point and deletes the selection.)
     */
    InsertParagraph = 'insertParagraph',

    /**
     * Inserts the given plain text at the insertion point (deletes selection).
     */
    InsertText = 'insertText',

    /**
     * Toggles italics on/off for the selection or at the insertion point.
     * (Internet Explorer uses the &lt;em&gt; element instead of &lt;i&gt;.)
     */
    Italic = 'italic',

    /**
     * Centers the selection or insertion point.
     */
    JustifyCenter = 'justifyCenter',

    /**
     * Justifies the selection or insertion point.
     */
    JustifyFull = 'justifyFull',

    /**
     * Justifies the selection or insertion point to the left.
     */
    JustifyLeft = 'justifyLeft',

    /**
     * Right-justifies the selection or the insertion point.
     */
    JustifyRight = 'justifyRight',

    /**
     * Outdents the line containing the selection or insertion point.
     */
    Outdent = 'outdent',

    /**
     * Pastes the clipboard contents at the insertion point (replaces current selection). Disabled for web content. See [1].
     */
    Paste = 'paste',

    /**
     * Redoes the previous undo command.
     */
    Redo = 'redo',

    /**
     * Removes all formatting from the current selection.
     */
    RemoveFormat = 'removeFormat',

    /**
     * Selects all of the content of the editable region.
     */
    SelectAll = 'selectAll',

    /**
     * Toggles strikethrough on/off for the selection or at the insertion point.
     */
    StrikeThrough = 'strikeThrough',

    /**
     * Toggles subscript on/off for the selection or at the insertion point.
     */
    Subscript = 'subscript',

    /**
     * Toggles superscript on/off for the selection or at the insertion point.
     */
    Superscript = 'superscript',

    /**
     * Toggles underline on/off for the selection or at the insertion point.
     */
    Underline = 'underline',

    /**
     * Undoes the last executed command.
     */
    Undo = 'undo',

    /**
     * Removes the anchor element from a selected hyperlink.
     */
    Unlink = 'unlink',

    /**
     * Replaces the useCSS command. true modifies/generates style attributes in markup, false generates presentational elements.
     */
    StyleWithCSS = 'styleWithCSS',
}
