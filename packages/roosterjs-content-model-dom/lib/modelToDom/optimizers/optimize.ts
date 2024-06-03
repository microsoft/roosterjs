import { enumerateInheritedStyle, removeUnnecessaryStyle } from './removeUnnecessaryStyle';
import { isEntityElement } from '../../domUtils/entityUtils';
import { mergeNode } from './mergeNode';
import { removeUnnecessaryAttribute } from './removeUnnecessaryAttribute';
import { removeUnnecessarySpan } from './removeUnnecessarySpan';

/**
 * @internal
 */
export function optimize(root: Node, isRecursive: boolean = false) {
    /**
     * Do no do any optimization to entity
     */
    if (isEntityElement(root)) {
        return;
    }
    if (!isRecursive && root.parentElement != null) {
        const computedAttributes = {} as Record<string, Attr>;
        // html doesn't provide computed attributes, use parent's attributes directly
        Array.from(root.parentElement.attributes).forEach(attr => {
            computedAttributes[attr.name] = attr;
        });
        removeUnnecessaryAttribute(root, computedAttributes);

        const computedStyle = {} as Record<string, Set<string>>;
        enumerateInheritedStyle(root.parentElement, (key, values) => {
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
