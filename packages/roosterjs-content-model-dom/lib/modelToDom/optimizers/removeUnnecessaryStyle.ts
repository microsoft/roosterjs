import { INHERITABLE_PROPERTIES } from 'roosterjs-editor-dom/lib/htmlSanitizer/getInheritableStyles';
import { isNodeOfType } from '../../domUtils/isNodeOfType';

/**
 * @internal
 */
export function enumerateInheritedStyle(
    element: HTMLElement,
    handler: (key: string, value: Set<string>) => void
) {
    element.style.cssText.split(';').forEach(value => {
        const [key, valueText] = value.split(':').map(part => part.trim());
        if (!key || !valueText || !INHERITABLE_PROPERTIES.includes(key)) {
            return;
        }
        const values = new Set(valueText.split(',').map(value => value.trim()));

        handler(key, values);
    });
}

/**
 * @internal
 */
export function removeUnnecessaryStyle(root: Node, computedCSS: Record<string, Set<string>>) {
    if (!isNodeOfType(root, 'ELEMENT_NODE')) {
        return;
    }
    const newComputedCSS = {
        ...computedCSS,
    };
    enumerateInheritedStyle(root, (key, values) => {
        if (
            computedCSS[key]?.size === values.size &&
            [...computedCSS[key]].every(value => values.has(value))
        ) {
            root.style.removeProperty(key);
        } else {
            newComputedCSS[key] = values;
        }
    });

    if (root.style.cssText === '') {
        root.removeAttribute('style');
    }

    for (let child = root.firstChild; child; child = child.nextSibling) {
        removeUnnecessaryStyle(child, newComputedCSS);
    }
}
