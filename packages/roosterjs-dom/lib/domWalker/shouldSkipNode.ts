import getComputedStyle from '../utils/getComputedStyle';
import { NodeType } from 'roosterjs-types';

// Check if it is an empty text node
function isEmptyTextNode(node: Node): boolean {
    return !!(
        node &&
        node.nodeType == NodeType.Text &&
        (!node.nodeValue || node.textContent == '')
    );
}

// Checks if it is text node that contains only CRLF
// Use case: Edge/IE often injects some CRLF text node in-between elements i.e.
// <div>{CRLF}<div>hello world</div></div>, those {CRLF} is not shown but creates noise
// that we want to skip
function isCRLFOnlyTextNode(node: Node): boolean {
    let isCRLF = false;
    if (node && node.nodeType == NodeType.Text && node.nodeValue) {
        let reg = /^[\r\n]+$/gm;
        isCRLF = reg.test(node.nodeValue);
    }

    return isCRLF;
}

// Checks if the element has a display: none or empty if it is not an element
function isDisplayNone(node: Node): boolean {
    return getComputedStyle(node, 'display') == 'none';
}

// Skip a node when any of following conditions are true
// - it is neither Element nor Text
// - it is a text node but is empty
// - it is a text node but contains just CRLF (noisy text node that often comes in-between elements)
// - has a display:none
export default function shouldSkipNode(node: Node): boolean {
    return (
        (node.nodeType != NodeType.Element && node.nodeType != NodeType.Text) ||
        isEmptyTextNode(node) ||
        isCRLFOnlyTextNode(node) ||
        isDisplayNone(node)
    );
}
