import { enumerateComputedStyle, removeUnnecessaryAttribute, removeUnnecessarySpan, removeUnnecessaryStyle } from './removeUnnecessarySpan';
import { isEntityElement } from '../../domUtils/entityUtils';
import { mergeNode } from './mergeNode';

/**
 * @internal
 */
export function optimize(root: Node, isRecursive = false) {
    /**
     * Do no do any optimization to entity
     */
    if (isEntityElement(root)) {
        return;
    }
    if (!isRecursive && root.parentElement != null) {
        let computedAttributes = {} as Record<string, Attr>;
        // html doesn't provide computed attributes, use parent's attributes directly
        Array.from(root.parentElement.attributes).forEach((attr) => {
            computedAttributes[attr.name] = attr;
        });
        removeUnnecessaryAttribute(root, computedAttributes);

        let computedStyle = {} as Record<string, Set<string>>;
        enumerateComputedStyle(root.parentElement, (key, values) => {
            computedStyle[key] = values;
        });
        removeUnnecessaryStyle(root, computedStyle);
    }

    removeUnnecessarySpan(root);
    mergeNode(root);

    for (let child = root.firstChild; child; child = child.nextSibling) {
        optimize(child, true);
    }
}
