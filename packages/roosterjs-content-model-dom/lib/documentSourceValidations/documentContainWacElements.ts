import type { GetSourceFunction } from './getDocumentSource';

// Constants duplicated from roosterjs-content-model-plugins to avoid circular dependency
const BULLET_LIST_STYLE = 'BulletListStyle';
const NUMBER_LIST_STYLE = 'NumberListStyle';
const OUTLINE_ELEMENT = 'OutlineElement';
const IMAGE_BORDER = 'WACImageBorder';
const IMAGE_CONTAINER = 'WACImageContainer';
const COMMENT_HIGHLIGHT_CLASS = 'CommentHighlightRest';
const COMMENT_HIGHLIGHT_CLICKED_CLASS = 'CommentHighlightClicked';

const WORD_ONLINE_TABLE_TEMP_ELEMENT_CLASSES = [
    'TableInsertRowGapBlank',
    'TableColumnResizeHandle',
    'TableCellTopBorderHandle',
    'TableCellLeftBorderHandle',
    'TableHoverColumnHandle',
    'TableHoverRowHandle',
];

const REMOVE_MARGIN_ELEMENTS =
    `span.${IMAGE_CONTAINER},span.${IMAGE_BORDER},.${COMMENT_HIGHLIGHT_CLASS},.${COMMENT_HIGHLIGHT_CLICKED_CLASS},` +
    WORD_ONLINE_TABLE_TEMP_ELEMENT_CLASSES.map(c => `table div[class^="${c}"]`).join(',');

const WAC_IDENTIFY_SELECTOR = `ul[class^="${BULLET_LIST_STYLE}"]>.${OUTLINE_ELEMENT},ol[class^="${NUMBER_LIST_STYLE}"]>.${OUTLINE_ELEMENT},${REMOVE_MARGIN_ELEMENTS}`;

/**
 * @internal
 * Check whether the fragment provided contain Wac Elements
 * @param props Properties related to the PasteEvent
 * @returns
 */
export const documentContainWacElements: GetSourceFunction = props => {
    const { fragment } = props;
    return !!fragment.querySelector(WAC_IDENTIFY_SELECTOR);
};
