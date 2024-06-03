import { isNodeOfType } from '../../domUtils/isNodeOfType';

/**
 * @internal
 */
export function removeUnnecessaryAttribute(root: Node, computedAttributes: Record<string, Attr>) {
    if (!isNodeOfType(root, 'ELEMENT_NODE')) {
        return;
    }
    const newComputedAttributes = {
        ...computedAttributes,
    };
    for (let i = root.attributes.length - 1; i >= 0; i--) {
        const attr = root.attributes[i];
        if (attr.name === 'style') {
            continue;
        }
        if (newComputedAttributes[attr.name]?.isEqualNode(attr) ?? false) {
            root.removeAttribute(attr.name);
        } else {
            newComputedAttributes[attr.name] = attr;
        }
    }

    for (let child = root.firstChild; child; child = child.nextSibling) {
        removeUnnecessaryAttribute(child, newComputedAttributes);
    }
}
