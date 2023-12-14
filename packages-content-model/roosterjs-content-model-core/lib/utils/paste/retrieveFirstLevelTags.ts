import { isNodeOfType } from 'roosterjs-content-model-dom';

/**
 * @internal
 */
export function retrieveFirstLevelTags(doc: Document): string[] {
    const result: string[] = [];

    for (let child = doc.body.firstChild; child; child = child.nextSibling) {
        if (isNodeOfType(child, 'TEXT_NODE')) {
            const trimmedString = child.nodeValue?.replace(/(\r\n|\r|\n)/gm, '').trim();
            if (trimmedString) {
                result.push(''); // Push an empty string as tag for text node
            }
        } else if (isNodeOfType(child, 'ELEMENT_NODE')) {
            result.push(child.tagName);
        }
    }

    return result;
}
