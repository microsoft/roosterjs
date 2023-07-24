import type { getSourceFunction, getSourceInputParams } from './getPasteSource';

const WORD_ONLINE_TABLE_TEMP_ELEMENT_CLASSES = [
    'TableInsertRowGapBlank',
    'TableColumnResizeHandle',
    'TableCellTopBorderHandle',
    'TableCellLeftBorderHandle',
    'TableHoverColumnHandle',
    'TableHoverRowHandle',
];

const WAC_IDENTIFY_SELECTOR =
    'ul[class^="BulletListStyle"]>.OutlineElement,ol[class^="NumberListStyle"]>.OutlineElement,span.WACImageContainer,' +
    WORD_ONLINE_TABLE_TEMP_ELEMENT_CLASSES.map(c => `table div[class^="${c}"]`).join(',');

/**
 * @internal
 * Check whether the fragment provided contain Wac Elements
 * @param props Properties related to the PasteEvent
 * @returns
 */
const documentContainWacElements: getSourceFunction = (props: getSourceInputParams) => {
    const { fragment } = props;
    return !!fragment.querySelector(WAC_IDENTIFY_SELECTOR);
};
export default documentContainWacElements;
