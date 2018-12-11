import getTagOfNode from './getTagOfNode';

const BLOCK_ELEMENT_TAGS = 'ADDRESS,ARTICLE,ASIDE,BLOCKQUOTE,CANVAS,DD,DIV,DL,DT,FIELDSET,FIGCAPTION,FIGURE,FOOTER,FORM,H1,H2,H3,H4,H5,H6,HEADER,HR,LI,MAIN,NAV,NOSCRIPT,OL,OUTPUT,P,PRE,SECTION,TABLE,TD,TH,TFOOT,UL,VIDEO'.split(
    ','
);
const BLOCK_DISPLAY_STYLES = ['block', 'list-item', 'table-cell'];

/**
 * Checks if the node is a block like element. Block like element are usually those P, DIV, LI, TD etc.
 * @param node The node to check
 * @returns True if the node is a block element, otherwise false
 */
export default function isBlockElement(node: Node): boolean {
    let tag = getTagOfNode(node);
    return !!(
        tag &&
        (BLOCK_DISPLAY_STYLES.indexOf((<HTMLElement>node).style.display) >= 0 ||
            BLOCK_ELEMENT_TAGS.indexOf(tag) >= 0)
    );
}
