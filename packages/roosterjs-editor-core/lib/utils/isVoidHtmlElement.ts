import { getTagOfNode } from 'roosterjs-editor-dom';

// HTML void elements
// Per https://www.w3.org/TR/html/syntax.html#syntax-elements, cannot have child nodes
// This regex is used when we move focus to very begin of editor. We should avoid putting focus inside
// void elements so users don't accidently create child nodes in them
const HTML_VOID_ELEMENTS_REGEX = /^(AREA|BASE|BR|COL|COMMAND|EMBED|HR|IMG|INPUT|KEYGEN|LINK|META|PARAM|SOURCE|TRACK|WBR)$/i;

// check if it is html void element. void element cannot have childen
export default function isVoidHtmlElement(element: HTMLElement): boolean {
    return element && HTML_VOID_ELEMENTS_REGEX.test(getTagOfNode(element)) ? true : false;
}
