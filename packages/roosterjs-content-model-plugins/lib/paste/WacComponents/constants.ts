/**
 * @internal
 **/
export const WORD_ONLINE_TABLE_TEMP_ELEMENT_CLASSES: string[] = [
    'TableInsertRowGapBlank',
    'TableColumnResizeHandle',
    'TableCellTopBorderHandle',
    'TableCellLeftBorderHandle',
    'TableHoverColumnHandle',
    'TableHoverRowHandle',
];
/**
 * @internal
 **/
export const IMAGE_BORDER: string = 'WACImageBorder';
/**
 * @internal
 **/
export const IMAGE_CONTAINER: string = 'WACImageContainer';
/**
 * @internal
 **/
export const PARAGRAPH: string = 'Paragraph';
/**
 * @internal
 **/
export const LIST_CONTAINER_ELEMENT_CLASS_NAME: string = 'ListContainerWrapper';
/**
 * @internal
 **/
export const COMMENT_HIGHLIGHT_CLASS: string = 'CommentHighlightRest';
/**
 * @internal
 **/
export const COMMENT_HIGHLIGHT_CLICKED_CLASS: string = 'CommentHighlightClicked';
/**
 * @internal
 **/
export const TEMP_ELEMENTS_CLASSES: string[] = [
    ...WORD_ONLINE_TABLE_TEMP_ELEMENT_CLASSES,
    'ListMarkerWrappingSpan',
];

/**
 * @internal
 */
export const REMOVE_MARGIN_ELEMENTS: string =
    `span.${IMAGE_CONTAINER},span.${IMAGE_BORDER},.${COMMENT_HIGHLIGHT_CLASS},.${COMMENT_HIGHLIGHT_CLICKED_CLASS},` +
    WORD_ONLINE_TABLE_TEMP_ELEMENT_CLASSES.map(c => `table div[class^="${c}"]`).join(',');
