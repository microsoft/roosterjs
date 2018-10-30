import getTagOfNode from './getTagOfNode';

/**
 * HTML void elements
 * Per https://www.w3.org/TR/html/syntax.html#syntax-elements, cannot have child nodes
 * This regex is used when we move focus to very begin of editor. We should avoid putting focus inside
 * void elements so users don't accidently create child nodes in them
 */
const HTML_VOID_ELEMENTS = 'AREA,BASE,BR,COL,COMMAND,EMBED,HR,IMG,INPUT,KEYGEN,LINK,META,PARAM,SOURCE,TRACK,WBR'.split(
    ','
);

/**
 * Check if the given node is html void element. Void element cannot have childen
 * @param node The node to check
 */
export default function isVoidHtmlElement(node: Node): boolean {
    return !!node && HTML_VOID_ELEMENTS.indexOf(getTagOfNode(node)) >= 0;
}
