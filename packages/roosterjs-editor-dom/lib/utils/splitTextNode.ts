/**
 * Split a text node into two parts by an offset number, and return one of them
 * @param textNode The text node to split
 * @param offset The offset number to split at
 * @param returnFirstPart True to return the first part, then the passed in textNode will become the second part.
 * Otherwise return the second part, and the passed in textNode will become the first part
 */
export default function splitTextNode(textNode: Text, offset: number, returnFirstPart: boolean) {
    const firstPart = textNode.nodeValue.substr(0, offset);
    const secondPart = textNode.nodeValue.substr(offset);
    const newNode = textNode.ownerDocument.createTextNode(returnFirstPart ? firstPart : secondPart);
    textNode.nodeValue = returnFirstPart ? secondPart : firstPart;
    textNode.parentNode.insertBefore(newNode, returnFirstPart ? textNode : textNode.nextSibling);
    return newNode;
}
