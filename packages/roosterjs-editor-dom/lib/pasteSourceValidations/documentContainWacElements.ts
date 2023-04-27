import type { getSourceFunction, getSourceInputParams } from './getPasteSource';

const WAC_IDENTIFY_SELECTOR =
    'ul[class^="BulletListStyle"]>.OutlineElement,ol[class^="NumberListStyle"]>.OutlineElement,span.WACImageContainer';

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
