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
export const BULLET_LIST_STYLE: string = 'BulletListStyle';
/**
 * @internal
 **/
export const NUMBER_LIST_STYLE: string = 'NumberListStyle';
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
export const OUTLINE_ELEMENT: string = 'OutlineElement';
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
export const TABLE_CONTAINER: string = 'TableContainer';
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
 **/
export const WAC_IDENTIFY_SELECTOR: string =
    `ul[class^="${BULLET_LIST_STYLE}"]>.${OUTLINE_ELEMENT},ol[class^="${NUMBER_LIST_STYLE}"]>.${OUTLINE_ELEMENT},span.${IMAGE_CONTAINER},span.${IMAGE_BORDER},.${COMMENT_HIGHLIGHT_CLASS},.${COMMENT_HIGHLIGHT_CLICKED_CLASS},` +
    WORD_ONLINE_TABLE_TEMP_ELEMENT_CLASSES.map(c => `table div[class^="${c}"]`).join(',');
/**
 * @internal
 **/
export const CLASSES_TO_KEEP: string[] = [
    OUTLINE_ELEMENT,
    IMAGE_CONTAINER,
    ...TEMP_ELEMENTS_CLASSES,
    PARAGRAPH,
    IMAGE_BORDER,
    TABLE_CONTAINER,
    COMMENT_HIGHLIGHT_CLASS,
    COMMENT_HIGHLIGHT_CLICKED_CLASS,
    'NumberListStyle',
    'ListContainerWrapper',
    'BulletListStyle',
    'TableCellContent',
    'WACImageContainer',
    'LineBreakBlob',
];
