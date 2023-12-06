const WORD_ONLINE_TABLE_TEMP_ELEMENT_CLASSES = [
    'TableInsertRowGapBlank',
    'TableColumnResizeHandle',
    'TableCellTopBorderHandle',
    'TableCellLeftBorderHandle',
    'TableHoverColumnHandle',
    'TableHoverRowHandle',
];

export const IMAGE_BORDER = 'WACImageBorder';
export const IMAGE_CONTAINER = 'WACImageContainer';
export const OUTLINE_ELEMENT = 'OutlineElement';
export const BULLET_LIST_STYLE = 'BulletListStyle';
export const NUMBER_LIST_STYLE = 'NumberListStyle';

/**
 * @internal
 */
export const LIST_CONTAINER_ELEMENT_CLASS_NAME = 'ListContainerWrapper';
/**
 * @internal
 */
export const PARAGRAPH = 'Paragraph';
/**
 * @internal
 */
export const TABLE_CONTAINER = 'TableContainer';
/**
 * @internal
 */
export const COMMENT_HIGHLIGHT_CLASS = 'CommentHighlightRest';
export const COMMENT_HIGHLIGHT_CLICKED_CLASS = 'CommentHighlightClicked';

/**
 * @internal
 */
export const TEMP_ELEMENTS_CLASSES = [
    ...WORD_ONLINE_TABLE_TEMP_ELEMENT_CLASSES,
    'ListMarkerWrappingSpan',
];

/**
 * @internal
 */
export const WAC_IDENTIFY_SELECTOR =
    `ul[class^="${BULLET_LIST_STYLE}"]>.${OUTLINE_ELEMENT},ol[class^="${NUMBER_LIST_STYLE}"]>.${OUTLINE_ELEMENT},span.${IMAGE_CONTAINER},span.${IMAGE_BORDER},.${COMMENT_HIGHLIGHT_CLASS},.${COMMENT_HIGHLIGHT_CLICKED_CLASS},` +
    WORD_ONLINE_TABLE_TEMP_ELEMENT_CLASSES.map(c => `table div[class^="${c}"]`).join(',');
