import type { getSourceFunction, getSourceInputParams } from './getPasteSource';

const WORD_CLASSES = [
    'OutlineElement',
    'NumberListStyle',
    'WACImageContainer',
    'ListContainerWrapper',
    'BulletListStyle',
    'TableInsertRowGapBlank',
    'TableColumnResizeHandle',
    'TableCellTopBorderHandle',
    'TableCellLeftBorderHandle',
    'TableHoverColumnHandle',
    'TableHoverRowHandle',
    'ListMarkerWrappingSpan',
    'TableCellContent',
    'Paragraph',
    'WACImageContainer',
    'WACImageBorder',
    'TableContainer',
    'LineBreakBlob',
    'TableWordWrap',
];

const WAC_IDENTIFY_SELECTOR =
    'ul[class^="BulletListStyle"]>.OutlineElement,ol[class^="NumberListStyle"]>.OutlineElement,span.WACImageContainer,' +
    WORD_CLASSES.map(c => '.' + c).join(',');

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
